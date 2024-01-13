package com.andreassolli.leaderboard.repositories;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.andreassolli.leaderboard.models.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import at.favre.lib.crypto.bcrypt.BCrypt;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Iterator;
import java.util.Optional;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class SummonerRepository {
    @Value("${RIOT_KEY}")
    private String riotKey;

    @Value("${PASSWORD}")
    private String managePassword;

    private String getPassword(){
        return managePassword;
    }

    private String getApiUrl() {
        return "?api_key=" + riotKey;
    }
    String gameName = "https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/";
    String puuidByTag = "https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/";
    String summonerNameIcon = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/";
    String rankWinLoss = "https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/";

    private final RestTemplate restTemplate = new RestTemplate();

    private final JdbcTemplate db;

    private Logger logger = LoggerFactory.getLogger(SummonerRepository.class);

    //VIEW FUNCTIONS START
    public List<SummonerDto> getAllSummonersView() {
        String sql = "SELECT * FROM frontendSummoner ORDER BY dbo.rankToInt(CONCAT(rank, tier, lp)) DESC";

        try {
            return db.query(sql, new BeanPropertyRowMapper<>(SummonerDto.class));

        } catch (Exception e) {
            logger.error("Error in getting all summoners " + e);
            return null;
        }
    }

    public List<Summoner> getAllSummoners() {
        String sql = "SELECT * FROM Summoner ORDER BY dbo.rankToInt(CONCAT(rank, tier, lp)) DESC";

        try {
            return db.query(sql, new BeanPropertyRowMapper<>(Summoner.class));

        } catch (Exception e) {
            logger.error("Error in getting all summoners " + e);
            return null;
        }
    }

    public LocalDateTime getTime() {
        String sql = "SELECT Time FROM Info";
        try {
            return db.query(sql, rs -> {
                if (rs.next()) {
                    return rs.getTimestamp("Time").toLocalDateTime();
                }
                return LocalDateTime.now();
            });
        } catch (Exception e) {
            logger.error("Could not fetch Time", e);
            return LocalDateTime.now();
        }
    }

    public int serviceStatus() {
        try {
            String url = "https://euw1.api.riotgames.com/lol/status/v4/platform-data" + getApiUrl();
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            JsonNode maintenances = root.path("maintenances");
            JsonNode incidents = root.path("incidents");

            return maintenances.size() + incidents.size();
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    //VIEW FUNCTIONS END

    //UPDATE FUNCTIONS START
    public boolean updateSummoners() {
        LocalDateTime lastUpdatedTime = getTime();
        LocalDateTime currentTime = LocalDateTime.now();

        if (ChronoUnit.MINUTES.between(lastUpdatedTime, currentTime) < 2) {
            return false;
        }

        List<Summoner> summoners = getAllSummoners();
        for (Summoner summoner : summoners) {
            try {
                updateGameName(summoner, summoner.getPuuid());
                updateSummonerNameIcon(summoner, summoner.getPuuid());
                updateRankWinLoss(summoner, summoner.getSummonerId());
                if (updateSummoner(summoner)){
                    logger.info("Updated summoner: " + summoner.getGameName());
                } else {
                    logger.error("Could not update " + summoner.getGameName());
                    return false;
                }
            } catch (Exception e) {
                logger.error("Error updating summoner: " + summoner.getSummonerName(), e);
                return false;
            }
        }

        String newTimeSql = "UPDATE Info SET Time = ?";
        try {
            db.update(newTimeSql, LocalDateTime.now());
        } catch (Exception e) {
            logger.error("Could not save new Time", e);
        }

        return true;
    }

    private void updateSummonerNameIcon(Summoner summoner, String summonerName) {
        String url = summonerNameIcon + summonerName + getApiUrl();
        SummonerNameIconDto summonerNameIconData = restTemplate.getForObject(url, SummonerNameIconDto.class);
        if (summonerNameIconData != null) {
            summoner.setSummonerName(summonerNameIconData.getName());
            summoner.setSummonerIcon(summonerNameIconData.getProfileIconId());
            summoner.setSummonerId(summonerNameIconData.getId());
        }
    }

    private void updateRankWinLoss(Summoner summoner, String summonerId) {
        String url = rankWinLoss + summonerId + getApiUrl();
        RankWinLossDto[] rankWinLossDataArray = restTemplate.getForObject(url, RankWinLossDto[].class);

        if (rankWinLossDataArray != null) {
            Optional<RankWinLossDto> rankWinLossData = Arrays.stream(rankWinLossDataArray)
                    .filter(dto -> "RANKED_SOLO_5x5".equals(dto.getQueueType()))
                    .findFirst();

            if (rankWinLossData.isPresent()) {
                RankWinLossDto dto = rankWinLossData.get();
                summoner.setHotStreak(dto.isHotStreak() ? 1 : 0);
                summoner.setLosses(dto.getLosses());
                summoner.setWins(dto.getWins());
                summoner.setRank(dto.getRank());
                summoner.setTier(dto.getTier());
                summoner.setLp(dto.getLeaguePoints());
            } else {
                summoner.setLosses(0);
                summoner.setWins(0);
                summoner.setTier("UNRANKED");
                summoner.setRank("");
                summoner.setLp(0);
                summoner.setHotStreak(0);
            }
        }
    }

    private void updateGameName(Summoner summoner, String puuid) {
        String url = gameName + puuid + getApiUrl();
        GameNameDto gameNameData = restTemplate.getForObject(url, GameNameDto.class);
        if (gameNameData != null) {
            summoner.setGameName(gameNameData.getGameName());
            summoner.setTagLine(gameNameData.getTagLine());
        }
    }

    public boolean updateChampionMastery(String patchVersion){
        List<SummonerDto> summoners = getAllSummonersView();
        for (SummonerDto summoner : summoners) {
            if (setMastery(patchVersion, summoner)) return false;
        }
        return true;
    }


    public void updateChampionForSummoner(String name, String tag, String patchVersion){
        SummonerDto summoner = getSummoners(name, tag);
        setMastery(patchVersion, summoner);
    }

    private boolean updateSummoner(Summoner summoner) {
        String sql = "UPDATE Summoner SET gameName=?, tagLine=?, summonerId=?, summonerName=?, rank=?, tier=?, lp=?, summonerIcon=?, wins=?, losses=?, hotStreak=? WHERE puuid=?";

        try {
            db.update(sql,
                    summoner.getGameName(),
                    summoner.getTagLine(),
                    summoner.getSummonerId(),
                    summoner.getSummonerName(),
                    summoner.getRank(),
                    summoner.getTier(),
                    summoner.getLp(),
                    summoner.getSummonerIcon(),
                    summoner.getWins(),
                    summoner.getLosses(),
                    summoner.getHotStreak(),
                    summoner.getPuuid());
            return true;
        } catch (Exception e) {
            logger.error("Error saving summoner: " + e);
            return false;
        }
    }

    public boolean updateMastery(SummonerDto summoner) {
        String sql = "UPDATE Summoner SET masteryPoints=?, championMastery=?, championImages=? WHERE gameName=? AND tagLine=?";
        try {
            String championMasteryString = String.join(",", summoner.getChampionMastery());
            String championImagesString = String.join(",", summoner.getChampionImages());
            String masteryPointsString = String.join(",", summoner.getMasteryPoints());
            db.update(sql,
                    masteryPointsString,
                    championMasteryString,
                    championImagesString,
                    summoner.getGameName(),
                    summoner.getTagLine());
            return true;
        } catch (Exception e) {
            logger.error("Error updating summoner: " + e);
            return false;
        }
    }

    //UPDATE FUNCTIONS END


    //SET FUNCTIONS START
    private boolean setMastery(String patchVersion, SummonerDto summoner) {
        try {
            String[][] mastery;
            mastery=setChampionMastery(summoner.getGameName(), summoner.getTagLine(), patchVersion);
            summoner.setMasteryPoints(mastery[2]);
            summoner.setChampionMastery(mastery[1]);
            summoner.setChampionImages(mastery[0]);
            if (updateMastery(summoner)){
                logger.info("Updated summoner: " + summoner.getGameName());
            } else {
                logger.error("Could not update " + summoner.getGameName());
                return true;
            }
        } catch (Exception e) {
            logger.error("Error updating summoner: " + summoner.getSummonerName(), e);
            return true;
        }
        return false;
    }

    public String[][] setChampionMastery(String name, String tag, String patchVersion){
        try {
            ChampionMastery[] championMasteries = getChampionMasteries(name, tag);
            JSONObject championsData = getChampionData(patchVersion);
            int[] topChampionIds = getTopChampionIds(championMasteries);
            String[] championNames = new String[3];
            String[] championImages = new String[3];
            String[] masteryPoints = new String[3];

            for (int i = 0; i < 3; i++) {
                processChampionData(topChampionIds[i], championsData, championNames, championImages, masteryPoints, championMasteries, i);
            }

            return generateResult(championImages, championNames, masteryPoints);
        } catch (Exception e) {
            logger.error("Error in setChampionMastery: ", e);
            return new String[2][3];
        }
    }

    private void setPuuid(Summoner summoner) {
        String url = puuidByTag + summoner.getGameName() + "/" + summoner.getTagLine() + getApiUrl();
        Summoner gameNameData = restTemplate.getForObject(url, Summoner.class);
        if (gameNameData != null) {
            summoner.setPuuid(gameNameData.getPuuid());
            summoner.setGameName(gameNameData.getGameName());
            summoner.setTagLine(gameNameData.getTagLine());
        }
    }


    //SET FUNCTIONS END

    //ADD FUNCTIONS START
    private boolean addSummoner(Summoner summoner) {
        String sql = "INSERT INTO Summoner (gameName, tagLine, summonerId, summonerName, rank, tier, lp, summonerIcon, wins, losses, hotstreak, puuid, opgg) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try {
            db.update(sql,
                    summoner.getGameName(),
                    summoner.getTagLine(),
                    summoner.getSummonerId(),
                    summoner.getSummonerName(),
                    summoner.getRank(),
                    summoner.getTier(),
                    summoner.getLp(),
                    summoner.getSummonerIcon(),
                    summoner.getWins(),
                    summoner.getLosses(),
                    summoner.getHotStreak(),
                    summoner.getPuuid(),
                    addOpgg(summoner));
            return true;
        } catch (Exception e) {
            logger.error("Error inserting summoner: " + e);
            return false;
        }
    }

    public boolean addGameNameTag(String name, String tag) {
        //if (!(getVerify().equals(password))) return;
        Summoner summoner = new Summoner();
        summoner.setTagLine(tag);
        summoner.setGameName(name);
        try {
            completeSummoner(summoner);
            return true;
        } catch (Exception e){
            logger.error("Could not complete summoner " + name + "#" + tag);
            return false;
        }

    }

    //ADD FUNCTIONS END

    //GET FUNCTIONS START
    public ChampionMastery[] getChampionMasteries(String name, String tag) {
        GameNameDto summonerPuuid = restTemplate.getForObject(puuidByTag + name + "/" + tag + getApiUrl(), GameNameDto.class);
        String MasteryChampions = "https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/"
                + summonerPuuid.getPuuid() + getApiUrl();
        return restTemplate.getForObject(MasteryChampions, ChampionMastery[].class);
    }

    public JSONObject getChampionData(String patchVersion) throws JSONException {
        String IdToChampUrl = "https://ddragon.leagueoflegends.com/cdn/" + patchVersion + "/data/en_US/champion.json";
        ResponseEntity<String> response = restTemplate.getForEntity(IdToChampUrl, String.class);
        return new JSONObject(response.getBody()).getJSONObject("data");
    }

    public int[] getTopChampionIds(ChampionMastery[] championMasteries) {
        Arrays.sort(championMasteries, (a, b) -> Integer.compare(b.getChampionPoints(), a.getChampionPoints()));

        int[] topChampionIds = new int[3];
        for (int i = 0; i < 3; i++) {
            topChampionIds[i] = championMasteries[i].getChampionId();
        }
        return topChampionIds;
    }

    public SummonerDto getSummoner(String name, String tag) {
        String url = puuidByTag + name + "/" + tag + getApiUrl();
        GameNameDto gameNameData = restTemplate.getForObject(url, GameNameDto.class);

        String iconUrl = summonerNameIcon + gameNameData.getPuuid() + getApiUrl();
        SummonerNameIconDto summonerNameIconData = restTemplate.getForObject(iconUrl, SummonerNameIconDto.class);

        SummonerDto summoner = new SummonerDto();
        summoner.setGameName(gameNameData.getGameName());
        summoner.setTagLine(gameNameData.getTagLine());
        summoner.setSummonerIcon(summonerNameIconData.getProfileIconId());

        return summoner;
    }

    public SummonerDto getSummoners(String name, String tag){
        String sql = "SELECT * FROM frontendSummoner WHERE gameName=? AND tagLine=?";
        try {
            return db.queryForObject(sql, new BeanPropertyRowMapper<>(SummonerDto.class), name, tag);
        } catch (Exception e) {
            logger.error("Error " + e);
            return null;
        }
    }


    //GET FUNCTIONS END
    public void completeSummoner(Summoner summoner) {
            try {
                setPuuid(summoner);
                updateSummonerNameIcon(summoner, summoner.getPuuid());
                updateRankWinLoss(summoner, summoner.getSummonerId());
                if (addSummoner(summoner)){
                    logger.info("Updated summoner: " + summoner.getGameName());
                } else {
                    logger.error("Could not update " + summoner.getGameName());
                }
            } catch (Exception e) {
                logger.error("Error updating summoner: " + summoner.getSummonerName(), e);
            }
    }

    public boolean removeSummoner(String gameName, String tagLine) {
        //if (!(getVerify().equals(password))) return;
        String sql = "DELETE FROM Summoner WHERE gameName=? AND tagLine=?";
        try {
            db.update(sql, gameName, tagLine);
            return true;
        } catch (Exception e) {
            logger.error("Could not delete " + gameName + "#" + tagLine);
            return false;
        }
    }

    public boolean checkPassword(String inputPassword) {
        BCrypt.Result result = BCrypt.verifyer().verify(inputPassword.toCharArray(), getPassword());
        return result.verified;
    }

    public void processChampionData(int champId, JSONObject championsData, String[] championNames, String[] championImages, String[] masteryPoints, ChampionMastery[] championMasteries, int i) throws JSONException {
        Iterator<String> keys = championsData.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            JSONObject champion = championsData.getJSONObject(key);
            if (champion.getString("key").equals(String.valueOf(champId))) {
                championNames[i] = champion.getString("name");
                championImages[i] = champion.getJSONObject("image").getString("full");
                masteryPoints[i] = String.valueOf(championMasteries[i].getChampionPoints());
                break;
            }
        }
    }

    public String[][] generateResult(String[] championImages, String[] championNames, String[] masteryPoints) {
        String[][] result = new String[3][3];
        result[0] = championImages;
        result[1] = championNames;
        result[2] = masteryPoints;
        return result;
    }

    public List<Summoner> updateOpgg(){
        List<Summoner> summoners = getAllSummoners();
        for (Summoner summoner : summoners){
            String sql = "UPDATE Summoner SET opgg = ? WHERE gameName = ? AND tagLine = ?";
            try {
                db.update(sql,
                        addOpgg(summoner),
                        summoner.getGameName(),
                        summoner.getTagLine());
            } catch (Exception e){
                logger.error("Could not update " + summoner.getGameName());
            }
        }
        return summoners;
    }

    public String addOpgg(Summoner summoner) {
        String url = "https://www.op.gg/multisearch/euw?summoners=" + summoner.getGameName() + "%23" + summoner.getTagLine();
        String summonerId = null;
        try {
            Document doc = Jsoup.connect(url).get();
            Element scriptElement = doc.selectFirst("#__NEXT_DATA__");
            if (scriptElement != null) {
                String scriptData = scriptElement.html();
                Gson gson = new Gson();
                JsonObject jsonObject = gson.fromJson(scriptData, JsonObject.class);
                JsonArray summonersArray = jsonObject.getAsJsonObject("props")
                        .getAsJsonObject("pageProps")
                        .getAsJsonArray("summoners");

                for (JsonElement summonerElement : summonersArray) {
                    JsonObject summonerObject = summonerElement.getAsJsonObject();
                    summonerId = summonerObject.get("summoner_id").getAsString();
                }
            } else {
                System.out.println("Element not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return summonerId;

    }


}

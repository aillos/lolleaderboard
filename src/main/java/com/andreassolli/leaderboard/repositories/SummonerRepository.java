package com.andreassolli.leaderboard.repositories;

import com.andreassolli.leaderboard.models.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import at.favre.lib.crypto.bcrypt.BCrypt;

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

    public void completeSummoner(Summoner summoner) {
            try {
                addPuuid(summoner);
                updateSummonerNameIcon(summoner, summoner.getPuuid());
                updateRankWinLoss(summoner, summoner.getSummonerId());
                if (insertSummoner(summoner)){
                    logger.info("Updated summoner: " + summoner.getGameName());
                } else {
                    logger.error("Could not update " + summoner.getGameName());
                }
            } catch (Exception e) {
                logger.error("Error updating summoner: " + summoner.getSummonerName(), e);
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
                    if (saveSummoner(summoner)){
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

    private void updateGameName(Summoner summoner, String puuid) {
        String url = gameName + puuid + getApiUrl();
        GameNameDto gameNameData = restTemplate.getForObject(url, GameNameDto.class);
        if (gameNameData != null) {
            summoner.setGameName(gameNameData.getGameName());
            summoner.setTagLine(gameNameData.getTagLine());
        }
    }

    private void addPuuid(Summoner summoner) {
        String url = puuidByTag + summoner.getGameName() + "/" + summoner.getTagLine() + getApiUrl();
        Summoner gameNameData = restTemplate.getForObject(url, Summoner.class);
        if (gameNameData != null) {
            summoner.setPuuid(gameNameData.getPuuid());
            summoner.setGameName(gameNameData.getGameName());
            summoner.setTagLine(gameNameData.getTagLine());
        }
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


    private boolean saveSummoner(Summoner summoner) {
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

    private boolean insertSummoner(Summoner summoner) {
        String sql = "INSERT INTO Summoner (gameName, tagLine, summonerId, summonerName, rank, tier, lp, summonerIcon, wins, losses, hotstreak, puuid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
            logger.error("Error inserting summoner: " + e);
            return false;
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

    public boolean addSummoner(String name, String tag) {
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

    public SummonerDto searchSummoner(String name, String tag) {
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

    public boolean checkPassword(String inputPassword) {
        BCrypt.Result result = BCrypt.verifyer().verify(inputPassword.toCharArray(), getPassword());
        return result.verified;
    }

    public boolean saveMastery(SummonerDto summoner) {
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

    public boolean updateChampionMastery(String patchVersion){
        List<SummonerDto> summoners = getAllSummonersView();
        for (SummonerDto summoner : summoners) {
            if (setMastery(patchVersion, summoner)) return false;
        }
        return true;
    }

    public SummonerDto getSummoner(String name, String tag){
        String sql = "SELECT * FROM frontendSummoner WHERE gameName=? AND tagLine=?";
        try {
            return db.queryForObject(sql, new BeanPropertyRowMapper<>(SummonerDto.class), name, tag);
        } catch (Exception e) {
            logger.error("Error " + e);
            return null;
        }
    }


    public void updateChampionForSummoner(String name, String tag, String patchVersion){
        SummonerDto summoner = getSummoner(name, tag);
        setMastery(patchVersion, summoner);
    }

    private boolean setMastery(String patchVersion, SummonerDto summoner) {
        try {
            String[][] mastery;
            mastery=setChampionMastery(summoner.getGameName(), summoner.getTagLine(), patchVersion);
            summoner.setMasteryPoints(mastery[2]);
            summoner.setChampionMastery(mastery[1]);
            summoner.setChampionImages(mastery[0]);
            if (saveMastery(summoner)){
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
        String IdToChampUrl = "https://ddragon.leagueoflegends.com/cdn/" + patchVersion + "/data/en_US/champion.json";
        String [] championNames = new String[3];
        String [] championImages = new String[3];
        String [] masteryPoints = new String[3];
        GameNameDto summonerPuuid = restTemplate.getForObject(puuidByTag + name + "/" + tag + getApiUrl(), GameNameDto.class);
        String puuid = summonerPuuid.getPuuid();
        String MasteryChampions = "https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/" + puuid + getApiUrl();
        try {
            ChampionMastery[] championMasteries = restTemplate.getForObject(MasteryChampions, ChampionMastery[].class);
            Arrays.sort(championMasteries, (a, b) -> Integer.compare(b.getChampionPoints(), a.getChampionPoints()));

            int[] topChampionIds = new int[3];
            for (int i = 0; i < 3; i++) {
                topChampionIds[i] = championMasteries[i].getChampionId();
            }

            try {
                ResponseEntity<String> response = restTemplate.getForEntity(IdToChampUrl, String.class);
                JSONObject championsData = new JSONObject(response.getBody()).getJSONObject("data");

                for (int i = 0; i < 3; i++) {
                    int champId = topChampionIds[i];

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
            }catch (Exception e){
                logger.error("Error" + e);
            }

            String[][] result = new String[3][3];
            result[0]=championImages;
            result[1]=championNames;
            result[2]=masteryPoints;
            return result;
        } catch (Exception e) {
            logger.error("Error in setChampionMastery: ", e);
            return new String[2][3];
        }
    }

}

package com.andreassolli.leaderboard.repositories;

import com.andreassolli.leaderboard.models.live.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.andreassolli.leaderboard.models.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.*;
import lombok.RequiredArgsConstructor;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import at.favre.lib.crypto.bcrypt.BCrypt;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class SummonerRepository {
    @Value("${RIOT_KEY}")
    private String riotKey;

    private String getApiUrl() {
        return "?api_key=" + riotKey;
    }

    private final String patchVersion = getPatchVersion();

    String gameName = "https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/";
    String puuidByTag = "https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/";
    String summonerNameIcon = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/";
    String rankWinLoss = "https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/";

    private final RestTemplate restTemplate = new RestTemplate();

    private final JdbcTemplate db;

    private Logger logger = LoggerFactory.getLogger(SummonerRepository.class);

    //VIEW FUNCTIONS START
    public List<SummonerDto> getAllSummonersView() {
        String sql = "SELECT * FROM frontendSummoner ORDER BY points DESC";
        return getSummonerDtos(sql);
    }

    public List<SummonerDto> getAllSummonersViewFlex() {
        String sql = "SELECT * FROM frontendSummoner ORDER BY flexPoints DESC";
        return getSummonerDtos(sql);
    }

    private List<SummonerDto> getSummonerDtos(String sql) {
        try {
            return db.query(sql, new BeanPropertyRowMapper<>(SummonerDto.class));
        } catch (Exception e) {
            logger.error("Error in getting all summoners " + e);
            return null;
        }
    }

    public List<Summoner> getAllSummoners() {
        String sql = "SELECT * FROM Summoner ORDER BY points DESC";

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

    public LocalDateTime getLiveTime() {
        String sql = "SELECT liveTime FROM Info";
        try {
            return db.query(sql, rs -> {
                if (rs.next()) {
                    return rs.getTimestamp("liveTime").toLocalDateTime();
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

    public String getGameNameByPuuid(String puuid) {
        String sql = "SELECT gameName FROM Summoner WHERE puuid = ?";
        try {
            return db.queryForObject(sql, String.class, puuid);
        } catch (EmptyResultDataAccessException e) {
            return null;
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

            Optional<RankWinLossDto> flexRankWinLoss = Arrays.stream(rankWinLossDataArray)
                    .filter(dto -> "RANKED_FLEX_SR".equals(dto.getQueueType()))
                    .findFirst();

            if (flexRankWinLoss.isPresent()) {
                RankWinLossDto dto = flexRankWinLoss.get();
                summoner.setFlexHotStreak(dto.isHotStreak() ? 1 : 0);
                summoner.setFlexLosses(dto.getLosses());
                summoner.setFlexWins(dto.getWins());
                summoner.setFlexRank(dto.getRank());
                summoner.setFlexTier(dto.getTier());
                summoner.setFlexLp(dto.getLeaguePoints());
            } else {
                summoner.setFlexLosses(0);
                summoner.setFlexWins(0);
                summoner.setFlexTier("UNRANKED");
                summoner.setFlexRank("");
                summoner.setFlexLp(0);
                summoner.setFlexHotStreak(0);
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
        String sql = "UPDATE Summoner SET gameName=?, tagLine=?, summonerId=?, summonerName=?, rank=?, tier=?, lp=?, summonerIcon=?, wins=?, losses=?, hotStreak=?, mostPlayedChampion=?, mostPlayedKDA=?, mostPlayedWR=?, mostPlayedName=?, mostPlayedImage=? WHERE puuid=?";
        String[][] opgg = getMostPlayed(summoner.getOpgg(), "SOLORANKED");
        String[][] mostPlayedNamesImages = getChampionNamesAndImages(opgg, getPatchVersion());
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
                    intoString(opgg[0]),
                    intoString(opgg[1]),
                    intoString(opgg[2]),
                    intoString(mostPlayedNamesImages[0]),
                    intoString(mostPlayedNamesImages[1]),
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
            logger.error("Error updating summoner: " + summoner.getGameName(), e);
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

    public String getPatchVersion() {
        String urlString = "https://ddragon.leagueoflegends.com/realms/euw.json";
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            StringBuilder content = new StringBuilder();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            connection.disconnect();

            JSONObject json = new JSONObject(content.toString());
            return json.getString("v");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    //ADD FUNCTIONS START
    private boolean addSummoner(Summoner summoner) {
        String sql = "INSERT INTO Summoner (gameName, tagLine, summonerId, summonerName, rank, tier, lp, summonerIcon, wins, losses, hotstreak, puuid, opgg, mostPlayedChampion, mostPlayedKDA, mostPlayedWR, mostPlayedName, mostPlayedImage, prevRank, mostPlayedChampionFlex, mostPlayedKDAFlex, mostPlayedWRFlex, mostPlayedNameFlex, mostPlayedImageFlex, flexLp, flexRank, flexTier, flexWins, flexLosses) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        summoner.setOpgg(addOpgg(summoner));
        String[][] opgg = getMostPlayed(summoner.getOpgg(), "SOLORANKED");
        String[][] mostPlayedNamesImages = getChampionNamesAndImages(opgg, getPatchVersion());
        String[][] opgg2 = getMostPlayed(summoner.getOpgg(), "FLEXRANKED");
        String[][] mostPlayedNamesImages2 = getChampionNamesAndImages(opgg, getPatchVersion());
        String prevSeason = getPreviousSeason(summoner);
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
                    addOpgg(summoner),
                    intoString(opgg[0]),
                    intoString(opgg[1]),
                    intoString(opgg[2]),
                    intoString(mostPlayedNamesImages[0]),
                    intoString(mostPlayedNamesImages[1]),
                    prevSeason,
                    intoString(opgg2[0]),
                    intoString(opgg2[1]),
                    intoString(opgg2[2]),
                    intoString(mostPlayedNamesImages2[0]),
                    intoString(mostPlayedNamesImages2[1]),
                    summoner.getFlexLp(),
                    summoner.getFlexRank(),
                    summoner.getFlexTier(),
                    summoner.getFlexWins(),
                    summoner.getFlexLosses());
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

    public boolean updateRankedSummoners(){
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
                if (updateRanked(summoner)){
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

    public boolean updateSoloqOpgg(){
        List<Summoner> summoners = getAllSummoners();
        for (Summoner summoner : summoners){
            String sql = "UPDATE Summoner SET mostPlayedChampion=?, mostPlayedKDA=?, mostPlayedWR=?, mostPlayedName=?, mostPlayedImage=? WHERE gameName = ? AND tagLine = ?";
            String[][] opgg = getMostPlayed(summoner.getOpgg(), "SOLORANKED");
            updateChampions(summoner, sql, opgg);
        }
        return true;
    }

    public boolean updateFlexOpgg(){
        List<Summoner> summoners = getAllSummoners();
        for (Summoner summoner : summoners){
            String sql = "UPDATE Summoner SET mostPlayedChampionFlex=?, mostPlayedKDAFlex=?, mostPlayedWRFlex=?, mostPlayedNameFlex=?, mostPlayedImageFlex=? WHERE gameName = ? AND tagLine = ?";
            String[][] opgg = getMostPlayed(summoner.getOpgg(), "FLEXRANKED");
            updateChampions(summoner, sql, opgg);
        }
        return true;
    }

    private void updateChampions(Summoner summoner, String sql, String[][] opgg) {
        String[][] mostPlayedNamesImages = getChampionNamesAndImages(opgg, getPatchVersion());
        try {
            db.update(sql,
                    intoString(opgg[0]),
                    intoString(opgg[1]),
                    intoString(opgg[2]),
                    intoString(mostPlayedNamesImages[0]),
                    intoString(mostPlayedNamesImages[1]),
                    summoner.getGameName(),
                    summoner.getTagLine());
        } catch (Exception e){
            logger.error("Could not update " + summoner.getGameName());
            logger.error(e.toString());
        }
    }

    private boolean updateRanked(Summoner summoner) {
        String sql = "UPDATE Summoner SET gameName=?, tagLine=?, summonerId=?, summonerName=?, rank=?, tier=?, lp=?, summonerIcon=?, wins=?, losses=?, hotStreak=?, flexLp=?, flexRank=?, flexTier=?, flexWins=?, flexLosses=?, flexHotStreak=? WHERE puuid=?";
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
                    summoner.getFlexLp(),
                    summoner.getFlexRank(),
                    summoner.getFlexTier(),
                    summoner.getFlexWins(),
                    summoner.getFlexLosses(),
                    summoner.getFlexHotStreak(),
                    summoner.getPuuid());
            return true;
        } catch (Exception e) {
            logger.error("Error saving summoner: " + e);
            return false;
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
        String sql = "DELETE FROM Summoner WHERE REPLACE(gameName, ' ', '') = ? AND tagLine = ?";
        try {
            db.update(sql, gameName.replace(" ", ""), tagLine);
            return true;
        } catch (Exception e) {
            logger.error("Could not delete " + gameName + "#" + tagLine);
            return false;
        }
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

    public List<Summoner> updatePrevious() {
        List<Summoner> summoners = getAllSummoners();
        for (Summoner summoner : summoners) {
            String sql = "UPDATE Summoner SET prevRank = ? WHERE gameName = ? AND tagLine = ?";
            try {
                db.update(sql,
                        getPreviousSeason(summoner),
                        summoner.getGameName(),
                        summoner.getTagLine());
            } catch (Exception e) {
                logger.error("Could not update " + summoner.getGameName());
            }
        }
        return summoners;
    }

    public void addSeasonId(){
        String sql = "UPDATE Info SET seasonsId=?";
        try {
            db.update(sql,
                    SeasonId(),
                    "Rank");
        } catch (Exception e){
            logger.error("Could not update seasonsId");
        }
    }

    public String getSeasonId(){
        String sql = "SELECT seasonsId FROM Info";
        return db.queryForObject(sql, String.class);
    }

    public int SeasonId() {
        String url = "https://www.op.gg/multisearch/na?summoners=phreak%23Puns";
        try {
            Document doc = Jsoup.connect(url).get();
            Element scriptElement = doc.selectFirst("#__NEXT_DATA__");
            if (scriptElement != null) {
                String scriptData = scriptElement.html();
                Gson gson = new Gson();
                JsonObject jsonObject = gson.fromJson(scriptData, JsonObject.class);

                JsonObject seasonObject = jsonObject.getAsJsonObject("props")
                        .getAsJsonObject("pageProps")
                        .getAsJsonObject("seasonsById");

                int lastId = -1;
                for (String key : seasonObject.keySet()) {
                    JsonObject innerObject = seasonObject.getAsJsonObject(key);
                    lastId = innerObject.get("id").getAsInt();
                }

                return lastId;
            }
        } catch (Exception e) {
            return 0;
        }
        return 0;
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

    public String getPreviousSeason(Summoner summoner) {
        String rankUrl = "https://op.gg/api/v1.0/internal/bypass/summoners/euw/" + summoner.getOpgg() + "/summary";

        String division = null;
        String tier = null;
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet request = new HttpGet(rankUrl);
            String json = EntityUtils.toString(httpClient.execute(request).getEntity());

            JsonObject jsonObject = JsonParser.parseString(json).getAsJsonObject();
            JsonObject dataObject = jsonObject.getAsJsonObject("data");
            if (dataObject != null) {
                JsonObject summonerObject = dataObject.getAsJsonObject("summoner");
                if (summonerObject != null) {
                    JsonArray previousSeasons = summonerObject.getAsJsonArray("previous_seasons");
                    if (previousSeasons != null && previousSeasons.size() > 0) {
                        JsonObject firstSeason = previousSeasons.get(0).getAsJsonObject();
                        JsonObject tierInfo = firstSeason.getAsJsonObject("tier_info");
                        if (tierInfo != null) {
                            tier = tierInfo.get("tier").getAsString();
                            division = tierInfo.get("division").getAsString();
                        }
                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return tier + " " + division;
    }

    public String[][] getMostPlayed(String id, String queueType) {
        String[][] stats = new String[4][3];
        for (int i = 0; i < 3; i++) {
            stats[0][i] = "0";
            stats[1][i] = "0";
            stats[2][i] = "0";
        }

        String url = "https://op.gg/api/v1.0/internal/bypass/summoners/euw/" + id + "/most-champions/rank?game_type=" + queueType + "&season_id=" + getSeasonId();
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet request = new HttpGet(url);
            String json = EntityUtils.toString(httpClient.execute(request).getEntity());

            JsonObject jsonObject = JsonParser.parseString(json).getAsJsonObject();
            JsonElement dataElement = jsonObject.get("data");


            if (dataElement != null && dataElement.isJsonObject()) {
                JsonObject dataObject = dataElement.getAsJsonObject();
                JsonArray championStats = dataObject.getAsJsonArray("champion_stats");

                if (championStats != null && championStats.size() > 0) {
                    for (int i = 0; i < Math.min(3, championStats.size()); i++) {
                        JsonObject champion = championStats.get(i).getAsJsonObject();
                        stats[0][i] = champion.get("id").getAsString();
                        int games = champion.get("play").getAsInt();
                        int kills = champion.get("kill").getAsInt();
                        int deaths = champion.get("death").getAsInt();
                        int assists = champion.get("assist").getAsInt();
                        int avgKills = kills/games;
                        int avgDeaths = deaths/games;
                        int avgAssists = assists/games;
                        stats[1][i] =  avgKills + "/" + avgDeaths + "/" + avgAssists;
                        stats[2][i] = champion.get("win") + ", " + champion.get("lose");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return stats;
    }

    public String[][] getChampionNamesAndImages(String[][] championIds, String patchVersion) {
        String[][] namesAndImages = new String[2][3];
        try {
            JSONObject championsData = getChampionData(patchVersion);
            for (int i = 0; i < championIds[0].length; i++) {
                int champId = Integer.parseInt(championIds[0][i]);
                String[] nameAndImage = getChampionNameAndImage(champId, championsData);
                namesAndImages[0][i] = nameAndImage[0];
                namesAndImages[1][i] = nameAndImage[1];
            }
        } catch (JSONException e) {
            logger.error("Error in getChampionNamesAndImages: ", e);
        }

        return namesAndImages;
    }

    private String[] getChampionNameAndImage(int champId, JSONObject championsData) throws JSONException {
        Iterator<String> keys = championsData.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            JSONObject champion = championsData.getJSONObject(key);
            if (champion.getString("key").equals(String.valueOf(champId))) {
                String name = champion.getString("name");
                String image = champion.getJSONObject("image").getString("full");
                return new String[]{name, image};
            }
        }
        return new String[]{"Unknown", "Unknown"};
    }

    public String intoString(String[] array) {
        return String.join(",", array);
    }

    public String getSummonerId(String name, String tag){
        String sql = "SELECT summonerId FROM Summoner WHERE gameName=? AND tagLine=?";
        return db.queryForObject(sql, String.class, name, tag);
    }

    public Summoner checkLive(Summoner summoner) {;
        String url = "https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/" + summoner.getSummonerId() + getApiUrl();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                LiveGame liveGame = objectMapper.readValue(response.getBody(), LiveGame.class);
                summoner.setLiveData(objectMapper.writeValueAsString(convertToLiveGameDto(liveGame)));

                summoner.setIsLive("true");
            } else {
                summoner.setIsLive("false");
            }
        } catch (Exception e) {
            summoner.setIsLive("false");
        }

        return summoner;
    }

    public Queues getQueueById(long queueId) {
        List<Queues> queuesList = fetchQueues();
        if (queuesList != null) {
            Optional<Queues> matchingQueue = queuesList.stream()
                    .filter(queue -> queue.getQueueId() == queueId)
                    .findFirst();

            return matchingQueue.orElse(null);
        }
        return null;
    }

    public List<Queues> fetchQueues() {
        RestTemplate restTemplate = new RestTemplate();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String url = "https://static.developer.riotgames.com/docs/lol/queues.json";
            String jsonResponse = restTemplate.getForObject(url, String.class);
            return objectMapper.readValue(jsonResponse, new TypeReference<>() {
            });
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    private LiveGameDto convertToLiveGameDto(LiveGame liveGame) {
        try {
            JSONObject championsData = getChampionData(patchVersion);
            List<ParticipantDto> participantDtos = liveGame.getParticipants().stream()
                    .map(participant -> {
                        String gameName = getGameNameByPuuid(participant.getPuuid());
                        if (gameName != null) {
                            participant.setSummonerName(gameName);
                        }
                        return convertToParticipantDto(participant, championsData);
                    }).collect(Collectors.toList());

            // Additional logic might be needed here for bannedChampions if you want to include names and images
            List<String[]> bannedChampions = liveGame.getBannedChampions().stream()
                    .map(banned -> {
                        try {
                            String [] champion = getChampionNameAndImage((int) banned.getChampionId(), championsData);
                            return new String[]{String.valueOf(banned.getPickTurn()), String.valueOf(banned.getTeamId()), champion[0], champion[1]};
                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }

                    })
                    .collect(Collectors.toList());

            Queues queue = getQueueById(liveGame.getGameQueueConfigId());
            return new LiveGameDto(
                    liveGame.getGameStartTime(),
                    queue.getMap(),
                    queue.getDescription(),
                    liveGame.getGameLength(),
                    bannedChampions,
                    participantDtos
            );
        } catch (Exception e) {
            logger.error("Error in convertToLiveGameDto: ", e);
            return null;
        }
    }

    public SummonerSpell getSpellImageById(String spellId) {
        String summonerSpellUrl = "https://ddragon.leagueoflegends.com/cdn/" + patchVersion +"/data/en_US/summoner.json";

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(summonerSpellUrl, String.class);
            JSONObject json = new JSONObject(response.getBody());
            JSONObject data = json.getJSONObject("data");

            Iterator<String> keys = data.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                JSONObject spell = data.getJSONObject(key);
                if (spell.getString("key").equals(spellId)) {
                    String name = spell.getString("name");
                    String image = spell.getJSONObject("image").getString("full");
                    return new SummonerSpell(spellId, name, image);
                }
            }
        } catch (Exception e) {
            logger.error("Error fetching summoner spell data: ", e);
        }
        return null;
    }


    private ParticipantDto convertToParticipantDto(Participant participant, JSONObject championsData) {
        try {
            String[] championData = getChampionNameAndImage((int) participant.getChampionId(), championsData);
            String championName = championData[0];
            String championImage = championData[1];
            SummonerSpell spell1 = getSpellImageById(participant.getSpell1Id());
            SummonerSpell spell2 = getSpellImageById(participant.getSpell2Id());

            return new ParticipantDto(
                    championName,
                    championImage,
                    participant.getPerks(),
                    participant.isBot(),
                    participant.getTeamId(),
                    participant.getSummonerName(),
                    spell1,
                    spell2
            );
        } catch (JSONException e) {
            logger.error("Error in convertToParticipantDto: ", e);
            return null;
        }
    }


    public void isLive(){
        LocalDateTime lastUpdatedTime = getLiveTime();
        LocalDateTime currentTime = LocalDateTime.now();

        if (ChronoUnit.MINUTES.between(lastUpdatedTime, currentTime) < 3) {
            return;
        }

        List<Summoner> summoners = getAllSummoners();
        for (Summoner summoner : summoners) {
            summoner=checkLive(summoner);
            updateLive(summoner);
        }

        String newTimeSql = "UPDATE Info SET liveTime = ?";
        try {
            db.update(newTimeSql, LocalDateTime.now());
        } catch (Exception e) {
            logger.error("Could not save new Time", e);
        }
    }

    public void updateLive(Summoner summoner){
        String sql = "UPDATE Summoner SET isLive=?, liveData=? WHERE gameName=? AND tagLine=?";

        db.update(sql, summoner.getIsLive(), summoner.getLiveData(), summoner.getGameName(), summoner.getTagLine());
    }


    public SummonerDto getProfile(String name, String tag){
       String sql = "SELECT * FROM frontendSummoner WHERE gameName=? AND tagLine=?";
         try {
              return db.queryForObject(sql, new BeanPropertyRowMapper<>(SummonerDto.class), name, tag);
         } catch (Exception e) {
              logger.error("Error " + e);
              return null;
         }
    }

    public String getOpgg(String name, String tag){
        String sql = "SELECT opgg FROM Summoner WHERE gameName=? AND tagLine=?";
        return db.queryForObject(sql, String.class, name, tag);
    }

}

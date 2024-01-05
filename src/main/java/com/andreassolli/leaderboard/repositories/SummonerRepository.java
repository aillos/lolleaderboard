package com.andreassolli.leaderboard.repositories;

import com.andreassolli.leaderboard.models.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import at.favre.lib.crypto.bcrypt.BCrypt;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Optional;

import java.util.List;

@Repository
public class SummonerRepository {
    @Value("${RIOT_KEY}")
    private String riotKey;

    @Value("${PASSWORD}")
    private String managePassword;

    @Value("${VERIFY}")
    private String verify;

    private String getPassword(){
        return managePassword;
    }

    private String getVerify(){
        return verify;
    }

    private String getApiUrl() {
        return "?api_key=" + riotKey;
    }
    String gameName = "https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/";
    String puuidByTag = "https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/";
    String summonerNameIcon = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/";
    String rankWinLoss = "https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/";

    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private JdbcTemplate db;

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
            try {
                Thread.sleep(5000);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                logger.error("Thread interrupted", ie);
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
            }
        }
    }


    private boolean saveSummoner(Summoner summoner) {
        String sql = "UPDATE Summoner SET gameName=?, tagLine=?, summonerId=?, summonerName=?, rank=?, tier=?, lp=?, summonerIcon=?, wins=?, losses=? WHERE puuid=?";

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
                    summoner.getPuuid());
            return true;
        } catch (Exception e) {
            logger.error("Error saving summoner: " + e);
            return false;
        }
    }

    private boolean insertSummoner(Summoner summoner) {
        String sql = "INSERT INTO Summoner (gameName, tagLine, summonerId, summonerName, rank, tier, lp, summonerIcon, wins, losses, puuid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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

    public String hashString(String input) {
        return BCrypt.withDefaults().hashToString(12, input.toCharArray());
    }

    public boolean checkPassword(String inputPassword) {
        BCrypt.Result result = BCrypt.verifyer().verify(inputPassword.toCharArray(), getPassword());
        return result.verified;
    }

}

package com.andreassolli.leaderboard.repositories;

import com.andreassolli.leaderboard.models.Summoner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Repository
public class SummonerRepository {
    @Value("${RIOT_KEY}")
    private String riotKey;

    @Autowired
    private JdbcTemplate db;

    private Logger logger = LoggerFactory.getLogger(SummonerRepository.class);

    public List<Summoner> getAllSummoners(){
        String sql = "SELECT * FROM Summoner ORDER BY dbo.rankToInt(CONCAT(rank, tier, lp)) DESC";

        try{
            return db.query(sql,new BeanPropertyRowMapper<>(Summoner.class));

        }
        catch(Exception e){
            logger.error("Error in getting all summoners "+e);
            return null;
        }
    }

    public boolean updateSummoners() {
        String gameName = "https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/";
        String summonerNameIcon = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/";
        String rankWinLoss = "https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/";

        return true;
    }
}

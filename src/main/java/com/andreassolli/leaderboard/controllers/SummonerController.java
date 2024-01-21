package com.andreassolli.leaderboard.controllers;

import com.andreassolli.leaderboard.models.Summoner;
import com.andreassolli.leaderboard.models.SummonerDto;
import com.andreassolli.leaderboard.repositories.SummonerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SummonerController {

    private SummonerRepository repo;
    @Autowired
    public void setRepo(SummonerRepository summonerRepository) {
        this.repo = summonerRepository;
    }

    @GetMapping("/service")
    public int serviceStatus(){
        return repo.serviceStatus();
    }

    @GetMapping("/time")
    public LocalDateTime getTime(){
        return repo.getTime();
    }

    @GetMapping("/getAll")
    public List<SummonerDto> getAll() {
        return repo.getAllSummonersView();
    }

    @GetMapping("/update")
    public boolean update() {
        return repo.updateSummoners();
    }

    @GetMapping("/updateRanked")
    public boolean updateRanked() {
        return repo.updateRankedSummoners();
    }

    @GetMapping("/updateMastery/{patch}")
    public boolean updateMastery(@PathVariable String patch){
        return repo.updateChampionMastery(patch);
    }


    @GetMapping("/scrape")
    public List<Summoner> scrape(){
            return repo.updateOpgg();
    }

    @GetMapping("/season")
    public void updateSeason(){
        repo.addSeasonId();
    }

    @GetMapping("/previous")
    public void updatePrevious(){
        repo.updatePrevious();
    }

    @GetMapping("/isLive")
    public void isLive() { repo.isLive(); }
}

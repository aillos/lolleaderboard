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

    @GetMapping("/getAllFlex")
    public List<SummonerDto> getAllFlex() {
        return repo.getAllSummonersViewFlex();
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

    @GetMapping("/updateSolo")
    public boolean updateSolo(){
        return repo.updateSoloqOpgg();
    }

    @GetMapping("/updateFlex")
    public boolean updateFlex(){
        return repo.updateFlexOpgg();
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

    @GetMapping("/add/{name}/{tag}")
    public void add(@PathVariable String name, @PathVariable String tag) { repo.addGameNameTag(name, tag); }

    @GetMapping("/profile/{name}/{tag}")
    public SummonerDto getProfile(@PathVariable String name, @PathVariable String tag) {
        return repo.getProfile(name, tag);
    }

    @GetMapping("/opgg/{name}/{tag}")
    public String getOpgg(@PathVariable String name, @PathVariable String tag) {
        return repo.getOpgg(name, tag);
    }
}

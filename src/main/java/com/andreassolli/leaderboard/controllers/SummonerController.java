package com.andreassolli.leaderboard.controllers;

import com.andreassolli.leaderboard.models.Summoner;
import com.andreassolli.leaderboard.models.SummonerDto;
import com.andreassolli.leaderboard.repositories.SummonerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.NoSuchAlgorithmException;
import java.util.List;

@RestController
public class SummonerController {

    private SummonerRepository repo;
    @Autowired
    public void setRepo(SummonerRepository summonerRepository) {
        this.repo = summonerRepository;
    }

    @GetMapping("/api/getAll")
    public List<SummonerDto> getAll() {
        return repo.getAllSummonersView();
    }

    @GetMapping("/api/update")
    public void update() {
        repo.updateSummoners();
    }

    @GetMapping("/api/add/{name}/{tag}")
    public boolean add(@PathVariable String name, @PathVariable String tag) {
        return repo.addSummoner(name, tag);
    }

    @GetMapping("/api/remove/{name}/{tag}")
    public boolean remove(@PathVariable String name, @PathVariable String tag) {
        return repo.removeSummoner(name, tag);
    }

    @GetMapping("/api/search/{name}/{tag}")
    public SummonerDto search(@PathVariable String name, @PathVariable String tag){
        return repo.searchSummoner(name, tag);
    }

}

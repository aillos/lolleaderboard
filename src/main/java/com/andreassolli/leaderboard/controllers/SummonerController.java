package com.andreassolli.leaderboard.controllers;

import com.andreassolli.leaderboard.models.Summoner;
import com.andreassolli.leaderboard.models.SummonerDto;
import com.andreassolli.leaderboard.repositories.SummonerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("/api/add/{name}/{tag}/{password}")
    public void add(@PathVariable String name, @PathVariable String tag, @PathVariable String password) throws NoSuchAlgorithmException {
        repo.addSummoner(name, tag, password);
    }

    @GetMapping("/api/remove/{name}/{tag}/{password}")
    public void remove(@PathVariable String name, @PathVariable String tag, @PathVariable String password) throws NoSuchAlgorithmException {
        repo.removeSummoner(name, tag, password);
    }

}

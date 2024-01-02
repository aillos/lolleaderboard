package com.andreassolli.leaderboard.controllers;

import com.andreassolli.leaderboard.models.Summoner;
import com.andreassolli.leaderboard.repositories.SummonerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SummonerController {

    @Autowired
    private SummonerRepository repo;

    @GetMapping("/api/getAll")
    public List<Summoner> getAll() {
        return repo.getAllSummoners();
    }
}

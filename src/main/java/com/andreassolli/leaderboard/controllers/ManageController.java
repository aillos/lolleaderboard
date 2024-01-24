package com.andreassolli.leaderboard.controllers;

import com.andreassolli.leaderboard.models.SummonerDto;
import com.andreassolli.leaderboard.repositories.SummonerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@PreAuthorize("hasAuthority('ROLE_USER')")
@RequestMapping("/manage")
public class ManageController {

    private SummonerRepository repo;
    @Autowired
    public void setRepo(SummonerRepository summonerRepository) {
        this.repo = summonerRepository;
    }


    @GetMapping("/add/{name}/{tag}")
    public boolean add(@PathVariable String name, @PathVariable String tag) {
        return repo.addGameNameTag(name, tag);
    }

    @GetMapping("/remove/{name}/{tag}")
    public boolean remove(@PathVariable String name, @PathVariable String tag) {
        return repo.removeSummoner(name, tag);
    }

    @GetMapping("/search/{name}/{tag}")
    public SummonerDto search(@PathVariable String name, @PathVariable String tag){
        return repo.getSummoner(name, tag);
    }

    @GetMapping("/mastery/{name}/{tag}/{patch}")
    public void championMastery(@PathVariable String name, @PathVariable String tag, @PathVariable String patch){
        repo.updateChampionForSummoner(name, tag, patch);
    }
}

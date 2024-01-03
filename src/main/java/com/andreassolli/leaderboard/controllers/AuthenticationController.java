package com.andreassolli.leaderboard.controllers;

import com.andreassolli.leaderboard.repositories.SummonerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthenticationController {

    private SummonerRepository repo;
    @Autowired
    public void setRepo(SummonerRepository summonerRepository) {
        this.repo = summonerRepository;
    }

    @PostMapping("/api/verify-password")
    public ResponseEntity<?> verifyPassword(@RequestBody String password) {
        try {
            boolean isPasswordValid = repo.checkPassword(password);
            return ResponseEntity.ok(isPasswordValid);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred");
        }
    }
}

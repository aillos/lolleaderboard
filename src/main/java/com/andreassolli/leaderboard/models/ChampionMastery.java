package com.andreassolli.leaderboard.models;

public class ChampionMastery {
    public int getChampionId() {
        return championId;
    }

    public int getChampionPoints() {
        return championPoints;
    }

    public void setChampionPoints(int championPoints) {
        this.championPoints = championPoints;
    }

    public void setChampionId(int championId) {
        this.championId = championId;
    }

    private String puuid;
    private int championId;
    private int championLevel;
    private int championPoints;
    private long lastPlayTime;
    private int championPointsSinceLastLevel;
    private int championPointsUntilNextLevel;
    private boolean chestGranted;
    private int tokensEarned;
    private String summonerId;
}
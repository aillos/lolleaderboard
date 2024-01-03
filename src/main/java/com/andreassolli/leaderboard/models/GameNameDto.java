package com.andreassolli.leaderboard.models;

public class GameNameDto {
    private String gameName;
    private String tagLine;
    private String puuid;

    public String getGameName() {
        return gameName;
    }

    public String getPuuid() {
        return puuid;
    }

    public void setPuuid(String puuid) {
        this.puuid = puuid;
    }

    public void setGameName(String gameName) {
        this.gameName = gameName;
    }

    public String getTagLine() {
        return tagLine;
    }

    public void setTagLine(String tagLine) {
        this.tagLine = tagLine;
    }
}

package com.andreassolli.leaderboard.models.live;

import java.util.List;

public class LiveGameDto {
    private long gameStartTime;
    private String map;
    private String gameMode;
    private long gameLength;
    private List<String[]> bannedChampions;
    private List<ParticipantDto> participants;

    public LiveGameDto() {}

    public LiveGameDto(long gameStartTime, String map, String gameMode, long gameLength, List<String[]> bannedChampions, List<ParticipantDto> participants) {
        this.gameStartTime = gameStartTime;
        this.map = map;
        this.gameLength = gameLength;
        this.gameMode = gameMode;
        this.bannedChampions = bannedChampions;
        this.participants = participants;
    }

    public long getGameStartTime() {
        return gameStartTime;
    }

    public void setGameStartTime(long gameStartTime) {
        this.gameStartTime = gameStartTime;
    }

    public String getMap() {
        return map;
    }

    public void setMap(String map) {
        this.map = map;
    }

    public long getGameLength() {
        return gameLength;
    }

    public void setGameLength(long gameLength) {
        this.gameLength = gameLength;
    }

    public String getGameMode() {
        return gameMode;
    }

    public void setGameMode(String gameMode) {
        this.gameMode = gameMode;
    }

    public List<String[]> getBannedChampions() {
        return bannedChampions;
    }

    public void setBannedChampions(List<String[]> bannedChampions) {
        this.bannedChampions = bannedChampions;
    }

    public List<ParticipantDto> getParticipants() {
        return participants;
    }

    public void setParticipants(List<ParticipantDto> participants) {
        this.participants = participants;
    }
}


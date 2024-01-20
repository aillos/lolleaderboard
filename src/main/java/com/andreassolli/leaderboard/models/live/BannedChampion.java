package com.andreassolli.leaderboard.models.live;

public class BannedChampion {
    private long championId;
    private long teamId;
    private int pickTurn;

    public BannedChampion(long championId, long teamId, int pickTurn) {
        this.championId = championId;
        this.teamId = teamId;
        this.pickTurn = pickTurn;
    }

    public BannedChampion() {
    }

    public long getChampionId() {
        return championId;
    }

    public void setChampionId(long championId) {
        this.championId = championId;
    }

    public long getTeamId() {
        return teamId;
    }

    public void setTeamId(long teamId) {
        this.teamId = teamId;
    }

    public int getPickTurn() {
        return pickTurn;
    }

    public void setPickTurn(int pickTurn) {
        this.pickTurn = pickTurn;
    }
}

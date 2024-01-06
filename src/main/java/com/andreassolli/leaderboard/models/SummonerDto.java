package com.andreassolli.leaderboard.models;

public class SummonerDto {
    private String gameName;
    private String tagLine;
    private String summonerName;
    private String rank;
    private String tier;
    private int lp;
    private int summonerIcon;
    private String summonerId;
    private int wins;
    private int losses;

    private String[] championMastery;

    private String[] championImages;

    public String[] getChampionMastery() {
        return championMastery;
    }

    public void setChampionMastery(String[] championMastery) {
        this.championMastery = championMastery;
    }

    public String[] getChampionImages() {
        return championImages;
    }

    public void setChampionImages(String[] championImages) {
        this.championImages = championImages;
    }

    public SummonerDto(String gameName, String tagLine, String summonerName, String rank, String tier, int lp, int summonerIcon, String summonerId, int wins, int losses, String[] championMastery, String[] championImages) {
        this.gameName = gameName;
        this.tagLine = tagLine;
        this.summonerName = summonerName;
        this.rank = rank;
        this.tier = tier;
        this.lp = lp;
        this.summonerIcon = summonerIcon;
        this.summonerId = summonerId;
        this.wins=wins;
        this.losses=losses;
        this.championMastery=championMastery;
        this.championImages=championImages;
    }

    public SummonerDto() {
    }

    public String getGameName() {
        return gameName;
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

    public String getSummonerName() {
        return summonerName;
    }

    public void setSummonerName(String summonerName) {
        this.summonerName = summonerName;
    }

    public String getRank() {
        return rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
    }

    public int getLp() {
        return lp;
    }

    public void setLp(int lp) {
        this.lp = lp;
    }

    public int getSummonerIcon() {
        return summonerIcon;
    }

    public void setSummonerIcon(int summonerIcon) {
        this.summonerIcon = summonerIcon;
    }

    public String getSummonerId() {
        return summonerId;
    }

    public void setSummonerId(String summonerId) {
        this.summonerId = summonerId;
    }

    public int getWins() {
        return wins;
    }

    public void setWins(int wins) {
        this.wins = wins;
    }

    public int getLosses() {
        return losses;
    }

    public void setLosses(int losses) {
        this.losses = losses;
    }
}

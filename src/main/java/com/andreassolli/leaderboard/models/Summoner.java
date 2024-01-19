package com.andreassolli.leaderboard.models;

public class Summoner {
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
    private String puuid;
    private String[] championMastery;
    private String[] championImages;

    private String[] masteryPoints;

    private int hotStreak;

    private String opgg;

    private String[] mostPlayedChampion;

    private String[] mostPlayedImage;

    private String[] mostPlayedKDA;

    private String[] mostPlayedWR;

    private String isLive;


    public Summoner(String gameName, String tagLine, String summonerName, String rank, String tier, int lp, int summonerIcon, String summonerId, int wins, int losses, String puuid, String[] championMastery, String[] championImages, String[] masteryPoints, int hotStreak, String opgg, String[] mostPlayedChampion, String[] mostPlayedImage, String[] mostPlayedKDA, String[] mostPlayedWR, String isLive) {
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
        this.puuid=puuid;
        this.championMastery=championMastery;
        this.championImages=championImages;
        this.masteryPoints=masteryPoints;
        this.hotStreak=hotStreak;
        this.mostPlayedChampion=mostPlayedChampion;
        this.mostPlayedImage=mostPlayedImage;
        this.mostPlayedKDA=mostPlayedKDA;
        this.mostPlayedWR=mostPlayedWR;
        this.opgg=opgg;
        this.isLive=isLive;
    }

    public Summoner() {
    }

    public String getIsLive() {
        return isLive;
    }

    public void setIsLive(String isLive) {
        this.isLive = isLive;
    }

    public String[] getMostPlayedChampion() {
        return mostPlayedChampion;
    }

    public void setMostPlayedChampion(String[] mostPlayedChampion) {
        this.mostPlayedChampion = mostPlayedChampion;
    }

    public String[] getMostPlayedImage() {
        return mostPlayedImage;
    }

    public void setMostPlayedImage(String[] mostPlayedImage) {
        this.mostPlayedImage = mostPlayedImage;
    }

    public String[] getMostPlayedKDA() {
        return mostPlayedKDA;
    }

    public void setMostPlayedKDA(String[] mostPlayedKDA) {
        this.mostPlayedKDA = mostPlayedKDA;
    }

    public String[] getMostPlayedWR() {
        return mostPlayedWR;
    }

    public void setMostPlayedWR(String[] mostPlayedWR) {
        this.mostPlayedWR = mostPlayedWR;
    }

    public String getOpgg() {
        return opgg;
    }

    public void setOpgg(String opgg) {
        this.opgg = opgg;
    }

    public int getHotStreak() {
        return hotStreak;
    }

    public void setHotStreak(int hotStreak) {
        this.hotStreak = hotStreak;
    }

    public String[] getMasteryPoints() {
        return masteryPoints;
    }

    public void setMasteryPoints(String[] masteryPoints) {
        this.masteryPoints = masteryPoints;
    }
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

    public String getPuuid() {
        return puuid;
    }

    public void setPuuid(String puuid) {
        this.puuid = puuid;
    }
}

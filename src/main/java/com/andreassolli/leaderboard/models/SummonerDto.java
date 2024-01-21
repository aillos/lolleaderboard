package com.andreassolli.leaderboard.models;

import com.andreassolli.leaderboard.models.live.LiveGame;
import com.andreassolli.leaderboard.models.live.LiveGameDto;

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

    private String[] masteryPoints;

    private int hotStreak;

    private String prevRank;

    private String[] mostPlayedName;

    private String[] mostPlayedChampion;

    private String[] mostPlayedImage;

    private String[] mostPlayedKDA;

    private String[] mostPlayedWR;

    private String isLive;

    private String liveData;

    private LiveGameDto liveGameDto;

    private String flexRank;

    private String flexTier;
    private int flexLp;
    private int flexWins;
    private int flexLosses;

    private int flexHotStreak;

    private int flexPoints;
    private int points;

    public SummonerDto(String gameName, String tagLine, String summonerName, String rank, String tier, int lp, int summonerIcon, String summonerId, int wins, int losses, String[] championMastery, String[] championImages, String[] masteryPoints, int hotStreak, String prevRank, String[] mostPlayedName, String[] mostPlayedChampion, String[] mostPlayedImage, String[] mostPlayedKDA, String[] mostPlayedWR, String isLive, String liveData, LiveGameDto liveGameDto, String flexRank, String flexTier, int flexLp, int flexWins, int flexLosses, int flexHotStreak, int flexPoints, int points) {
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
        this.masteryPoints=masteryPoints;
        this.hotStreak=hotStreak;
        this.prevRank=prevRank;
        this.mostPlayedChampion=mostPlayedChampion;
        this.mostPlayedImage=mostPlayedImage;
        this.mostPlayedKDA=mostPlayedKDA;
        this.mostPlayedWR=mostPlayedWR;
        this.mostPlayedName=mostPlayedName;
        this.isLive=isLive;
        this.liveData=liveData;
        this.liveGameDto=liveGameDto;
        this.flexRank=flexRank;
        this.flexTier=flexTier;
        this.flexLp=flexLp;
        this.flexWins=flexWins;
        this.flexLosses=flexLosses;
        this.flexHotStreak=flexHotStreak;
        this.flexPoints=flexPoints;
        this.points=points;
    }

    public SummonerDto() {
    }

    public int getFlexPoints() {
        return flexPoints;
    }

    public void setFlexPoints(int flexPoints) {
        this.flexPoints = flexPoints;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public String getFlexRank() {
        return flexRank;
    }

    public void setFlexRank(String flexRank) {
        this.flexRank = flexRank;
    }

    public String getFlexTier() {
        return flexTier;
    }

    public void setFlexTier(String flexTier) {
        this.flexTier = flexTier;
    }

    public int getFlexLp() {
        return flexLp;
    }

    public void setFlexLp(int flexLp) {
        this.flexLp = flexLp;
    }

    public int getFlexWins() {
        return flexWins;
    }

    public void setFlexWins(int flexWins) {
        this.flexWins = flexWins;
    }

    public int getFlexLosses() {
        return flexLosses;
    }

    public void setFlexLosses(int flexLosses) {
        this.flexLosses = flexLosses;
    }

    public int getFlexHotStreak() {
        return flexHotStreak;
    }

    public void setFlexHotStreak(int flexHotStreak) {
        this.flexHotStreak = flexHotStreak;
    }

    public LiveGameDto getLiveGameDto() {
        return liveGameDto;
    }

    public void setLiveGameDto(LiveGameDto liveGameDto) {
        this.liveGameDto = liveGameDto;
    }

    public String getLiveData() {
        return liveData;
    }

    public void setLiveData(String liveData) {
        this.liveData = liveData;
    }

    public String getIsLive() {
        return isLive;
    }

    public void setIsLive(String isLive) {
        this.isLive = isLive;
    }

    public String[] getMostPlayedName() {
        return mostPlayedName;
    }

    public void setMostPlayedName(String[] mostPlayedName) {
        this.mostPlayedName = mostPlayedName;
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
    public String getPrevRank() {
        return prevRank;
    }

    public void setPrevRank(String prevRank){
        this.prevRank=prevRank;
    }

    public int getHotStreak() {
        return hotStreak;
    }

    public void setHotStreak(int hotStreak) {
        this.hotStreak = hotStreak;
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


    public String[] getMasteryPoints() {
        return masteryPoints;
    }

    public void setMasteryPoints(String[] masteryPoints) {
        this.masteryPoints = masteryPoints;
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

package com.andreassolli.leaderboard.models;

public class ParticipantDto {
    private String championName;
    private String championImage;
    private Perks perks;
    private boolean bot;
    private long teamId;
    private String summonerName;
    private SummonerSpell spell1;
    private SummonerSpell spell2;

    public ParticipantDto(){
    }

    public ParticipantDto(String championName, String championImage, Perks perks, boolean bot, long teamId, String summonerName, SummonerSpell spell1, SummonerSpell spell2) {
        this.championName = championName;
        this.championImage = championImage;
        this.perks = perks;
        this.bot = bot;
        this.teamId = teamId;
        this.summonerName = summonerName;
        this.spell1 = spell1;
        this.spell2 = spell2;
    }

    public String getChampionName() {
        return championName;
    }

    public void setChampionName(String championName) {
        this.championName = championName;
    }

    public String getChampionImage() {
        return championImage;
    }

    public void setChampionImage(String championImage) {
        this.championImage = championImage;
    }

    public Perks getPerks() {
        return perks;
    }

    public void setPerks(Perks perks) {
        this.perks = perks;
    }

    public boolean isBot() {
        return bot;
    }

    public void setBot(boolean bot) {
        this.bot = bot;
    }

    public long getTeamId() {
        return teamId;
    }

    public void setTeamId(long teamId) {
        this.teamId = teamId;
    }

    public String getSummonerName() {
        return summonerName;
    }

    public void setSummonerName(String summonerName) {
        this.summonerName = summonerName;
    }

    public SummonerSpell getSpell1() {
        return spell1;
    }

    public void setSpell1(SummonerSpell spell1) {
        this.spell1 = spell1;
    }

    public SummonerSpell getSpell2() {
        return spell2;
    }

    public void setSpell2(SummonerSpell spell2) {
        this.spell2 = spell2;
    }
}

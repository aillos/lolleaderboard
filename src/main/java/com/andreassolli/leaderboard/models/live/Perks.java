package com.andreassolli.leaderboard.models.live;

import java.util.List;

public class Perks {
    private List<Integer> perkIds;
    private int perkStyle;
    private int perkSubStyle;

    public Perks(List<Integer> perkIds, int perkStyle, int perkSubStyle) {
        this.perkIds = perkIds;
        this.perkStyle = perkStyle;
        this.perkSubStyle = perkSubStyle;
    }

    public Perks() {
    }

    public List<Integer> getPerkIds() {
        return perkIds;
    }

    public void setPerkIds(List<Integer> perkIds) {
        this.perkIds = perkIds;
    }

    public int getPerkStyle() {
        return perkStyle;
    }

    public void setPerkStyle(int perkStyle) {
        this.perkStyle = perkStyle;
    }

    public int getPerkSubStyle() {
        return perkSubStyle;
    }

    public void setPerkSubStyle(int perkSubStyle) {
        this.perkSubStyle = perkSubStyle;
    }
}
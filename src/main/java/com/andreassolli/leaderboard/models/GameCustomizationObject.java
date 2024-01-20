package com.andreassolli.leaderboard.models;

public class GameCustomizationObject {
    private String category;
    private String content;

    public GameCustomizationObject(String category, String content) {
        this.category = category;
        this.content = content;
    }

    public GameCustomizationObject() {

    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}

package com.andreassolli.leaderboard.models;

public class Queues {
    private long queueId;
    private String map;
    private String description;
    private String notes;

    public Queues(){}

    public Queues(long queueId, String map, String description, String notes) {
        this.queueId = queueId;
        this.map = map;
        this.description = description;
        this.notes = notes;
    }

    public long getQueueId() {
        return queueId;
    }

    public void setQueueId(long queueId) {
        this.queueId = queueId;
    }

    public String getMap() {
        return map;
    }

    public void setMap(String map) {
        this.map = map;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

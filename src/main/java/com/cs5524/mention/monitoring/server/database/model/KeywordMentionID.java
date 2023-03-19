package com.cs5524.mention.monitoring.server.database.model;

import java.io.Serializable;

public class KeywordMentionID implements Serializable {
    private String keyword;
    private int mention;

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public int getMention() {
        return mention;
    }

    public void setMention(int mention) {
        this.mention = mention;
    }

    @Override
    public boolean equals(Object o) {
        if (! (o instanceof KeywordMentionID k)) {
            return false;
        }
        return keyword.equals(k.getKeyword()) && mention == k.getMention();
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + mention;
        result = prime * result + ((keyword == null) ? 0 : keyword.hashCode());
        return result;
    }
}


package com.cs5524.mention.monitoring.server.database.model;

import jakarta.persistence.*;

import java.util.*;

@Entity(name="Keyword")
public class Keyword {
    @Id
    @Column(name="keyword")
    private String keyword;

    @OneToMany(mappedBy = "keyword")
    private Set<KeywordMention> mentions = new HashSet<>();

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Keyword(String keyword) {
        this.keyword = keyword;
    }

    public Set<KeywordMention> getMentions() {
        return mentions;
    }

    public void setMentions(Set<KeywordMention> mentions) {
        this.mentions = mentions;
    }

    public Keyword() {
    }
}

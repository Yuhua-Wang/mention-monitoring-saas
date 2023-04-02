package com.cs5524.mention.monitoring.server.database.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.io.Serializable;

@Entity(name="Keyword_Mention")
@IdClass(KeywordMentionID.class)
public class KeywordMention implements Serializable {

    @Id
    @ManyToOne
    @JoinColumn(name = "keyword", referencedColumnName = "keyword")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Keyword keyword;

    @Id
    @ManyToOne
    @JoinColumn(name = "mention", referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Mention mention;

    public KeywordMention() {

    }

    public KeywordMention(Keyword keyword, Mention mention) {
        this.keyword = keyword;
        this.mention = mention;
    }

    public Keyword getKeyword() {
        return keyword;
    }

    public void setKeyword(Keyword keyword) {
        this.keyword = keyword;
    }

    public Mention getMention() {
        return mention;
    }

    public void setMention(Mention mention) {
        this.mention = mention;
    }
}

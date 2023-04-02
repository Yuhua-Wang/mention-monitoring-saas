package com.cs5524.mention.monitoring.server.database.model;

import jakarta.persistence.*;

import java.sql.Date;
import java.util.HashSet;
import java.util.Set;

@Entity(name="Mention")
public class Mention {
    public enum Source {
        AIRBNB,
        TWITTER,
        GOOGLE
    }

    public enum Sentiment {
        POSITIVE,
        NEUTRAL,
        NEGATIVE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name="content", length = 2500,nullable = false)
    private String content;

    @Column(name="summary", length = 2500, nullable = false)
    private String summary;

    @Enumerated(EnumType.STRING)
    @Column(name="sentiment", nullable = false)
    private Sentiment sentiment;

    @Enumerated(EnumType.STRING)
    @Column(name="source", nullable = false)
    private Source source;

    @Column(name="id_in_source", nullable = true)
    private int id_in_source;

    @Column(name = "created_at")
    @Temporal(TemporalType.DATE)
    private Date createdAt;

    @OneToMany(mappedBy = "mention")
    private Set<KeywordMention> keywords = new HashSet<>();

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Sentiment getSentiment() {
        return sentiment;
    }

    public void setSentiment(Sentiment sentiment) {
        this.sentiment = sentiment;
    }

    public Source getSource() {
        return source;
    }

    public void setSource(Source source) {
        this.source = source;
    }

    public int getId_in_source() {
        return id_in_source;
    }

    public void setId_in_source(int id_in_source) {
        this.id_in_source = id_in_source;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Mention(String content, String summary, Sentiment sentiment, Source source, int id_in_source, Date created_at) {
        this.content = content;
        this.summary = summary;
        this.sentiment = sentiment;
        this.source = source;
        this.id_in_source = id_in_source;
        this.createdAt = created_at;
    }

    public Mention() {

    }
}

package com.cs5524.mention.monitoring.server.mock_api;

import jakarta.persistence.*;

import java.sql.Date;

@Entity(name="Review_Content")
public class AirbnbMock {
    @Id
    @Column(name="rid")
    private int rid;

    @Column(name="comments")
    private String comments;

    @Column(name="date")
    @Temporal(TemporalType.DATE)
    private Date date;

    @Column(name="lid")
    private int lid;

    public AirbnbMock() {
    }

    public int getRid() {
        return rid;
    }

    public void setRid(int rid) {
        this.rid = rid;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getLid() {
        return lid;
    }

    public void setLid(int lid) {
        this.lid = lid;
    }
}

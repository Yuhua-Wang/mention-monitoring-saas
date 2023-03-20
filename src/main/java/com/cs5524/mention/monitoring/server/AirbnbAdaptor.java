package com.cs5524.mention.monitoring.server;

import com.cs5524.mention.monitoring.server.database.model.Mention;
import com.cs5524.mention.monitoring.server.database.repo.MentionRepo;
import com.cs5524.mention.monitoring.server.database.service.MentionService;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.sql.Date;
import java.util.*;

@Component
public class AirbnbAdaptor implements SocialMediaAPIAdaptor{
    private static final String url = "http://localhost:8080/airbnb/mock/getData";
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private MentionService mentionService;

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class Airbnb {
        public int rid;
        public String comments;
        public Date date;
        public int lid;
    }

    @Override
    public List<Mention> getData() {
        String responseJson = restTemplate.getForObject(url, String.class);
        return processData(responseJson);
    }

    @Override
    public List<Mention> getData(int last_id) {
        String urlWithParam = url + "?last_id=" + Integer.toString(last_id);
        String responseJson = restTemplate.getForObject(urlWithParam, String.class);
        return processData(responseJson);
    }

    private List<Mention> processData(String responseJson) {
        ObjectMapper objectMapper = new ObjectMapper();
        List<Airbnb> AirbnbData;
        try {
            AirbnbData = objectMapper.readValue(responseJson, new TypeReference<List<Airbnb>>(){});
        } catch (Exception e) {
            System.out.println("Failed to parse JSON: " + e.toString());
            AirbnbData = new ArrayList<>();
        }

        List<Mention> mentions = new ArrayList<>();
        for (Airbnb a : AirbnbData) {
            // TODO: integrate NLP model for the analysis
            String summary = "TODO";
            Mention.Sentiment sentiment = Mention.Sentiment.NEUTRAL;

            Mention m = new Mention(a.comments, summary, sentiment, Mention.Source.AIRBNB, a.rid, a.date);
            mentions.add(m);
        }

        mentionService.saveAll(mentions);
        return mentions;
    }
}

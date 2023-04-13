package com.cs5524.mention.monitoring.server;

import com.cs5524.mention.monitoring.server.database.model.Keyword;
import com.cs5524.mention.monitoring.server.database.model.KeywordMention;
import com.cs5524.mention.monitoring.server.database.model.Mention;
import com.cs5524.mention.monitoring.server.database.repo.MentionRepo;
import com.cs5524.mention.monitoring.server.database.service.KeywordMentionService;
import com.cs5524.mention.monitoring.server.database.service.KeywordService;
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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.cs5524.mention.monitoring.server.SentimentAnalysis.getSentiment;
import static com.cs5524.mention.monitoring.server.Summary.getSummary;

@Component
public class AirbnbAdaptor implements SocialMediaAPIAdaptor{
    private static final String url = "http://localhost:8080/airbnb/mock/getData";
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private MentionService mentionService;
    @Autowired
    private KeywordService keywordService;
    @Autowired
    private KeywordMentionService keywordMentionService;

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
            System.out.println("Failed to parse JSON: \n" + e.toString());
            AirbnbData = new ArrayList<>();
        }

        List<Mention> mentions = new ArrayList<>();
        for (Airbnb a : AirbnbData) {
            try {
                String c = a.comments.replaceAll("[^a-zA-Z0-9 ]", "");
                int sentimentInt = getSentiment(c);
                String summary = getSummary(c);

                Mention.Sentiment sentiment = Mention.Sentiment.NEUTRAL;
                switch (sentimentInt) {
                    case 1 -> sentiment = Mention.Sentiment.POSITIVE;
                    case -1 -> sentiment = Mention.Sentiment.NEGATIVE;
                    default -> {
                    }
                }

                Mention m = new Mention(a.comments, summary, sentiment, Mention.Source.AIRBNB, a.rid, a.date);
                mentions.add(m);
                System.out.println("done with " + m.getId_in_source());
            } catch (Exception e) {
                System.out.println("Airbnb Adaptor:");
                System.out.println(e.toString());
                return mentions;
            }
        }

        mentionService.saveAll(mentions);

        List<Keyword> keywords = keywordService.getAllKeywords();
        List<KeywordMention> km = new ArrayList<>();
        for (Mention m : mentions) {
            for (Keyword k : keywords) {
                String regex = ".*\\b" + k.getKeyword() + "\\b.*";
                if (m.getContent().matches(regex)) {
                    km.add(new KeywordMention(k, m));
                }
            }
        }
        keywordMentionService.saveAll(km);

        return mentions;
    }
}

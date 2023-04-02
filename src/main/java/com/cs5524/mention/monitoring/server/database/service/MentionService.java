package com.cs5524.mention.monitoring.server.database.service;

import com.cs5524.mention.monitoring.server.database.model.Mention;
import com.cs5524.mention.monitoring.server.database.repo.MentionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;

@Service
public class MentionService {
    @Autowired
    private MentionRepo mentionRepo;

    public void saveAll(List<Mention> mentions) {
        mentionRepo.saveAll(mentions);
    }

    public int getLastCollected() {
        return mentionRepo.getLastCollected();
    }

    public Mention findById(int id) {
        return mentionRepo.findById(id);
    }

    // find all mentions whose content contains a regex match to the input
    public List<Mention> findWithRegex(String contains) {
        return mentionRepo.findWithRegex(contains);
    }

    public List<Mention> findWithFilter(Mention.Source source,
                                        Mention.Sentiment sentiment,
                                        Date startDate,
                                        Date endDate) {
        return mentionRepo.findWithFilter(source, sentiment, startDate, endDate);
    }

    public List<Object[]> getStatistics(Mention.Source source,
                                    Mention.Sentiment sentiment,
                                    Date startDate,
                                    Date endDate) {
        return mentionRepo.getStatistics(source, sentiment, startDate, endDate);
    }
}

package com.cs5524.mention.monitoring.server.database.service;

import com.cs5524.mention.monitoring.server.database.model.Mention;
import com.cs5524.mention.monitoring.server.database.repo.MentionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MentionService {
    @Autowired
    private MentionRepo mentionRepo;

    public void saveAll(List<Mention> mentions) {
        mentionRepo.saveAll(mentions);
    }
}

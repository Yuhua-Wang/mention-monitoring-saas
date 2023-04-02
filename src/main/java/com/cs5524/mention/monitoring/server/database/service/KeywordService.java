package com.cs5524.mention.monitoring.server.database.service;

import com.cs5524.mention.monitoring.server.database.model.Keyword;
import com.cs5524.mention.monitoring.server.database.model.KeywordMention;
import com.cs5524.mention.monitoring.server.database.repo.KeywordRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class KeywordService {
    @Autowired
    private KeywordRepo repo;
    @Autowired
    private KeywordMentionService keywordMentionService;

    public void create(String keyword) {
        Keyword k = new Keyword(keyword);
        repo.save(k);
        keywordMentionService.createByKeyword(k);
    }

    public List<Keyword> getAllKeywords() {
        return repo.findAll();
    }

    @Transactional
    public int delete(String keyword) {
        return repo.deleteByKeyword(keyword);
    }
}

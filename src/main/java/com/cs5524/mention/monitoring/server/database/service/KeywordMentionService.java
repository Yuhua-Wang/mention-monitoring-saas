package com.cs5524.mention.monitoring.server.database.service;

import com.cs5524.mention.monitoring.server.database.model.Keyword;
import com.cs5524.mention.monitoring.server.database.model.KeywordMention;
import com.cs5524.mention.monitoring.server.database.model.Mention;
import com.cs5524.mention.monitoring.server.database.repo.KeywordMentionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class KeywordMentionService {
    @Autowired
    private KeywordMentionRepo repo;
    @Autowired
    private MentionService mentionService;

    public List<KeywordMention> findAll() {
        return repo.findAll();
    }

    public List<KeywordMention> findByKeyword(String keyword) {
        return repo.findByKeyword(keyword);
    }

    public int createByKeyword(Keyword keyword) {
        List<Mention> mentions = mentionService.findWithRegex(keyword.getKeyword());
        List<KeywordMention> keywordMentions = new ArrayList<>();
        for (Mention m : mentions) {
            keywordMentions.add(new KeywordMention(keyword, m));
        }
        return repo.saveAll(keywordMentions).size();
    }

    public void saveAll(List<KeywordMention> km) {
        repo.saveAll(km);
    }

    public Map<Integer, Set<String>> getKeywordMentions() {
        Map<Integer, Set<String>> res = new HashMap<>();

        List<Object[]> kws = repo.getAllKeywordMention();
        for (Object[] kw : kws) {
            Integer mention = (Integer) kw[1];
            Set<String> s = res.getOrDefault(mention, new HashSet<>());
            s.add((String)kw[0]);
            res.put(mention, s);
        }

        return res;
    }
}

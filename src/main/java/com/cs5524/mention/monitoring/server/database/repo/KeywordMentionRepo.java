package com.cs5524.mention.monitoring.server.database.repo;


import com.cs5524.mention.monitoring.server.database.model.KeywordMention;
import com.cs5524.mention.monitoring.server.database.model.KeywordMentionID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KeywordMentionRepo extends JpaRepository<KeywordMention, KeywordMentionID> {
}

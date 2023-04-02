package com.cs5524.mention.monitoring.server.database.repo;


import com.cs5524.mention.monitoring.server.database.model.KeywordMention;
import com.cs5524.mention.monitoring.server.database.model.KeywordMentionID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;

@Repository
public interface KeywordMentionRepo extends JpaRepository<KeywordMention, KeywordMentionID> {

    List<KeywordMention> findByKeyword(String keyword);

    @Query("SELECT km.keyword.keyword, km.mention.id FROM Keyword_Mention km")
    List<Object[]> getAllKeywordMention();

}

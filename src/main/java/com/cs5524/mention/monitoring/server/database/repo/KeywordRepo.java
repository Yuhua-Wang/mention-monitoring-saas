package com.cs5524.mention.monitoring.server.database.repo;

import com.cs5524.mention.monitoring.server.database.model.Keyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KeywordRepo extends JpaRepository<Keyword, String> {

    int deleteByKeyword(String keyword);

    @Query(value = "SELECT keyword FROM keyword", nativeQuery = true)
    List<String> getAllInString();

}

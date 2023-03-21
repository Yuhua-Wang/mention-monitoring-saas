package com.cs5524.mention.monitoring.server.database.repo;

import com.cs5524.mention.monitoring.server.database.model.Mention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface MentionRepo extends JpaRepository<Mention, Integer> {

    @Query(value = "SELECT id_in_source FROM mention ORDER BY id_in_source DESC LIMIT 1", nativeQuery = true)
    int getLastCollected();

    Mention findById(int id);

    @Query(value = "SELECT * FROM mention WHERE content RLIKE CONCAT('\\\\b', ?1, '\\\\b')", nativeQuery = true)
    List<Mention> findWithRegex(String contains);
}

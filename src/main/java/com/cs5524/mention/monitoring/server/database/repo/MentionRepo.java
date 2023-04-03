package com.cs5524.mention.monitoring.server.database.repo;

import com.cs5524.mention.monitoring.server.database.model.Mention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.*;

@Repository
public interface MentionRepo extends JpaRepository<Mention, Integer> {

    @Query(value = "SELECT id_in_source FROM mention ORDER BY id_in_source DESC LIMIT 1", nativeQuery = true)
    Integer getLastCollected();

    Mention findById(int id);

    @Query(value = "SELECT * FROM mention WHERE content RLIKE CONCAT('\\\\b', ?1, '\\\\b')", nativeQuery = true)
    List<Mention> findWithRegex(String contains);

    @Query("SELECT DISTINCT m" +
            " FROM Mention m" +
            " WHERE (:source IS NULL OR m.source = :source)" +
            " AND (:sentiment IS NULL OR m.sentiment = :sentiment)" +
            " AND (:startDate IS NULL OR m.createdAt >= :startDate)" +
            " AND (:endDate IS NULL OR m.createdAt <= :endDate)")
    List<Mention> findWithFilter(
            @Param("source") Mention.Source source,
            @Param("sentiment") Mention.Sentiment sentiment,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );

    @Query("SELECT m.source, COUNT(m), m.sentiment, m.createdAt " +
            "FROM Mention m " +
            "WHERE (:source IS NULL OR m.source = :source)" +
            " AND (:sentiment IS NULL OR m.sentiment = :sentiment)" +
            " AND (:startDate IS NULL OR m.createdAt >= :startDate)" +
            " AND (:endDate IS NULL OR m.createdAt <= :endDate)" +
            "GROUP BY m.source, m.createdAt, m.sentiment " +
            "ORDER BY m.source, m.createdAt, m.sentiment")
    List<Object[]> getStatistics(
            @Param("source") Mention.Source source,
            @Param("sentiment") Mention.Sentiment sentiment,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );


}

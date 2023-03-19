package com.cs5524.mention.monitoring.server.database.repo;

import com.cs5524.mention.monitoring.server.database.model.Mention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MentionRepo extends JpaRepository<Mention, Integer> {
}

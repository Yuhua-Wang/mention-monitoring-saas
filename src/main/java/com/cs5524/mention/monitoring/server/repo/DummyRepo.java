package com.cs5524.mention.monitoring.server.repo;

import com.cs5524.mention.monitoring.server.model.Dummy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DummyRepo extends JpaRepository<Dummy, Integer> {
}

package com.cs5524.mention.monitoring.server.mock_api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AirbnbMockRepo extends JpaRepository<AirbnbMock, Integer>  {

    @Query(value = "SELECT * FROM review_content WHERE rid > :last", nativeQuery = true)
    List<AirbnbMock> findUnCollectedData(@Param("last") int last);
}

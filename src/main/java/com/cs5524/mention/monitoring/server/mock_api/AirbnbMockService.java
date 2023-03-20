package com.cs5524.mention.monitoring.server.mock_api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AirbnbMockService {
    @Autowired
    private AirbnbMockRepo airbnbMockRepo;

    public List<AirbnbMock> getAllData() {
        return airbnbMockRepo.findAll();
    }

    public List<AirbnbMock> getUncollectedData(int last) {
        return airbnbMockRepo.findUnCollectedData(last);
    }
}

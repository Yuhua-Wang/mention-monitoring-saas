package com.cs5524.mention.monitoring.server.mock_api;

import com.cs5524.mention.monitoring.server.mock_api.AirbnbMock;
import com.cs5524.mention.monitoring.server.mock_api.AirbnbMockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/airbnb/mock")
public class AirbnbMockController {
    @Autowired
    private AirbnbMockService airbnbMockService;

    @GetMapping("/getData")
    public ResponseEntity<List<AirbnbMock>> getUncollectedData(
            @RequestParam(name = "last_id", required = false) Integer last_id
    ) {
        if (last_id != null) {
            return new ResponseEntity<>(airbnbMockService.getUncollectedData(last_id), HttpStatus.OK);
        }
        return new ResponseEntity<>(airbnbMockService.getAllData(), HttpStatus.OK);
    }

}

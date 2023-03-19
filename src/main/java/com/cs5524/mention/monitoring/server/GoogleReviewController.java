package com.cs5524.mention.monitoring.server;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/googleReviews")
public class GoogleReviewController implements SocialMediaAPIController {
    private RestTemplate restTemplate;

    public GoogleReviewController() {
        this.restTemplate = new RestTemplate();
    }

    public ResponseEntity<String> index() {
        return new ResponseEntity<>("Google Reviews", HttpStatus.OK);
    }


}

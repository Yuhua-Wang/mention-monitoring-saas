package com.cs5524.mention.monitoring.server;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public interface SocialMediaAPIController {

//    @GetMapping("/findPlace/{place_name}")
//    public ResponseEntity<JsonObject>

    @GetMapping("/")
    public ResponseEntity<String> index();



}

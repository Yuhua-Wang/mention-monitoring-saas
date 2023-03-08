package com.cs5524.mention.monitoring.server;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public interface SocialMediaAPIController {

    @GetMapping("/")
    public ResponseEntity<String> index();


}

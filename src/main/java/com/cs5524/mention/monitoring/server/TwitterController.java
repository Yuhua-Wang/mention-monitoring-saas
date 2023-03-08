package com.cs5524.mention.monitoring.server;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/twitter")
public class TwitterController implements SocialMediaAPIController{

    @Override
    public ResponseEntity<String> index() {
        return new ResponseEntity<>("Twitter", HttpStatus.OK);
    }
}

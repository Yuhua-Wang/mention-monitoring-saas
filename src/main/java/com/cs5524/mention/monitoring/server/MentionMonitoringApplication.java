package com.cs5524.mention.monitoring.server;

import com.cs5524.mention.monitoring.server.database.model.Mention;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;


@SpringBootApplication
@RestController
public class MentionMonitoringApplication {

	@Autowired
	AirbnbAdaptor api;
	public static void main(String[] args) {
		SpringApplication.run(MentionMonitoringApplication.class, args);
	}

	@GetMapping("/")
	public ResponseEntity<String> apiRoot() {
		return new ResponseEntity<String>("Hello World", HttpStatus.OK);
	}

	@GetMapping("/test")
	public ResponseEntity<String> test() {
		List<Mention> d = api.getData();
		return new ResponseEntity<String>(d.toString(), HttpStatus.OK);
	}

}

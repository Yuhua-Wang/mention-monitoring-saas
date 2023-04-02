package com.cs5524.mention.monitoring.server;

import com.cs5524.mention.monitoring.server.database.model.Mention;
import com.cs5524.mention.monitoring.server.database.service.KeywordMentionService;
import com.cs5524.mention.monitoring.server.database.service.KeywordService;
import com.cs5524.mention.monitoring.server.database.service.MentionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.util.Calendar;
import java.util.List;


@SpringBootApplication
@RestController
public class MentionMonitoringApplication {

	@Autowired
	AirbnbAdaptor api;
	@Autowired
	MentionService mentionService;
	@Autowired
	KeywordService keywordService;
	@Autowired
	KeywordMentionService keywordMentionService;

	public static void main(String[] args) {
		SpringApplication.run(MentionMonitoringApplication.class, args);
	}

	@GetMapping("/")
	public ResponseEntity<String> apiRoot() {
		return new ResponseEntity<String>("Hello World", HttpStatus.OK);
	}

	@GetMapping("/test")
	public ResponseEntity<List<Object[]>> test() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(2020,Calendar.MARCH,1);
		long unixTime = calendar.getTimeInMillis();

		List<Object[]> res = mentionService.getStatistics(
				Mention.Source.AIRBNB,
				null,
				new Date(unixTime),
				null
		);
		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	@GetMapping("/get")
	public ResponseEntity<String> getAll() {
		api.getData();
		return new ResponseEntity<String>("Success", HttpStatus.OK);
	}
}

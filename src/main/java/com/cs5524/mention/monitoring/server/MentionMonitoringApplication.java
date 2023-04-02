package com.cs5524.mention.monitoring.server;

import com.cs5524.mention.monitoring.server.database.model.Keyword;
import com.cs5524.mention.monitoring.server.database.model.Mention;
import com.cs5524.mention.monitoring.server.database.service.KeywordMentionService;
import com.cs5524.mention.monitoring.server.database.service.KeywordService;
import com.cs5524.mention.monitoring.server.database.service.MentionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.sql.Date;
import java.util.Calendar;
import java.util.List;


@SpringBootApplication
@RestController
public class MentionMonitoringApplication {

	@Autowired
	AirbnbAdaptor airbnbAdaptor;
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

	// Keywords
	@GetMapping("/keywords")
	public ResponseEntity<List<String>> getKeywords() {
		return ResponseEntity.ok(keywordService.findAllDistinct());
	}

	@PostMapping("/keywords")
	public ResponseEntity<String> createKeyword(@RequestParam("keyword") String keyword) {
		int numCreated = keywordService.create(keyword);
		if (numCreated < 0) {
			return ResponseEntity.badRequest().body("Keyword " + keyword + " already exist");
		}
		return new ResponseEntity<String>("Found " + numCreated + " matching mentions", HttpStatus.OK);
	}

	@DeleteMapping("/keywords")
	public ResponseEntity<String> deleteKeyword(@RequestParam("keyword") String keyword) {
		keywordService.delete(keyword);
		return new ResponseEntity<String>("Success", HttpStatus.OK);
	}

	// Mentions
	@GetMapping("/fetchMentions")
	public ResponseEntity<?> fetchMentions() {
		int lastID = mentionService.getLastCollected();
		airbnbAdaptor.getData(lastID);
		return ResponseEntity.ok(mentionService.findWithFilter(null,null,null,null));
	}

	@GetMapping("/mentions")
	public ResponseEntity<?> getMentions(
			@RequestParam(name = "source", required = false) Mention.Source source,
			@RequestParam(name = "sentiment", required = false) Mention.Sentiment sentiment,
			@RequestParam(name = "start_date", required = false) Date startDate,
			@RequestParam(name = "end_date", required = false) Date endDate) {
//		try {
//			return ResponseEntity.ok(mentionService.findWithFilter(source, sentiment, startDate, endDate));
//		} catch (Exception e) {
//			return ResponseEntity.badRequest().body("invalid parameters");
//		}
		return ResponseEntity.ok(mentionService.findWithFilter(source, sentiment, startDate, endDate));
	}

	@GetMapping("/statistics")
	public ResponseEntity<?> getStatistics(
			@RequestParam(name = "source", required = false) Mention.Source source,
			@RequestParam(name = "sentiment", required = false) Mention.Sentiment sentiment,
			@RequestParam(name = "start_date", required = false) Date startDate,
			@RequestParam(name = "end_date", required = false) Date endDate) {
		try {
			return ResponseEntity.ok(mentionService.getStatistics(source, sentiment, startDate, endDate));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("invalid parameters");
		}
	}

	// Keyword Mention


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
}

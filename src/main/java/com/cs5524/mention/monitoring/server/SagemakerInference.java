package com.cs5524.mention.monitoring.server;

import com.amazonaws.services.sagemaker.AmazonSageMaker;
import com.amazonaws.services.sagemaker.AmazonSageMakerClientBuilder;
import com.amazonaws.services.sagemaker.model.InvokeEndpointRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

public class SentimentAnalysis {
    static AmazonSageMaker sagemaker = AmazonSageMakerClientBuilder.defaultClient();

    public static List<Int> getSentiment(List<String> texts) {
        String endpointName = "sagemaker-pytorch-2020-11-08-21-39-49-202";
        String contentType = "application/json";
        List<Int> sentiments = new ArrayList<Int>();
        for (String text : texts) {
            String payload = "{\"inputs\": \"" + text + "\"}";
            InvokeEndpointRequest request = new InvokeEndpointRequest()
                    .withEndpointName(endpointName)
                    .withContentType(contentType)
                    .withBody(ByteBuffer.wrap(payload.getBytes()));
            InvokeEndpointResult result = sagemaker.invokeEndpoint(request);
            String response = new String(result.getBody().array(), StandardCharsets.UTF_8);
            ObjectMapper mapper = new ObjectMapper();
            String sentiment = mapper.readTree(response).get(0).get("label").asText();
            if (sentiment.equals("positive")) {
                sentiments.add(1);
            } else if (sentiment.equals("negative")) {
                sentiments.add(-1);
            } else {
                sentiments.add(0);
            }
        }
        return sentiments;
    }
}

public class Summary {
    static AmazonSageMaker sagemaker = AmazonSageMakerClientBuilder.defaultClient();

    public static List<String> getSummary(List<String> texts) {
        String endpointName = "sagemaker-tensorflow-2020-11-08-21-39-49-202";
        String contentType = "application/json";

        List<String> summaries = new ArrayList<String>();

        for (String text : texts) {
            String payload = "{\"inputs\": \"" + text + "\"}";
            InvokeEndpointRequest request = new InvokeEndpointRequest()
                    .withEndpointName(endpointName)
                    .withContentType(contentType)
                    .withBody(ByteBuffer.wrap(payload.getBytes()));
            InvokeEndpointResult result = sagemaker.invokeEndpoint(request);
            String response = new String(result.getBody().array(), StandardCharsets.UTF_8);
            ObjectMapper mapper = new ObjectMapper();
            String summary = mapper.readTree(response).get(0).get("generated_text").asText();
            summaries.add(summary);
        }
        return summaries;
    }
}

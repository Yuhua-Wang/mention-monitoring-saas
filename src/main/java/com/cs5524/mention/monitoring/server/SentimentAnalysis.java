package com.cs5524.mention.monitoring.server;

import com.amazonaws.services.sagemakerruntime.AmazonSageMakerRuntime;
import com.amazonaws.services.sagemakerruntime.AmazonSageMakerRuntimeClientBuilder;
import com.amazonaws.services.sagemakerruntime.model.InvokeEndpointRequest;
import com.amazonaws.services.sagemakerruntime.model.InvokeEndpointResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.List;
import java.lang.Integer;
import java.nio.ByteBuffer;

public class SentimentAnalysis {
    public static void main() throws JsonProcessingException {
        List<String> texts = new ArrayList<String>();
        texts.add("The movie was great!");
        texts.add(
                "The food was terrible.");
        List<Integer> sentiments = getSentiment(texts);
        for (Integer sentiment : sentiments) {
            System.out.println(sentiment);
        }
    }

    public static List<Integer> getSentiment(List<String> texts) throws JsonProcessingException {
        AmazonSageMakerRuntime sagemaker = AmazonSageMakerRuntimeClientBuilder.defaultClient();

        String endpointName = "sagemaker-pytorch-2020-11-08-21-39-49-202";
        String contentType = "application/json";
        List<Integer> sentiments = new ArrayList<Integer>();
        for (String text : texts) {
            String payload = "{\"inputs\": \"" + text + "\"}";
            InvokeEndpointRequest request = new InvokeEndpointRequest()
                    .withEndpointName(endpointName)
                    .withContentType(contentType)
                    .withBody(ByteBuffer.wrap(payload.getBytes()));
            String response = sagemaker.invokeEndpoint(request).getBody().toString();
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
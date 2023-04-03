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
import java.nio.charset.Charset;
import org.json.JSONObject;

public class SentimentAnalysis {
    public static void main(String[] args) throws JsonProcessingException {
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

        String endpointName = "sentiment-analysis";
        String contentType = "application/json";
        List<Integer> sentiments = new ArrayList<Integer>();
        for (String text : texts) {
            String payload = "{\"inputs\":\"" + text + "\"}";
            // JSONObject obj = new JSONObject(payload);
            InvokeEndpointRequest request = new InvokeEndpointRequest()
                    .withEndpointName(endpointName)
                    .withContentType(contentType)
                    // .withAccept(contentType)
                    .withBody(ByteBuffer.wrap(payload.getBytes()));
            InvokeEndpointResult result = sagemaker.invokeEndpoint(request);
            String response = new String(result.getBody().array(), Charset.forName("UTF-8"));
            if (response.contains("positive")) {
                sentiments.add(1);
            } else if (response.contains("negative")) {
                sentiments.add(-1);
            } else {
                sentiments.add(0);
            }
        }
        return sentiments;
    }
}
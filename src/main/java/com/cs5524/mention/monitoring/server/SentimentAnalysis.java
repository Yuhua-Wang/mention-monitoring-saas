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
    public static Integer getSentiment(String text) throws JsonProcessingException {
        AmazonSageMakerRuntime sagemaker = AmazonSageMakerRuntimeClientBuilder.defaultClient();

        String endpointName = "sentiment";
        String contentType = "application/json";

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
            return 1;
        } else if (response.contains("negative")) {
            return -1;
        } else {
            return 0;
        }
    }
}
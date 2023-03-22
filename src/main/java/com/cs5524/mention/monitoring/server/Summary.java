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
import java.nio.ByteBuffer;

public class Summary {
    public static List<String> getSummary(List<String> texts) throws JsonProcessingException {
        AmazonSageMakerRuntime sagemaker = AmazonSageMakerRuntimeClientBuilder.defaultClient();

        String endpointName = "sagemaker-tensorflow-2020-11-08-21-39-49-202";
        String contentType = "application/json";

        List<String> summaries = new ArrayList<String>();

        for (String text : texts) {
            String payload = "{\"inputs\": \"" + text + "\"}";
            InvokeEndpointRequest request = new InvokeEndpointRequest()
                    .withEndpointName(endpointName)
                    .withContentType(contentType)
                    .withBody(ByteBuffer.wrap(payload.getBytes()));
            String response = sagemaker.invokeEndpoint(request).getBody().toString();
            ObjectMapper mapper = new ObjectMapper();
            String summary = mapper.readTree(response).get(0).get("generated_text").asText();
            summaries.add(summary);
        }
        return summaries;
    }
}
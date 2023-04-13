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
    public static String getSummary(String text) throws JsonProcessingException {
        AmazonSageMakerRuntime sagemaker = AmazonSageMakerRuntimeClientBuilder.defaultClient();

        String endpointName = "summary";
        String contentType = "application/json";

        String payload = "{\"inputs\": \"" + text + "\"}";
        InvokeEndpointRequest request = new InvokeEndpointRequest()
                .withEndpointName(endpointName)
                .withContentType(contentType)
                .withBody(ByteBuffer.wrap(payload.getBytes()));
        InvokeEndpointResult result = sagemaker.invokeEndpoint(request);
        String response = new String(result.getBody().array(), java.nio.charset.StandardCharsets.UTF_8);
        ObjectMapper mapper = new ObjectMapper();
        String summary = mapper.readTree(response).get(0).get("summary_text").asText();

        return summary;
    }
}
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
//    public static void main(String[] args) throws JsonProcessingException {
////        List<String> texts = new ArrayList<String>();
////        texts.add("This is a test text that is long and full of crap that no one will ever care.");
////        texts.add(
////                "This is another test text that is even longer that is also full of crap that no one will ever care.");
////        List<String> summaries = getSummary(texts);
////        for (String summary : summaries) {
////            System.out.println(summary);
////        }
//    }

    public static String getSummary(String text) throws JsonProcessingException {
        AmazonSageMakerRuntime sagemaker = AmazonSageMakerRuntimeClientBuilder.defaultClient();

        String endpointName = "summary-generation";
        String contentType = "application/json";

        String payload = "{\"inputs\": \"" + text + "\"}";
        InvokeEndpointRequest request = new InvokeEndpointRequest()
                .withEndpointName(endpointName)
                .withContentType(contentType)
                .withBody(ByteBuffer.wrap(payload.getBytes()));
        InvokeEndpointResult result = sagemaker.invokeEndpoint(request);
        String response = new String(result.getBody().array(), java.nio.charset.StandardCharsets.UTF_8);
        ObjectMapper mapper = new ObjectMapper();
        String summary = mapper.readTree(response).get(0).get("generated_text").asText();

        return summary;
    }
}
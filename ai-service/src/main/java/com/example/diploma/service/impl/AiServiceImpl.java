package com.example.diploma.service.impl;

import com.example.diploma.controller.dto.AiMessageDto;
import com.example.diploma.event.AiRecommendationCreatedEvent;
import com.example.diploma.kafka.AiEventProducer;
import com.example.diploma.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {

    private static final String SYSTEM_PROMPT =
            "You are a fitness coach. Give short, practical advice about workouts and nutrition. "
                    + "Use the provided HeroFit user context when it is available. "
                    + "Format longer answers with short sections and bullet points.";

    private final WebClient openAiWebClient;
    private final AiEventProducer aiEventProducer;

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.model}")
    private String model;

    @Value("${openai.base-url}")
    private String baseUrl;

    @Override
    public String askAi(String message, List<AiMessageDto> messages, Map<String, Object> userContext) {
        List<Map<String, String>> openAiMessages = new ArrayList<>();

        openAiMessages.add(Map.of(
                "role", "system",
                "content", SYSTEM_PROMPT
        ));

        if (messages != null && !messages.isEmpty()) {
            messages.stream()
                    .filter(this::isValidMessage)
                    .skip(Math.max(0, messages.size() - 6))
                    .forEach(item -> openAiMessages.add(Map.of(
                            "role", item.getRole(),
                            "content", item.getContent()
                    )));
        }

        if (userContext != null && !userContext.isEmpty()) {
            openAiMessages.add(Map.of(
                    "role", "system",
                    "content", "HeroFit user context: " + userContext
            ));
        }

        openAiMessages.add(Map.of(
                "role", "user",
                "content", message
        ));

        return sendOpenAiRequest(openAiMessages);
    }

    @Override
    public String generateWorkout(String level, String goal, List<String> lastSessions) {
        String sessions = lastSessions != null && !lastSessions.isEmpty()
                ? String.join(", ", lastSessions.stream()
                .skip(Math.max(0, lastSessions.size() - 5))
                .toList())
                : "No recent sessions provided";

        String prompt = String.join("\n",
                "Create a short workout recommendation.",
                "Client level: " + getValueOrDefault(level, "Unknown") + ".",
                "Goal: " + getValueOrDefault(goal, "General fitness") + ".",
                "Recent sessions: " + sessions + ".",
                "Return a practical plan with warmup, main work, cooldown, and one nutrition tip."
        );

        List<Map<String, String>> openAiMessages = List.of(
                Map.of(
                        "role", "system",
                        "content", SYSTEM_PROMPT
                ),
                Map.of(
                        "role", "user",
                        "content", prompt
                )
        );

        String plan = sendOpenAiRequest(openAiMessages);

        aiEventProducer.sendRecommendationCreated(new AiRecommendationCreatedEvent(
                getValueOrDefault(level, "Unknown"),
                getValueOrDefault(goal, "General fitness"),
                plan,
                LocalDateTime.now()
        ));

        return plan;
    }

    private String sendOpenAiRequest(List<Map<String, String>> messages) {
        if (isLocalFallbackKey()) {
            return buildLocalReply(messages);
        }

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", messages
        );

        try {
            Map<?, ?> response = openAiWebClient.post()
                    .uri(baseUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            return extractReply(response);
        } catch (RuntimeException exception) {
            return buildLocalReply(messages);
        }
    }

    private boolean isLocalFallbackKey() {
        return apiKey == null || apiKey.isBlank() || apiKey.startsWith("dummy");
    }

    private String buildLocalReply(List<Map<String, String>> messages) {
        String latestMessage = messages.stream()
                .filter(item -> "user".equals(item.get("role")))
                .map(item -> item.get("content"))
                .filter(Objects::nonNull)
                .reduce((previous, current) -> current)
                .orElse("your training question");

        return "AI service is online locally. For \"" + latestMessage + "\", start with a simple plan: warm up for 5 minutes, choose 3-4 main exercises, keep the effort controlled, and finish with stretching. Add a real OPENAI_API_KEY to enable full AI answers.";
    }

    private String extractReply(Map<?, ?> response) {
        if (response == null) {
            return "I could not generate a response right now.";
        }

        Object choicesObject = response.get("choices");

        if (!(choicesObject instanceof List<?> choices) || choices.isEmpty()) {
            return "I could not generate a response right now.";
        }

        Object firstChoiceObject = choices.get(0);

        if (!(firstChoiceObject instanceof Map<?, ?> firstChoice)) {
            return "I could not generate a response right now.";
        }

        Object messageObject = firstChoice.get("message");

        if (!(messageObject instanceof Map<?, ?> message)) {
            return "I could not generate a response right now.";
        }

        Object contentObject = message.get("content");

        if (!(contentObject instanceof String content) || content.isBlank()) {
            return "I could not generate a response right now.";
        }

        return content.trim();
    }

    private boolean isValidMessage(AiMessageDto message) {
        return message != null
                && message.getRole() != null
                && message.getContent() != null
                && !message.getContent().isBlank()
                && (message.getRole().equals("user") || message.getRole().equals("assistant"));
    }

    private String getValueOrDefault(String value, String defaultValue) {
        return value != null && !value.isBlank() ? value : defaultValue;
    }
}

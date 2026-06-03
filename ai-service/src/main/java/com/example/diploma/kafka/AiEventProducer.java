package com.example.diploma.kafka;

import com.example.diploma.event.AiRecommendationCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiEventProducer {

    private final KafkaTemplate<String, AiRecommendationCreatedEvent> kafkaTemplate;

    public void sendRecommendationCreated(AiRecommendationCreatedEvent event) {
        kafkaTemplate.send(KafkaTopics.AI_RECOMMENDATION_CREATED, event);
    }
}
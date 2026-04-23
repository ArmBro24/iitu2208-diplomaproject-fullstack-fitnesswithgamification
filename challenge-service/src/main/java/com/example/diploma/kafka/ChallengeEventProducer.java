package com.example.diploma.kafka;

import com.example.diploma.event.ChallengeCompletedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChallengeEventProducer {

    private final KafkaTemplate<String, ChallengeCompletedEvent> kafkaTemplate;

    public void sendChallengeCompleted(ChallengeCompletedEvent event) {
        kafkaTemplate.send(
                KafkaTopics.CHALLENGE_COMPLETED,
                event
        );
    }
}
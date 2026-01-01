package com.example.diploma.kafka;

import com.example.diploma.event.TrainingLogApprovedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrainingEventProducer {

    private final KafkaTemplate<String, TrainingLogApprovedEvent> kafkaTemplate;

    public void sendLogApproved(TrainingLogApprovedEvent event) {
        kafkaTemplate.send(
                KafkaTopics.TRAINING_LOG_APPROVED,
                event);
    }
}

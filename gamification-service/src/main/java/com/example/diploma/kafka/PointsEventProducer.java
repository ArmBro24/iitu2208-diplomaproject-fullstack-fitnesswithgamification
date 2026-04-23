package com.example.diploma.kafka;


import com.example.diploma.event.PointsAwardedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PointsEventProducer {

    private final KafkaTemplate<String, PointsAwardedEvent> kafkaTemplate;

    public void sendPointsAwarded(PointsAwardedEvent event) {
        kafkaTemplate.send(
                KafkaTopics.POINTS_AWARDED,
                event
        );
    }
}
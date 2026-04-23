package com.example.diploma.kafka;

import com.example.diploma.event.PointsAwardedEvent;
import com.example.diploma.service.ChallengeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PointsEventConsumer {

    private final ChallengeService challengeService;

    @KafkaListener(topics = KafkaTopics.POINTS_AWARDED)
    public void handle(PointsAwardedEvent event) {

        log.info("CHALLENGE RECEIVED: memberId={}, points={}",
                event.memberId(),
                event.points()
        );

        challengeService.applyProgress(
                event.memberId(),
                event.points()
        );
    }
}
package com.example.diploma.kafka;

import com.example.diploma.event.ChallengeCompletedEvent;
import com.example.diploma.service.GamificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChallengeEventConsumer {

    private final GamificationService gamificationService;

    @KafkaListener(
            topics = "challenge.completed",
            groupId = "gamification-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void onChallengeCompleted(ChallengeCompletedEvent event) {
        log.info("CHALLENGE COMPLETED RECEIVED: memberId={}, points={}",
                event.getMemberId(),
                event.getEffectivePoints());

        gamificationService.applyTrainingPoints(
                null,
                event.getMemberId(),
                event.getEffectivePoints(),
                "Reward for challenge: " + event.getChallengeId()
        );
    }
}
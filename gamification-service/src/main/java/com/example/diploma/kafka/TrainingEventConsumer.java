package com.example.diploma.kafka;

import com.example.diploma.event.TrainingLogApprovedEvent;
import com.example.diploma.service.GamificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrainingEventConsumer {

    private final GamificationService gamificationService;

    @KafkaListener(
            topics = KafkaTopics.TRAINING_LOG_APPROVED,
            groupId = "test-group-123",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void onLogApproved(TrainingLogApprovedEvent event) {
        log.info("--- [DEBUG] СОБЫТИЕ ПРИШЛО В GAMIFICATION-SERVICE ---");
        log.info("Данные: sessionId={}, memberId={}, points={}", event.sessionId(), event.memberId(), event.points());

        log.info("GAMIFICATION RECEIVED: sessionId={}, memberId={}, points={}, approvedAt={}",
                event.sessionId(),
                event.memberId(),
                event.points(),
                event.approvedAt()
        );

        String comment = "Approved training log. sessionId=" + event.sessionId();

        gamificationService.applyTrainingPoints(
                event.sessionId(),
                event.memberId(),
                event.points(),
                comment
        );
    }
}
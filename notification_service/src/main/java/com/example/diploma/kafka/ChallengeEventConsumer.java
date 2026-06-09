package com.example.diploma.kafka;

import com.example.diploma.event.ChallengeCompletedEvent;
import com.example.diploma.model.Notification;
import com.example.diploma.model.enums.NotificationType;
import com.example.diploma.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChallengeEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = KafkaTopics.CHALLENGE_COMPLETED,
            containerFactory = "challengeCompletedKafkaListenerContainerFactory"
    )
    public void handle(ChallengeCompletedEvent event) {

        log.info("NOTIFICATION CHALLENGE COMPLETED: challengeId={}, memberId={}",
                event.challengeId(),
                event.memberId()
        );

        Notification notification = Notification.builder()
                .userId(event.memberId())
                .title("Challenge completed")
                .message("You completed challenge #" + event.challengeId()
                        + " with " + event.finalPoints() + " points.")
                .type(NotificationType.CHALLENGE)
                .build();

        notificationService.createNotification(notification);
    }
}

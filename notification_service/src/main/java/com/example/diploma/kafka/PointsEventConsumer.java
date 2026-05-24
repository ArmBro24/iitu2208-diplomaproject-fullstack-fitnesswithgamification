package com.example.diploma.kafka;

import com.example.diploma.model.Notification;
import com.example.diploma.model.enums.NotificationType;
import com.example.diploma.event.PointsAwardedEvent;
import com.example.diploma.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PointsEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = KafkaTopics.POINTS_AWARDED,
            containerFactory = "pointsAwardedKafkaListenerContainerFactory"
    )
    public void handle(PointsAwardedEvent event) {

        log.info("NOTIFICATION RECEIVED: memberId={}, points={}",
                event.memberId(),
                event.points()
        );

        Notification notification = Notification.builder()
                .userId(event.memberId())
                .title("Points awarded")
                .message("You received " + event.points() + " points.")
                .type(NotificationType.GAMIFICATION)
                .build();

        notificationService.createNotification(notification);
    }
}
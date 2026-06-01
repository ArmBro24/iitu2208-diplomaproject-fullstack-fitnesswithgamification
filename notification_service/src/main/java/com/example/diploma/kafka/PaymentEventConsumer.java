package com.example.diploma.kafka;

import com.example.diploma.event.PaymentCompletedEvent;
import com.example.diploma.event.PaymentRefundedEvent;
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
public class PaymentEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = KafkaTopics.PAYMENT_COMPLETED,
            containerFactory = "paymentCompletedKafkaListenerContainerFactory"
    )
    public void handleCompleted(PaymentCompletedEvent event) {
        log.info("NOTIFICATION PAYMENT COMPLETED: paymentId={}, memberId={}",
                event.paymentId(),
                event.memberId()
        );

        Notification notification = Notification.builder()
                .userId(event.memberId())
                .title("Payment completed")
                .message("Your payment #" + event.paymentId()
                        + " for subscription #" + event.subscriptionId()
                        + " was completed successfully.")
                .type(NotificationType.PAYMENT)
                .build();

        notificationService.createNotification(notification);
    }

    @KafkaListener(
            topics = KafkaTopics.PAYMENT_REFUNDED,
            containerFactory = "paymentRefundedKafkaListenerContainerFactory"
    )
    public void handleRefunded(PaymentRefundedEvent event) {
        log.info("NOTIFICATION PAYMENT REFUNDED: paymentId={}, memberId={}",
                event.paymentId(),
                event.memberId()
        );

        Notification notification = Notification.builder()
                .userId(event.memberId())
                .title("Payment refunded")
                .message("Your payment #" + event.paymentId()
                        + " for subscription #" + event.subscriptionId()
                        + " was refunded.")
                .type(NotificationType.PAYMENT)
                .build();

        notificationService.createNotification(notification);
    }
}
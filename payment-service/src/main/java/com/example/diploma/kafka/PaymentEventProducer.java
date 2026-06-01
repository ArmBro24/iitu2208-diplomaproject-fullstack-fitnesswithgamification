package com.example.diploma.kafka;

import com.example.diploma.event.PaymentCompletedEvent;
import com.example.diploma.event.PaymentRefundedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendPaymentCompleted(PaymentCompletedEvent event) {
        kafkaTemplate.send(
                KafkaTopics.PAYMENT_COMPLETED,
                event
        );
    }

    public void sendPaymentRefunded(PaymentRefundedEvent event) {
        kafkaTemplate.send(
                KafkaTopics.PAYMENT_REFUNDED,
                event
        );
    }
}
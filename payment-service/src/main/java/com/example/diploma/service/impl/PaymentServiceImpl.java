package com.example.diploma.service.impl;

import com.example.diploma.service.PaymentService;

import com.example.diploma.controller.dto.CreatePaymentRequest;
import com.example.diploma.controller.dto.PaymentResponse;
import com.example.diploma.event.PaymentCompletedEvent;
import com.example.diploma.event.PaymentRefundedEvent;
import com.example.diploma.kafka.PaymentEventProducer;
import com.example.diploma.model.Payment;
import com.example.diploma.model.enums.PaymentStatus;
import com.example.diploma.redis.PaymentSession;
import com.example.diploma.repository.PaymentRepository;
import com.example.diploma.repository.PaymentSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentSessionRepository paymentSessionRepository;
    private final PaymentEventProducer paymentEventProducer;

    @Override
    public PaymentResponse createPayment(CreatePaymentRequest request) {
        if (request.subscriptionId() == null) {
            throw new IllegalArgumentException("Subscription id is required");
        }

        if (request.memberId() == null) {
            throw new IllegalArgumentException("Member id is required");
        }

        if (request.amount() == null || request.amount().signum() <= 0) {
            throw new IllegalArgumentException("Payment amount must be positive");
        }

        if (request.currency() == null || request.currency().isBlank()) {
            throw new IllegalArgumentException("Currency is required");
        }

        if (request.method() == null) {
            throw new IllegalArgumentException("Payment method is required");
        }

        LocalDateTime now = LocalDateTime.now();

        Payment entity = Payment.builder()
                .subscriptionId(request.subscriptionId())
                .memberId(request.memberId())
                .amount(request.amount())
                .currency(request.currency())
                .method(request.method())
                .status(PaymentStatus.PENDING)
                .createdAt(now)
                .updatedAt(now)
                .build();

        Payment saved = paymentRepository.save(entity);

        PaymentSession session = PaymentSession.builder()
                .id(String.valueOf(saved.getId()))
                .paymentId(saved.getId())
                .memberId(saved.getMemberId())
                .subscriptionId(saved.getSubscriptionId())
                .status(saved.getStatus().name())
                .createdAt(now)
                .build();

        paymentSessionRepository.save(session);

        log.info("Payment created: paymentId={}, memberId={}, subscriptionId={}, amount={}",
                saved.getId(), saved.getMemberId(), saved.getSubscriptionId(), saved.getAmount());

        return toResponse(saved);
    }

    @Override
    public PaymentResponse markSuccess(Long paymentId) {
        Payment existing = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        if (existing.getStatus() != PaymentStatus.PENDING) {
            throw new IllegalStateException("Payment can be completed only from PENDING. Current status: " + existing.getStatus());
        }

        LocalDateTime now = LocalDateTime.now();

        Payment updated = existing.toBuilder()
                .status(PaymentStatus.SUCCESS)
                .updatedAt(now)
                .paidAt(now)
                .failureReason(null)
                .build();

        Payment saved = paymentRepository.save(updated);

        updateRedisSession(saved, now);

        paymentEventProducer.sendPaymentCompleted(
                PaymentCompletedEvent.builder()
                        .paymentId(saved.getId())
                        .memberId(saved.getMemberId())
                        .subscriptionId(saved.getSubscriptionId())
                        .amount(saved.getAmount())
                        .build()
        );

        log.info("Payment completed: paymentId={}, memberId={}", saved.getId(), saved.getMemberId());

        return toResponse(saved);
    }

    @Override
    public PaymentResponse markFailed(Long paymentId, String reason) {
        Payment existing = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        if (existing.getStatus() != PaymentStatus.PENDING) {
            throw new IllegalStateException("Payment can be failed only from PENDING. Current status: " + existing.getStatus());
        }

        if (reason == null || reason.isBlank()) {
            throw new IllegalArgumentException("Failure reason is required");
        }

        LocalDateTime now = LocalDateTime.now();

        Payment updated = existing.toBuilder()
                .status(PaymentStatus.FAILED)
                .failureReason(reason)
                .updatedAt(now)
                .build();

        Payment saved = paymentRepository.save(updated);

        updateRedisSession(saved, now);

        log.info("Payment failed: paymentId={}, reason={}", saved.getId(), reason);

        return toResponse(saved);
    }

    @Override
    public PaymentResponse refund(Long paymentId) {
        Payment existing = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        if (existing.getStatus() != PaymentStatus.SUCCESS) {
            throw new IllegalStateException("Only successful payment can be refunded. Current status: " + existing.getStatus());
        }

        LocalDateTime now = LocalDateTime.now();

        Payment updated = existing.toBuilder()
                .status(PaymentStatus.REFUNDED)
                .updatedAt(now)
                .refundedAt(now)
                .build();

        Payment saved = paymentRepository.save(updated);

        updateRedisSession(saved, now);

        paymentEventProducer.sendPaymentRefunded(
                PaymentRefundedEvent.builder()
                        .paymentId(saved.getId())
                        .memberId(saved.getMemberId())
                        .subscriptionId(saved.getSubscriptionId())
                        .amount(saved.getAmount())
                        .build()
        );

        log.info("Payment refunded: paymentId={}, memberId={}", saved.getId(), saved.getMemberId());

        return toResponse(saved);
    }

    @Override
    public PaymentResponse getPaymentById(Long paymentId) {
        if (paymentId == null) {
            throw new IllegalArgumentException("Payment id is required");
        }

        return paymentRepository.findById(paymentId)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
    }

    @Override
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<PaymentResponse> getPaymentsByMemberId(Long memberId) {
        if (memberId == null) {
            throw new IllegalArgumentException("Member id is required");
        }

        return paymentRepository.findAllByMemberId(memberId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<PaymentResponse> getPaymentsBySubscriptionId(Long subscriptionId) {
        if (subscriptionId == null) {
            throw new IllegalArgumentException("Subscription id is required");
        }

        return paymentRepository.findAllBySubscriptionId(subscriptionId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private void updateRedisSession(Payment payment, LocalDateTime now) {
        PaymentSession session = PaymentSession.builder()
                .id(String.valueOf(payment.getId()))
                .paymentId(payment.getId())
                .memberId(payment.getMemberId())
                .subscriptionId(payment.getSubscriptionId())
                .status(payment.getStatus().name())
                .createdAt(now)
                .build();

        paymentSessionRepository.save(session);
    }

    private PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getSubscriptionId(),
                payment.getMemberId(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getMethod(),
                payment.getStatus(),
                payment.getFailureReason(),
                payment.getCreatedAt(),
                payment.getUpdatedAt(),
                payment.getPaidAt(),
                payment.getRefundedAt()
        );
    }
}

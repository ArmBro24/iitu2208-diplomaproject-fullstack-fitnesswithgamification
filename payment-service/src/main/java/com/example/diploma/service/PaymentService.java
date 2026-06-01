package com.example.diploma.service;

import com.example.diploma.controller.dto.CreatePaymentRequest;
import com.example.diploma.controller.dto.PaymentResponse;

import java.util.List;

public interface PaymentService {

    PaymentResponse createPayment(CreatePaymentRequest request);

    PaymentResponse markSuccess(Long paymentId);

    PaymentResponse markFailed(Long paymentId, String reason);

    PaymentResponse refund(Long paymentId);

    PaymentResponse getPaymentById(Long paymentId);

    List<PaymentResponse> getPaymentsByMemberId(Long memberId);

    List<PaymentResponse> getPaymentsBySubscriptionId(Long subscriptionId);
}
package com.example.diploma.controller;

import com.example.diploma.controller.dto.CreatePaymentRequest;
import com.example.diploma.controller.dto.PaymentResponse;
import com.example.diploma.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentResponse createPayment(@RequestBody @Valid CreatePaymentRequest req) {
        return paymentService.createPayment(req);
    }

    @PatchMapping("/{paymentId}/success")
    public PaymentResponse markSuccess(@PathVariable Long paymentId) {
        return paymentService.markSuccess(paymentId);
    }

    @PatchMapping("/{paymentId}/failed")
    public PaymentResponse markFailed(@PathVariable Long paymentId,
                                      @RequestParam String reason) {
        return paymentService.markFailed(paymentId, reason);
    }

    @PatchMapping("/{paymentId}/refund")
    public PaymentResponse refund(@PathVariable Long paymentId) {
        return paymentService.refund(paymentId);
    }

    @GetMapping("/{paymentId}")
    public PaymentResponse getPaymentById(@PathVariable Long paymentId) {
        return paymentService.getPaymentById(paymentId);
    }

    @GetMapping("/member/{memberId}")
    public List<PaymentResponse> getPaymentsByMemberId(@PathVariable Long memberId) {
        return paymentService.getPaymentsByMemberId(memberId);
    }

    @GetMapping("/subscription/{subscriptionId}")
    public List<PaymentResponse> getPaymentsBySubscriptionId(@PathVariable Long subscriptionId) {
        return paymentService.getPaymentsBySubscriptionId(subscriptionId);
    }
}
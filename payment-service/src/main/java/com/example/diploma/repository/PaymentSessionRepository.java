package com.example.diploma.repository;

import com.example.diploma.redis.PaymentSession;
import org.springframework.data.repository.CrudRepository;

public interface PaymentSessionRepository extends CrudRepository<PaymentSession, String> {
}
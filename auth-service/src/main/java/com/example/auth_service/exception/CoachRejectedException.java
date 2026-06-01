package com.example.auth_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class CoachRejectedException extends RuntimeException {
    public CoachRejectedException(String message) {
        super(message);
    }
}
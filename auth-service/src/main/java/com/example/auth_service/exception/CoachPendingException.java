package com.example.auth_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class CoachPendingException extends RuntimeException {
    public CoachPendingException(String message) {
        super(message);
    }
}
package com.example.auth_service.service;

import com.example.auth_service.controller.dto.AuthResponse;
import com.example.auth_service.controller.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(String email, String password);
}
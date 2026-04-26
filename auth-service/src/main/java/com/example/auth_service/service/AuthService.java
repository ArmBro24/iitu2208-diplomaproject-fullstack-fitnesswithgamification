package com.example.auth_service.service;

import com.example.auth_service.controller.dto.AuthResponse;

public interface AuthService {

    AuthResponse register(String email, String password, String role);

    AuthResponse login(String email, String password);
}
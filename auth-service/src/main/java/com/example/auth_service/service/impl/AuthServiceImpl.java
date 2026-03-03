package com.example.auth_service.service.impl;

import com.example.auth_service.controller.dto.AuthResponse;
import com.example.auth_service.model.entity.User;
import com.example.auth_service.model.enums.Role;
import com.example.auth_service.repository.UserRepository;
import com.example.auth_service.service.AuthService;
import com.example.auth_service.util.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(String email, String password) {

        boolean exists = userRepository.findAll().stream()
                .anyMatch(u -> u.getEmail().equalsIgnoreCase(email));

        if (exists) {
            throw new IllegalStateException("User already exists");
        }

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.MEMBER)
                .createdAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(user);

        String token = jwtService.generateToken(saved);

        return new AuthResponse(token, saved.getId(), saved.getRole().name());
    }

    @Override
    public AuthResponse login(String email, String password) {

        User user = userRepository.findAll().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(token, user.getId(), user.getRole().name());
    }
}
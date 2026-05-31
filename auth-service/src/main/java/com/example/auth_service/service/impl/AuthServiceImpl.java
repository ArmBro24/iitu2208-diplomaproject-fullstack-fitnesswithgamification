package com.example.auth_service.service.impl;

import com.example.auth_service.controller.dto.AuthResponse;
import com.example.auth_service.controller.dto.RegisterRequest;
import com.example.auth_service.exception.CoachPendingException;
import com.example.auth_service.exception.CoachRejectedException;
import com.example.auth_service.model.entity.User;
import com.example.auth_service.model.enums.Role;
import com.example.auth_service.repository.UserRepository;
import com.example.auth_service.service.AuthService;
import com.example.auth_service.util.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(u -> {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User already exists");
        });

        Role requestedRole = Role.valueOf(request.role());

        if (requestedRole == Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot register as ADMIN");
        }

        String initialStatus = (requestedRole == Role.COACH) ? "PENDING" : "ACTIVE";

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(requestedRole)
                .firstName(request.firstName())
                .lastName(request.lastName())
                .nickname(request.nickname())
                .phone(request.phone())
                .gender(request.gender())
                .birthDate(request.birthDate())
                .status(initialStatus)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);

        return new AuthResponse(token, saved.getId(), saved.getRole().name());
    }

    @Override
    public AuthResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                ));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        if (user.getRole() == Role.COACH && "PENDING".equalsIgnoreCase(user.getStatus())) {
            throw new CoachPendingException("Trainer status is pending approval.");
        }

        if (user.getRole() == Role.COACH && "REJECTED".equalsIgnoreCase(user.getStatus())) {
            throw new CoachRejectedException("Trainer status is rejected.");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getRole().name());
    }

    public void reapplyForApproval(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() != Role.COACH || !"REJECTED".equalsIgnoreCase(user.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only rejected trainers can re-apply.");
        }

        user.setStatus("PENDING");
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }
}
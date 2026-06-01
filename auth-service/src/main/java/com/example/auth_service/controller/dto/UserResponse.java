package com.example.auth_service.controller.dto;

import com.example.auth_service.model.entity.User;
import com.example.auth_service.model.enums.Role;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String email,
        Role role,
        String firstName,
        String lastName,
        String nickname,
        String phone,
        String gender,
        LocalDate birthDate,
        String status,
        String avatarUrl,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getFirstName(),
                user.getLastName(),
                user.getNickname(),
                user.getPhone(),
                user.getGender(),
                user.getBirthDate(),
                user.getStatus(),
                user.getAvatarUrl(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
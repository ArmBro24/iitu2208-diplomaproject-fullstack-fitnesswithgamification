package com.example.auth_service.controller.dto;

import java.util.List;

public record AdminUsersOverviewResponse(
        long totalUsers,
        long members,
        long coaches,
        long admins,
        List<UserResponse> users
) {
}

package com.example.auth_service.controller;

import com.example.auth_service.controller.dto.AdminUsersOverviewResponse;
import com.example.auth_service.controller.dto.UserResponse;
import com.example.auth_service.model.enums.Role;
import com.example.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/users")
    public AdminUsersOverviewResponse getUsersOverview() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(UserResponse::from)
                .toList();

        return new AdminUsersOverviewResponse(
                users.size(),
                users.stream().filter(user -> user.role() == Role.MEMBER).count(),
                users.stream().filter(user -> user.role() == Role.COACH).count(),
                users.stream().filter(user -> user.role() == Role.ADMIN).count(),
                users
        );
    }
}

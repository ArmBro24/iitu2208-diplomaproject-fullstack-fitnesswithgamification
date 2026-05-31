package com.example.auth_service.controller;

import com.example.auth_service.controller.dto.AdminUsersOverviewResponse;
import com.example.auth_service.controller.dto.UserResponse;
import com.example.auth_service.model.entity.User;
import com.example.auth_service.model.enums.Role;
import com.example.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
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

    @GetMapping("/users/pending-trainers")
    public List<UserResponse> getPendingTrainers() {
        return userRepository.findAllByRoleAndStatus(Role.COACH, "PENDING").stream()
                .map(UserResponse::from)
                .toList();
    }

    @PostMapping("/users/{id}/approve")
    public UserResponse approveTrainer(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() != Role.COACH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only trainers can be approved");
        }

        user.setStatus("ACTIVE");
        user.setUpdatedAt(LocalDateTime.now());

        return UserResponse.from(userRepository.save(user));
    }

    @PostMapping("/users/{id}/reject")
    public UserResponse rejectTrainer(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() != Role.COACH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only trainers can be rejected");
        }

        user.setStatus("REJECTED");
        user.setUpdatedAt(LocalDateTime.now());

        return UserResponse.from(userRepository.save(user));
    }
}
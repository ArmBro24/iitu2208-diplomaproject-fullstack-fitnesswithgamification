package com.example.auth_service.controller;

import com.example.auth_service.controller.dto.UserResponse;
import com.example.auth_service.model.enums.Role;
import com.example.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/trainers")
    public List<UserResponse> getAllTrainers() {
        return userRepository.findAllByRole(Role.COACH).stream()
                .map(UserResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(UserResponse::from)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}

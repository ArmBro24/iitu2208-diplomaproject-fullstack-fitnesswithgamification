package com.example.auth_service.controller;

import com.example.auth_service.model.entity.User;
import com.example.auth_service.model.enums.Role;
import com.example.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/trainers")
    public List<User> getAllTrainers() {
        return userRepository.findAllByRole(Role.COACH);
    }

    @GetMapping("/my-clients/{coachId}")
    public List<User> getMyClients(@PathVariable Long coachId) {
        return userRepository.findAllByCoachId(coachId);
    }

    @PutMapping("/{clientId}/assign-coach/{coachId}")
    public User assignCoach(@PathVariable Long clientId, @PathVariable Long coachId) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setCoachId(coachId);
        return userRepository.save(client);
    }
}
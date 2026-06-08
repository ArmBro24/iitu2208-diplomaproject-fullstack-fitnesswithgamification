package com.example.auth_service.controller;

import com.example.auth_service.controller.dto.UserResponse;
import com.example.auth_service.model.entity.User;
import com.example.auth_service.model.enums.Role;
import com.example.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/trainers")
    public List<UserResponse> getActiveTrainers() {
        return userRepository.findAllByRoleAndStatus(Role.COACH, "ACTIVE")
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    @PostMapping("/{id}/avatar")
    public UserResponse uploadAvatar(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Avatar file is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase(Locale.ROOT).startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Avatar must be an image");
        }

        User user = getUserEntity(id);

        try {
            Path uploadDir = Path.of("uploads", "avatars");
            Files.createDirectories(uploadDir);

            String extension = extensionFor(contentType);
            String filename = "user-" + id + "-" + UUID.randomUUID() + extension;
            Path target = uploadDir.resolve(filename);

            file.transferTo(target);
            deleteLocalAvatar(user.getAvatarUrl());

            String avatarUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/avatars/")
                    .path(filename)
                    .toUriString();

            user.setAvatarUrl(avatarUrl);
            User saved = userRepository.save(user);
            return UserResponse.from(saved);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save avatar", ex);
        }
    }

    @DeleteMapping("/{id}/avatar")
    public UserResponse deleteAvatar(@PathVariable Long id) {
        User user = getUserEntity(id);
        deleteLocalAvatar(user.getAvatarUrl());
        user.setAvatarUrl(null);
        return UserResponse.from(userRepository.save(user));
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        return UserResponse.from(getUserEntity(id));
    }

    private User getUserEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private String extensionFor(String contentType) {
        return switch (contentType.toLowerCase(Locale.ROOT)) {
            case "image/jpeg", "image/jpg" -> ".jpg";
            case "image/gif" -> ".gif";
            case "image/webp" -> ".webp";
            default -> ".png";
        };
    }

    private void deleteLocalAvatar(String avatarUrl) {
        if (avatarUrl == null || !avatarUrl.contains("/uploads/avatars/")) {
            return;
        }

        String filename = avatarUrl.substring(avatarUrl.lastIndexOf('/') + 1);
        try {
            Files.deleteIfExists(Path.of("uploads", "avatars", filename));
        } catch (IOException ignored) {
        }
    }
}

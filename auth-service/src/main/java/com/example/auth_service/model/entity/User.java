package com.example.auth_service.model.entity;

import com.example.auth_service.model.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "\"users\"")
@Builder(toBuilder = true)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String firstName;
    private String lastName;
    private String nickname;
    private String phone;
    private String gender;
    private java.time.LocalDate birthDate;
    private String status;
    private String avatarUrl;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
}
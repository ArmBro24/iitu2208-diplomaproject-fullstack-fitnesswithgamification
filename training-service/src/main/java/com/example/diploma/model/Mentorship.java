package com.example.diploma.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "mentorships")
public class Mentorship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long coachId;

    @Column(nullable = false, unique = true)
    private Long clientId;

    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String status = "Active";

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
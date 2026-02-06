package com.example.diploma.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "\"characters\"")
@Builder(toBuilder = true)
public class Character {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private Integer level;

    @Column(nullable = false)
    private Integer xp;

    @Column(nullable = false)
    private Integer totalPoints;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}

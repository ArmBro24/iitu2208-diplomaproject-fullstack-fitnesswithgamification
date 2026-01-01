package com.example.diploma.model;

import com.example.diploma.model.enums.SessionLogStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "\"session_logs\"",
        indexes = {
                @Index(name = "ix_session_logs_session_id", columnList = "sessionId"),
                @Index(name = "ix_session_logs_member_id", columnList = "memberId")
        }
)
@Builder(toBuilder = true)
public class SessionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long sessionId;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private Long coachId;

    @Column(length = 2000)
    private String memberComment;

    private Integer pointsAwarded;

    @Column(length = 2000)
    private String coachComment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionLogStatus status;

    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
}

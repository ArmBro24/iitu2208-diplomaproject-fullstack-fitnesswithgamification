package com.example.diploma.controller;

import com.example.diploma.controller.dto.AdminMentorshipDto;
import com.example.diploma.controller.dto.AdminTrainingOverviewDto;
import com.example.diploma.model.enums.SessionLogStatus;
import com.example.diploma.model.enums.TrainingSessionStatus;
import com.example.diploma.repository.MentorshipRepository;
import com.example.diploma.repository.SessionLogRepository;
import com.example.diploma.repository.TrainingSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/training/admin")
@RequiredArgsConstructor
public class AdminTrainingController {

    private final TrainingSessionRepository trainingSessionRepository;
    private final MentorshipRepository mentorshipRepository;
    private final SessionLogRepository sessionLogRepository;

    @GetMapping("/overview")
    public AdminTrainingOverviewDto getOverview() {
        return new AdminTrainingOverviewDto(
                trainingSessionRepository.count(),
                mentorshipRepository.count(),
                sessionLogRepository.countByStatus(SessionLogStatus.SUBMITTED),
                trainingSessionRepository.countByStatus(TrainingSessionStatus.COMPLETED)
        );
    }

    @GetMapping("/relationships")
    public List<AdminMentorshipDto> getRelationships() {
        return mentorshipRepository.findAll().stream()
                .map(mentorship -> new AdminMentorshipDto(
                        mentorship.getId(),
                        mentorship.getCoachId(),
                        mentorship.getClientId(),
                        mentorship.getStatus(),
                        mentorship.getCreatedAt()
                ))
                .toList();
    }
}

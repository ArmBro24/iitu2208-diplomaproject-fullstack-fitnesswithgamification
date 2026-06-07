package com.example.diploma.controller;

import com.example.diploma.controller.dto.AdminMentorshipDto;
import com.example.diploma.controller.dto.AdminTrainingOverviewDto;
import com.example.diploma.model.TrainingCategory;
import com.example.diploma.model.enums.SessionLogStatus;
import com.example.diploma.model.enums.TrainingSessionStatus;
import com.example.diploma.repository.MentorshipRepository;
import com.example.diploma.repository.SessionLogRepository;
import com.example.diploma.repository.TrainingSessionRepository;
import com.example.diploma.repository.TrainingCategoryRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training/admin")
@RequiredArgsConstructor
public class AdminTrainingController {

    private final TrainingSessionRepository trainingSessionRepository;
    private final MentorshipRepository mentorshipRepository;
    private final SessionLogRepository sessionLogRepository;
    private final TrainingCategoryRepository trainingCategoryRepository;

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

    @GetMapping("/categories")
    public List<TrainingCategory> getAllCategories() {
        return trainingCategoryRepository.findAll();
    }

    @PostMapping("/categories")
    public TrainingCategory createCategory(@RequestBody @Valid TrainingCategory category) {
        return trainingCategoryRepository.save(category);
    }

    @PutMapping("/categories/{id}")
    public TrainingCategory updateCategory(@PathVariable Long id, @RequestBody @Valid TrainingCategory updatedCategory) {
        return trainingCategoryRepository.findById(id)
                .map(cat -> {
                    cat.setName(updatedCategory.getName());
                    cat.setDefaultPoints(updatedCategory.getDefaultPoints());

                    cat.getDefaultExercises().clear();
                    if (updatedCategory.getDefaultExercises() != null) {
                        cat.getDefaultExercises().addAll(updatedCategory.getDefaultExercises());
                    }

                    return trainingCategoryRepository.save(cat);
                })
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @DeleteMapping("/categories/{id}")
    public void deleteCategory(@PathVariable Long id) {
        trainingCategoryRepository.deleteById(id);
    }
}
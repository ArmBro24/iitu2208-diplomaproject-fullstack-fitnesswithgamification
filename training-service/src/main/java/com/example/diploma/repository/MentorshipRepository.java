package com.example.diploma.repository;

import com.example.diploma.model.Mentorship;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MentorshipRepository extends JpaRepository<Mentorship, Long> {
    Optional<Mentorship> findByClientId(Long clientId);
    List<Mentorship> findAllByCoachId(Long coachId);
    void deleteByClientId(Long clientId);
}
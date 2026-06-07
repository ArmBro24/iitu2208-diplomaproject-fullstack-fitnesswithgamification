package com.example.diploma.repository;

import com.example.diploma.model.TrainingCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TrainingCategoryRepository extends JpaRepository<TrainingCategory, Long> {
    Optional<TrainingCategory> findByName(String name);
}
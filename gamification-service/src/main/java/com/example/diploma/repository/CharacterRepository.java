package com.example.diploma.repository;

import com.example.diploma.model.Character;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CharacterRepository extends JpaRepository<Character, Long> {
}

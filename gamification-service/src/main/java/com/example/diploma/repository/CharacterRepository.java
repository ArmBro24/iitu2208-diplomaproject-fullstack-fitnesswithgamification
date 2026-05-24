package com.example.diploma.repository;

import com.example.diploma.model.Character;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CharacterRepository extends JpaRepository<Character, Long> {

    boolean existsByMemberId(Long memberId);

    Optional<Character> findByMemberId(Long memberId);
}
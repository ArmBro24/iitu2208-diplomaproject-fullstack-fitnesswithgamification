package com.example.auth_service.repository;

import com.example.auth_service.model.entity.User;
import com.example.auth_service.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findAllByRole(Role role);
    List<User> findAllByCoachId(Long coachId);
}
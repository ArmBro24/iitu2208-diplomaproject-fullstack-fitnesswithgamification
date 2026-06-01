package com.example.auth_service.repository;

import com.example.auth_service.model.entity.User;
import com.example.auth_service.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findAllByRole(Role role);
    Optional<User> findByEmail(String email);
    List<User> findAllByRoleAndStatus(Role role, String status);
}
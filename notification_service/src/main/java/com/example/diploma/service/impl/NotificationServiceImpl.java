package com.example.diploma.service.impl;

import com.example.diploma.model.Notification;
import com.example.diploma.repository.NotificationRepository;
import com.example.diploma.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public Notification createNotification(Notification notification) {
        Notification entity = notification.toBuilder()
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        return notificationRepository.save(entity);
    }

    @Override
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findAll().stream()
                .filter(n -> n.getUserId().equals(userId))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }

    @Override
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findAll().stream()
                .filter(n -> n.getUserId().equals(userId))
                .filter(n -> Boolean.FALSE.equals(n.getIsRead()))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }

    @Override
    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        Notification updated = notification.toBuilder()
                .isRead(true)
                .build();

        return notificationRepository.save(updated);
    }

    @Override
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findAll().stream()
                .filter(n -> n.getUserId().equals(userId))
                .filter(n -> Boolean.FALSE.equals(n.getIsRead()))
                .toList();

        for (Notification notification : notifications) {
            Notification updated = notification.toBuilder()
                    .isRead(true)
                    .build();

            notificationRepository.save(updated);
        }
    }
}
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
        validateCreateNotification(notification);

        notification.setCreatedAt(LocalDateTime.now());
        notification.setIsRead(false);

        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getUserNotifications(Long userId) {
        validateUserId(userId);

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Notification> getUnreadNotifications(Long userId) {
        validateUserId(userId);

        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    @Override
    public Notification markAsRead(Long id) {
        validateNotificationId(id);

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        if (Boolean.TRUE.equals(notification.getIsRead())) {
            return notification;
        }

        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(Long userId) {
        validateUserId(userId);

        List<Notification> notifications =
                notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);

        if (notifications.isEmpty()) {
            return;
        }

        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }


    private void validateCreateNotification(Notification notification) {
        if (notification == null) {
            throw new IllegalArgumentException("Notification is required");
        }

        validateUserId(notification.getUserId());

        if (notification.getTitle() == null || notification.getTitle().isBlank()) {
            throw new IllegalArgumentException("Notification title is required");
        }

        if (notification.getMessage() == null || notification.getMessage().isBlank()) {
            throw new IllegalArgumentException("Notification message is required");
        }

        if (notification.getType() == null) {
            throw new IllegalArgumentException("Notification type is required");
        }
    }

    private void validateUserId(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Valid userId is required");
        }
    }

    private void validateNotificationId(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Valid notificationId is required");
        }
    }
}
package com.example.diploma.controller;

import com.example.diploma.controller.dto.CreateNotificationRequest;
import com.example.diploma.controller.dto.NotificationResponse;
import com.example.diploma.model.Notification;
import com.example.diploma.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public NotificationResponse create(@RequestBody @Valid CreateNotificationRequest request) {
        Notification notification = Notification.builder()
                .userId(request.userId())
                .title(request.title())
                .message(request.message())
                .type(request.type())
                .build();

        return map(notificationService.createNotification(notification));
    }

    @GetMapping("/user/{userId}")
    public List<NotificationResponse> getUserNotifications(@PathVariable Long userId) {
        return notificationService.getUserNotifications(userId).stream()
                .map(this::map)
                .toList();
    }

    @GetMapping("/user/{userId}/unread")
    public List<NotificationResponse> getUnreadNotifications(@PathVariable Long userId) {
        return notificationService.getUnreadNotifications(userId).stream()
                .map(this::map)
                .toList();
    }

    @PatchMapping("/{id}/read")
    public NotificationResponse markAsRead(@PathVariable Long id) {
        return map(notificationService.markAsRead(id));
    }

    @PatchMapping("/user/{userId}/read-all")
    public void markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
    }

    private NotificationResponse map(Notification notification) {
        return new NotificationResponse(
                notification.getNotificationId(),
                notification.getUserId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.getIsRead(),
                notification.getCreatedAt()
        );
    }
}
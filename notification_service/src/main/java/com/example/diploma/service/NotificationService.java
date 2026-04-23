package com.example.diploma.service;

import com.example.diploma.model.Notification;

import java.util.List;

public interface NotificationService {

    Notification createNotification(Notification notification);

    List<Notification> getUserNotifications(Long userId);

    List<Notification> getUnreadNotifications(Long userId);

    Notification markAsRead(Long id);

    void markAllAsRead(Long userId);

}

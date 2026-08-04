import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

import { NotificationHubService } from './notification-hub.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationStoreService {

  constructor(
    private notificationService: NotificationService,
    private notificationHub: NotificationHubService
  ) { }

  // =====================================
  // Load Initial Notifications
  // =====================================

  loadInitialData(): void {

    forkJoin({

      notifications:
        this.notificationService.getNotifications(),

      unreadCount:
        this.notificationService.getUnreadCount()

    }).subscribe({

      next: ({ notifications, unreadCount }) => {

        this.notificationHub.setNotifications(
          notifications.items
        );

        this.notificationHub.setUnreadCount(
          unreadCount
        );

      },

      error: (error) => {

        console.error(
          'Failed to load notifications',
          error
        );

      }

    });

  }

  // =====================================
  // Refresh Notifications
  // =====================================

  refresh(): void {

    this.loadInitialData();

  }

  // =====================================
  // Mark As Read
  // =====================================

  markAsRead(notificationId: number): void {

    this.notificationService
      .markAsRead(notificationId)
      .subscribe({

        next: () => {

          this.notificationHub.markAsRead(
            notificationId
          );

        },

        error: (error) => {

          console.error(
            'Failed to mark notification as read',
            error
          );

        }

      });

  }

  // =====================================
  // Mark All As Read
  // =====================================

  markAllAsRead(): void {

    const unreadNotifications =
      this.notificationHub
        .getNotifications()()
        .filter(notification => !notification.isRead);

    if (unreadNotifications.length === 0) {
      return;
    }

    unreadNotifications.forEach(notification => {

      this.notificationService
        .markAsRead(notification.id)
        .subscribe({

          next: () => {

            this.notificationHub.markAsRead(
              notification.id
            );

          },

          error: (error) => {

            console.error(
              'Failed to mark notification as read',
              error
            );

          }

        });

    });

  }

  // =====================================
  // Clear Store
  // =====================================

  clear(): void {
    this.notificationHub.clear();

  }

}
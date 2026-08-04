import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { INotification } from '../../../shared/interfaces/Notification/inotification';
import { NotificationHubService } from '../../../core/services/notification-hub.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RelativeTimePipe } from '../../pipes/pipe-transform';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    RelativeTimePipe,
    RouterLink
  ],
  templateUrl: './notification-dropdown.html',
  styleUrl: './notification-dropdown.css'
})
export class NotificationDropdown {

  private readonly notificationHub = inject(NotificationHubService);
  private readonly notificationService = inject(NotificationService);

  readonly notifications = this.notificationHub.getNotifications();
  readonly unreadCount = this.notificationHub.getUnreadCount();

  markAsRead(notification: INotification): void {

    if (notification.isRead) {
      return;
    }

    this.notificationService.markAsRead(notification.id)
      .subscribe({

        next: () => {

          this.notificationHub.markAsRead(notification.id);

        },

        error: err => {

          console.error(err);

        }

      });

  }

  markAllAsRead(): void {

    const unreadNotifications =
      this.notifications().filter(n => !n.isRead);

    unreadNotifications.forEach(notification => {

      this.notificationService
        .markAsRead(notification.id)
        .subscribe({
          next: () => {

            this.notificationHub.markAsRead(notification.id);

          },
          error: err => console.error(err)
        });

    });

  }

}
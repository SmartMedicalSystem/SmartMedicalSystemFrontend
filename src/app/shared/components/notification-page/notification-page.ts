import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { NotificationStoreService } from '../../../core/services/notification-store.service';
import { NotificationHubService } from '../../../core/services/notification-hub.service';
import { RelativeTimePipe } from '../../pipes/pipe-transform';

@Component({
  selector: 'app-notification-page',
  standalone: true,
  imports: [CommonModule, RelativeTimePipe],
  templateUrl: './notification-page.html',
  styleUrl: './notification-page.css',
})
export class NotificationPage {
  private readonly notificationHub = inject(NotificationHubService);
  private readonly notificationStore = inject(NotificationStoreService);

  readonly unreadCount = this.notificationHub.getUnreadCount();
  readonly allNotifications = this.notificationHub.getNotifications();

  // all | unread | read
  readonly selectedFilter = signal<'all' | 'unread' | 'read'>('all');

  readonly notifications = computed(() => {
    const filter = this.selectedFilter();
    const notifications = this.allNotifications();

    switch (filter) {
      case 'unread':
        return notifications.filter((n) => !n.isRead);

      case 'read':
        return notifications.filter((n) => n.isRead);

      default:
        return notifications;
    }
  });

  ngOnInit(): void {
    this.notificationStore.loadInitialData();
  }

  setFilter(filter: 'all' | 'unread' | 'read'): void {
    this.selectedFilter.set(filter);
  }

  markAsRead(id: number): void {
    this.notificationStore.markAsRead(id);
  }

  markAllAsRead(): void {
    this.notificationStore.markAllAsRead();
  }

  trackByNotification(index: number, notification: any): number {
    return notification.id;
  }
}

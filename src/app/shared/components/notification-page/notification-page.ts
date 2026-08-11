import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { Router } from '@angular/router';

import { NotificationHubService } from '../../../core/services/notification-hub.service';
import { NotificationStoreService } from '../../../core/services/notification-store.service';

import { INotification } from '../../../shared/interfaces/Notification/inotification';

import { RelativeTimePipe } from '../../pipes/pipe-transform';

@Component({
  selector: 'app-notification-page',
  standalone: true,
  imports: [
    CommonModule,
    RelativeTimePipe
  ],
  templateUrl: './notification-page.html',
  styleUrl: './notification-page.css',
})
export class NotificationPage {

  // ==========================================
  // Services
  // ==========================================

  private readonly notificationHub =
    inject(NotificationHubService);

  private readonly notificationStore =
    inject(NotificationStoreService);

  private readonly router =
    inject(Router);

  // ==========================================
  // Notifications
  // ==========================================

  readonly unreadCount =
    this.notificationHub.getUnreadCount();

  readonly allNotifications =
    this.notificationHub.getNotifications();

  // ==========================================
  // Selected Filter
  // ==========================================

  readonly selectedFilter =
    signal<'all' | 'unread' | 'read'>('all');

  // ==========================================
  // Filtered Notifications
  // ==========================================

  readonly notifications = computed(() => {

    const filter =
      this.selectedFilter();

    const notifications =
      this.allNotifications();

    switch (filter) {

      // ======================================
      // Unread
      // ======================================

      case 'unread':

        return notifications.filter(
          notification => !notification.isRead
        );

      // ======================================
      // Read
      // ======================================

      case 'read':

        return notifications.filter(
          notification => notification.isRead
        );

      // ======================================
      // All
      // ======================================

      default:

        return notifications;

    }

  });

  // ==========================================
  // Change Filter
  // ==========================================

  setFilter(
    filter: 'all' | 'unread' | 'read'
  ): void {

    this.selectedFilter.set(filter);

  }

  // ==========================================
  // Notification Click
  // ==========================================

  onNotificationClick(
    notification: INotification
  ): void {

    // ======================================
    // 1. Mark As Read
    // ======================================

    if (!notification.isRead) {

      this.notificationStore.markAsRead(
        notification.id
      );

    }

    // ======================================
    // 2. Navigate
    // ======================================

    this.navigateToNotification(
      notification
    );

  }

  // ==========================================
  // Notification Navigation
  // ==========================================

  private navigateToNotification(
    notification: INotification
  ): void {

    switch (notification.type) {

      // =====================================
      // Doctor → Lab Technician
      // =====================================

      case 'LabTestRequested':

        if (!notification.requestLabsId) {

          console.warn(
            '⚠️ LabTestRequested notification has no requestLabsId',
            notification
          );

          return;

        }

        this.router.navigate(
          [
            '/labtechnician/dashboard/requests/all-requests'
          ],
          {
            queryParams: {
              requestLabsId:
                notification.requestLabsId
            }
          }
        );

        break;

      // =====================================
      // Lab Technician → Doctor
      // =====================================

      case 'LabResultReady':

        if (!notification.patientId) {

          console.warn(
            '⚠️ LabResultReady notification has no patientId',
            notification
          );

          return;

        }

        this.router.navigate([
          '/doctor/dashboard/patients/patient-details',
          notification.patientId
        ]);

        break;

      // =====================================
      // Appointment Reminder
      // =====================================

      case 'AppointmentReminder':

        console.log(
          '📅 AppointmentReminder notification clicked',
          notification
        );

        /*
         * Appointment destination will be added
         * when its route and required ID are defined.
         */

        break;

      // =====================================
      // AI Report Generated
      // =====================================

      case 'AIReportGenerated':

        console.log(
          '🤖 AIReportGenerated notification clicked',
          notification
        );

        /*
         * AI Report destination will be added
         * when its route and required ID are defined.
         */

        break;

      // =====================================
      // Unknown Type
      // =====================================

      default:

        console.warn(
          '⚠️ Unknown notification type',
          notification
        );

        break;

    }

  }

  // ==========================================
  // Mark As Read
  // ==========================================

  markAsRead(
    id: number
  ): void {

    this.notificationStore.markAsRead(id);

  }

  // ==========================================
  // Mark All As Read
  // ==========================================

  markAllAsRead(): void {

    this.notificationStore.markAllAsRead();

  }

  // ==========================================
  // Track By
  // ==========================================

  trackByNotification(
    index: number,
    notification: INotification
  ): number {

    return notification.id;

  }

}
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { INotification } from '../../../shared/interfaces/Notification/inotification';

import { NotificationHubService } from '../../../core/services/notification-hub.service';
import { NotificationStoreService } from '../../../core/services/notification-store.service';

import { RelativeTimePipe } from '../../pipes/pipe-transform';

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

  // ==============================
  // Services
  // ==============================

  private readonly notificationHub =
    inject(NotificationHubService);

  private readonly notificationStore =
    inject(NotificationStoreService);

  private readonly router =
    inject(Router);

  // ==============================
  // Notifications
  // ==============================

  readonly notifications =
    this.notificationHub.getNotifications();

  readonly unreadCount =
    this.notificationHub.getUnreadCount();

  // ==============================
  // Notification Click
  // ==============================

  onNotificationClick(
    notification: INotification
  ): void {

    // =====================================
    // 1. Mark As Read
    // =====================================

    if (!notification.isRead) {

      this.notificationStore.markAsRead(
        notification.id
      );

    }

    // =====================================
    // 2. Navigate
    // =====================================

    this.navigateToNotification(
      notification
    );

  }

  // ==============================
  // Navigation
  // ==============================

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
         * when the required route/id is defined.
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
         * when the required route/id is defined.
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

  // ==============================
  // Mark All As Read
  // ==============================

  markAllAsRead(): void {

    this.notificationStore.markAllAsRead();

  }

}
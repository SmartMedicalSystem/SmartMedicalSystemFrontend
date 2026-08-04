import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';

import { AuthenticationService } from './authenticationService.service';
import { INotification } from '../../shared/interfaces/Notification/inotification';

@Injectable({
  providedIn: 'root'
})
export class NotificationHubService {

  private hubConnection!: signalR.HubConnection;

  private readonly notifications = signal<INotification[]>([]);
  private readonly unreadCount = signal(0);

  constructor(
    private authService: AuthenticationService
  ) {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        'https://smartmedicalsystem.runasp.net/notificationHub',
        {
          accessTokenFactory: () =>
            this.authService.getAccessToken() ?? ''
        }
      )
      .withAutomaticReconnect()
      .build();

  }

  // =============================
  // SignalR Connection
  // =============================

  startConnection(): void {

    if (
      this.hubConnection.state !==
      signalR.HubConnectionState.Disconnected
    ) {
      return;
    }

    this.hubConnection
      .start()
      .then(() => {

        console.log('✅ SignalR Connected');

        this.registerEvents();

      })
      .catch(error => {

        console.error('❌ SignalR Error', error);

      });

  }

  stopConnection(): Promise<void> {

    return this.hubConnection.stop();

  }

  // =============================
  // SignalR Events
  // =============================

  private registerEvents(): void {

    this.hubConnection.off('ReceiveNotification');

    this.hubConnection.on(
      'ReceiveNotification',
      (message: string, sentAt: string) => {

        const notification: INotification = {

          id: Date.now(), // مؤقتًا لحد ما الباك يرجع Id الحقيقي

          message,

          sentAt,

          isRead: false

        };

        this.notifications.update(list => [
          notification,
          ...list
        ]);

        this.unreadCount.update(count => count + 1);

      });

  }

  // =============================
  // Getters
  // =============================

  getNotifications() {
    return this.notifications.asReadonly();
  }

  getUnreadCount() {
    return this.unreadCount.asReadonly();
  }

  // =============================
  // Setters
  // =============================

  setNotifications(
    notifications: INotification[]
  ): void {

    this.notifications.set(notifications);

  }

  setUnreadCount(
    count: number
  ): void {

    this.unreadCount.set(count);

  }

  // =============================
  // Update Notification
  // =============================

  markAsRead(
    notificationId: number
  ): void {

    this.notifications.update(list =>
      list.map(notification =>
        notification.id === notificationId
          ? {
            ...notification,
            isRead: true
          }
          : notification
      )
    );

    this.unreadCount.update(count =>
      Math.max(0, count - 1)
    );

  }

  markAllAsRead(): void {

    this.notifications.update(list =>
      list.map(notification => ({
        ...notification,
        isRead: true
      }))
    );

    this.unreadCount.set(0);

  }

  // =============================
  // Clear
  // =============================

  clear(): void {
    this.notifications.set([]);
    this.unreadCount.set(0);
  }

}
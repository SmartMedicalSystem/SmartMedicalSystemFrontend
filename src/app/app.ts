import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { LoadingService } from './core/services/loadingService.service';
import { Loader } from './shared/components/loader/loader';

import { AuthenticationService } from './core/services/authenticationService.service';
import { NotificationHubService } from './core/services/notification-hub.service';
import { NotificationStoreService } from './core/services/notification-store.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Loader
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('SMS');

  loadingService = inject(LoadingService);

  private readonly router = inject(Router);
  private readonly authService = inject(AuthenticationService);
  private readonly notificationHub = inject(NotificationHubService);
  private readonly notificationStore = inject(NotificationStoreService);


  constructor() {

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {

        this.initializeNotifications();

      });

  }

  private async initializeNotifications(): Promise<void> {

    // المستخدم غير مسجل الدخول
    if (!this.authService.isAuthenticated()) {
      return;
    }

    // SignalR شغال بالفعل
    if (this.notificationHub.isConnected()) {
      return;
    }

    try {

      await this.notificationHub.startConnection();

      this.notificationStore.loadInitialData();

      console.log('🔔 Notifications initialized');
    } catch (error) {

      console.error(
        '❌ Failed to initialize notifications',
        error
      );

    }

  }

}
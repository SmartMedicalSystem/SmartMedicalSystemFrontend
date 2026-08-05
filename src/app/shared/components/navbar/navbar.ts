import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, output, Output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faMagnifyingGlass,
  faBell,
  faClockRotateLeft,
  faComment,
  faFileExport,
  faChartColumn,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../../../core/services/authenticationService.service';
import { jwtDecode } from 'jwt-decode';
import { NotificationHubService } from '../../../core/services/notification-hub.service';
import { NotificationDropdown } from '../notification-dropdown/notification-dropdown';
import { ClickOutsideDirective } from '../../directives/click-outside';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    NotificationDropdown,
    ClickOutsideDirective
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  // Search
  search = faMagnifyingGlass;

  // Top Right Icons
  bell = faBell;
  clock = faClockRotateLeft;
  message = faComment;

  authServ = inject(AuthenticationService);
  notificationHub = inject(NotificationHubService);
  readonly notifications =
    this.notificationHub.getNotifications();
  readonly unreadCount =
    this.notificationHub.getUnreadCount();
  badgeCount(): string {
    return this.unreadCount() > 99
      ? '99+'
      : this.unreadCount().toString();
  }
  // Buttons
  export = faFileExport;
  aiScan = faChartColumn;
  image = computed(() => this.authServ.userImage());

  isRealImage: boolean = false;

  role: string = '';
  userName: string = '';
  constructor() {
    const decoded = jwtDecode(this.authServ.getAccessToken() || '') as any;

    this.role = this.authServ.getUserRole() || '';
    this.userName =
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

    if (this.image() === 'https://smartmedicalsystem.runasp.net/') {
      this.isRealImage = false;
    } else {
      this.isRealImage = true;
    }

  }


  bars = faBars;
  @Output() toggleSidebar = new EventEmitter();

  openSidebar(): void {
    this.toggleSidebar.emit();
  }

  isNotificationOpen = signal(false);
  toggleNotifications(): void {
    this.isNotificationOpen.update(value => !value);
  }

  closeNotifications(): void {
    this.isNotificationOpen.set(false);
  }

}
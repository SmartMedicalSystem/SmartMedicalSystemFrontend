import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, output, Output, signal } from '@angular/core';
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
import { AuthenticationService } from '../../../core/services/authenticationService';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
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

  // Buttons
  export = faFileExport;
  aiScan = faChartColumn;
  image = this.authServ.userImageSignal;

  role: string = '';
  userName: string = '';
  constructor() {
    const decoded = jwtDecode(this.authServ.getAccessToken() || '') as any;

    this.role = this.authServ.getUserRole() || '';
    this.userName =
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

    if (!this.authServ.getUserImage()) {
      this.authServ.setUserImage(
        'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png'
      );
    }
  }




  bars = faBars;
  @Output() toggleSidebar = new EventEmitter();

  openSidebar(): void {
    this.toggleSidebar.emit();
  }

}
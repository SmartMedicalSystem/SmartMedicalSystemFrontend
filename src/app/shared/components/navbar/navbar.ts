import { CommonModule } from '@angular/common';
import { Component, EventEmitter, output, Output } from '@angular/core';
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

  // Buttons
  export = faFileExport;
  aiScan = faChartColumn;

  role: string = '';
  userName: string = '';
  constructor(private authServ: AuthenticationService) {
    const decoded = jwtDecode(this.authServ.getAccessToken() || '') as any;
    this.role = this.authServ.getUserRole() || '';
    this.userName = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  }



  bars = faBars;
  @Output() toggleSidebar = new EventEmitter();

  openSidebar(): void {
    this.toggleSidebar.emit();
  }

}
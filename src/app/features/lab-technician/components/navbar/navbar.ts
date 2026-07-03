import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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

  // User Data
  user = {
    name: 'Dr. Sarah Miller',
    role: 'Senior Lab Technician',
    image: 'https://i.pravatar.cc/150?img=47'
  };

  bars = faBars;
  @Output() toggleSidebar = new EventEmitter();

  openSidebar(): void {
    this.toggleSidebar.emit();
  }

}
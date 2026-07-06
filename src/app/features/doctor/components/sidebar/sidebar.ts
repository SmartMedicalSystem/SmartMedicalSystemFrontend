import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { faArrowRightFromBracket, faBuilding, faCircleQuestion, faFlask, faFolderOpen, faGaugeHigh, faGear, faHospital, faUserDoctor, faUsersGear } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  dashboard = faGaugeHigh;
  patients = faFolderOpen;
  doctors = faUserDoctor;
  departments = faBuilding;
  laboratories = faFlask;
  labTech = faUsersGear;
  hospital = faHospital;
  settings = faGear;
  logout = faArrowRightFromBracket;


  @Input() isOpen = false;
  @Output() close = new EventEmitter();
  closeSidebar(): void {
    this.close.emit();
  }


}
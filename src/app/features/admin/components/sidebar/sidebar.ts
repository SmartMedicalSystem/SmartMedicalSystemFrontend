import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faFlask,
  faStethoscope,
  faFolderOpen,
  faUserShield,
  faPlus,
  faGear,
  faCircleQuestion,
  faHospital,
  faBars,
  faXmark,
  faHome
} from '@fortawesome/free-solid-svg-icons';

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
  home = faHome
  hospital = faHospital;
  diagnostics = faStethoscope;
  laboratory = faFlask;
  patient = faFolderOpen;
  admin = faUserShield;
  plus = faPlus;
  settings = faGear;
  support = faCircleQuestion;


  @Input() isOpen = false;
  @Output() close = new EventEmitter();
  closeSidebar(): void {
    this.close.emit();
  }


}
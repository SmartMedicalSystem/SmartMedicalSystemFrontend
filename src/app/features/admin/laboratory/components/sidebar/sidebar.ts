import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faHospital,
  faFlask,
  faStethoscope,
  faFolderOpen,
  faUserShield,
  faPlus,
  faGear,
  faCircleQuestion
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
export class SidebarComponent {

  @Input() isOpen = false;

  hospital = faHospital;
  diagnostics = faStethoscope;
  laboratory = faFlask;
  patient = faFolderOpen;
  admin = faUserShield;
  plus = faPlus;
  settings = faGear;
  support = faCircleQuestion;

}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faFileExport,
  faMicrochip
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './dashboard-header.html',
  styleUrl: './dashboard-header.css'
})
export class DashboardHeader {

  exportIcon = faFileExport;
  aiIcon = faMicrochip;

}
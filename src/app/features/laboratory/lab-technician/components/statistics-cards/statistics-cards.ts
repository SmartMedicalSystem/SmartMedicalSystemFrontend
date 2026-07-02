import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faClipboardList,
  faCheckCircle,
  faCalendarDays
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-statistics-cards',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './statistics-cards.html',
  styleUrl: './statistics-cards.css'
})
export class StatisticsCards {

  clipboard = faClipboardList;
  check = faCheckCircle;
  calendar = faCalendarDays;

}
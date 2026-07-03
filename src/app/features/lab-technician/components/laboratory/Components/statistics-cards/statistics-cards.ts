import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  faClipboardList,
  faCheckCircle,
  faCalendarDays
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-statistics-cards',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './statistics-cards.html',
  styleUrl: './statistics-cards.css'
})
export class StatisticsCards {

  clipboard = faClipboardList;
  check = faCheckCircle;
  calendar = faCalendarDays;

}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  faClipboardList,
  faCheckCircle,
  faCalendarDays,
  faPen,
  faPlus,
  faSign,
  faCircle,
  faCircleCheck,
  faFlask
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule, FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-statistics-cards',
  standalone: true,
  imports: [
    CommonModule,
    FaIconComponent
  ],
  templateUrl: './statistics-cards.html',
  styleUrl: './statistics-cards.css'
})
export class StatisticsCards {

  clipboard = faClipboardList;
  check = faCheckCircle;
  calendar = faCalendarDays;
  pending = faPlus;
  circleCheck = faCircleCheck;
  flask = faFlask
}
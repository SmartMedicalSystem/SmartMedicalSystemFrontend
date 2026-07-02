import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBell,
  faTemperatureHalf,
  faFlask,
  faUsers,
  faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css'
})
export class Alerts {
  faBell = faBell;
  faTemperatureHalf = faTemperatureHalf;
  faFlask = faFlask;
  faUsers = faUsers;
  faEllipsisVertical = faEllipsisVertical;

  alerts = [
    {
      icon: this.faTemperatureHalf,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
      title: 'Storage Room A Temperature',
      description: 'Slight fluctuation detected (4.2°C).',
      description2: 'AI monitoring active.',
      time: '2 MINS AGO'
    },
    {
      icon: this.faFlask,
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      title: 'Automated QC Passed',
      description: 'Beckman Coulter DX-800 daily quality check verified by MediAI.',
      description2: '',
      time: '1 HOUR AGO'
    },
    {
      icon: this.faUsers,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Shift Handover Note',
      description: `Dr. Patel: "Wait for calibration on Unit 2 before running STAT bloods."`,
      description2: '',
      time: '3 HOURS AGO'
    }
  ];
}
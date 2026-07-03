import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowRight,
  faChevronDown,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-processing-queue',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './processing-queue.html',
  styleUrl: './processing-queue.css'
})
export class ProcessingQueue {

  queueIcon = faClipboardList;
  arrowDown = faChevronDown;
  arrowRight = faArrowRight;

  samples = signal([
    {
      id: '#SMP-9021',
      patient: 'Robert Chen',
      test: 'CBC w/ AI\nHemogram',
      priority: 'Critical',
      timer: '04:12',
      action: 'Process',
      color: 'red'
    },
    {
      id: '#SMP-8832',
      patient: 'Sarah\nJenkins',
      test: 'Lipid Panel',
      priority: 'Standard',
      timer: '12:45',
      action: 'Start',
      color: 'blue'
    },
    {
      id: '#SMP-8833',
      patient: 'Marcus\nMiller',
      test: 'T4-TSH\nScreen',
      priority: 'Standard',
      timer: '22:10',
      action: 'Start',
      color: 'blue'
    },
    {
      id: '#SMP-8834',
      patient: 'Elena\nRodriguez',
      test: 'Liver Enzymes',
      priority: 'Routine',
      timer: '45:00',
      action: 'Start',
      color: 'green'
    }
  ]);

}
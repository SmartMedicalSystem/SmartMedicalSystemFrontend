import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Report {
  initials: string;
  name: string;
  id: string;
  study: string;
  status: 'Critical' | 'Stable' | 'Moderate';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  pendingReviews = 12;

  approvedToday = 28;

  accuracy = 94.2;

  reports: Report[] = [
    {
      initials: 'JD',
      name: 'John Doe',
      id: '#883291-A',
      study: 'Chest X-Ray',
      status: 'Critical'
    },
    {
      initials: 'MS',
      name: 'Maria Santos',
      id: '#883302-B',
      study: 'Abdominal CT',
      status: 'Stable'
    },
    {
      initials: 'RB',
      name: 'Robert Brown',
      id: '#883315-C',
      study: 'Brain MRI',
      status: 'Moderate'
    }
  ];

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recent-submissions',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './recent-submissions.html',
  styleUrl: './recent-submissions.css'
})
export class RecentSubmissions {
  faEllipsisVertical = faEllipsisVertical;

  submissions = [
    {
      sampleId: '#SMP-8710',
      testName: 'Urinalysis',
      patient: 'Thompson, G.',
      status: 'DRAFT',
      statusClass: 'bg-gray-100 text-gray-600'
    },
    {
      sampleId: '#SMP-8705',
      testName: 'Strep Screen',
      patient: 'Wu, L.',
      status: 'SENT FOR REVIEW',
      statusClass: 'bg-cyan-100 text-cyan-700'
    },
    {
      sampleId: '#SMP-8698',
      testName: 'BMP',
      patient: 'Davis, K.',
      status: 'SENT FOR REVIEW',
      statusClass: 'bg-cyan-100 text-cyan-700'
    }
  ];
}
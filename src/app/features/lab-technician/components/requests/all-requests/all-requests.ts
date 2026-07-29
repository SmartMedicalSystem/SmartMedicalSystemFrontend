import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequestLabsService } from '../../../core/services/request-labs-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './all-requests.html',
  styleUrls: ['./all-requests.css']
})
export class AllRequests {

  requests: any[] = [

    {
      patient: 'John Smith',
      age: 'Male, 45 Years',
      ssn: '123-45-6789',
      test: 'Complete Blood Count',
      department: 'Hematology',
      doctor: 'Dr. Sarah Miller',
      speciality: 'Internal Medicine',
      priority: 'Emergency',
      date: '2026-07-05',
      status: 'Pending',
      action: 'Start Test',
      image: 'https://i.pravatar.cc/100?img=1'
    },

    {
      patient: 'Emily Johnson',
      age: 'Female, 32 Years',
      ssn: '234-56-7890',
      test: 'Lipid Profile',
      department: 'Chemistry',
      doctor: 'Dr. James Wilson',
      speciality: 'Cardiology',
      priority: 'Urgent',
      date: '2026-07-05',
      status: 'In Progress',
      action: 'Continue',
      image: 'https://i.pravatar.cc/100?img=5'
    },

    {
      patient: 'Michael Brown',
      age: 'Male, 51 Years',
      ssn: '345-67-8901',
      test: 'Liver Function',
      department: 'Chemistry',
      doctor: 'Dr. Linda White',
      speciality: 'Gastroenterology',
      priority: 'Routine',
      date: '2026-07-04',
      status: 'Completed',
      action: 'Start Test',
      image: 'https://i.pravatar.cc/100?img=12'
    },

    {
      patient: 'Sophia Davis',
      age: 'Female, 29 Years',
      ssn: '456-78-9012',
      test: 'Urine Analysis',
      department: 'Microbiology',
      doctor: 'Dr. Ahmed Hassan',
      speciality: 'General Medicine',
      priority: 'Routine',
      date: '2026-07-04',
      status: 'Pending',
      action: 'Start Test',
      image: 'https://i.pravatar.cc/100?img=20'
    },

    {
      patient: 'David Wilson',
      age: 'Male, 60 Years',
      ssn: '567-89-0123',
      test: 'Blood Glucose',
      department: 'Chemistry',
      doctor: 'Dr. Nancy Green',
      speciality: 'Endocrinology',
      priority: 'Urgent',
      date: '2026-07-03',
      status: 'Completed',
      action: 'Start Test',
      image: 'https://i.pravatar.cc/100?img=15'
    },

    {
      patient: 'Olivia Martin',
      age: 'Female, 38 Years',
      ssn: '678-90-1234',
      test: 'Kidney Function',
      department: 'Chemistry',
      doctor: 'Dr. Robert Lee',
      speciality: 'Nephrology',
      priority: 'Emergency',
      date: '2026-07-03',
      status: 'Pending',
      action: 'Start Test',
      image: 'https://i.pravatar.cc/100?img=30'
    }

  ];

  constructor(private requestLabsService: RequestLabsService) {
    this.LoadRequestLabs();
  }

  LoadRequestLabs(): void {

    this.requestLabsService.RequestLabsTable().subscribe({

      next: (res: any) => {

        console.log('Request Labs:', res);

        // استبدال البيانات التجريبية ببيانات الـ API
        this.requests = res.items;

      },

      error: (err: any) => {

        console.error('Failed to load requests', err);

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err?.error?.message || err?.error?.Message || 'Failed to Load Requests'
        });

      }

    });

  }

}

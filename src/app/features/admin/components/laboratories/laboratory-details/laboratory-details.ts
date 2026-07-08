import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface LabTest {
  testId: number;
  testType: string;
  patientName: string;
  status: 'pending' | 'done';
  testDate: Date;
}

interface Laboratory {
  labId: number;
  name: string;
  location: string;
  phone: string;
  headTechnicianId: number | null;
  headTechnicianName: string;
  departmentId: number | null;
  departmentName: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
  totalTests: number;
  staffCount: number;
  createdAt: Date;
  tests: LabTest[];
}

@Component({
  selector: 'app-laboratory-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './laboratory-details.html',
  styleUrls: ['./laboratory-details.css'],
})
export class LaboratoryDetails implements OnInit {
  labId: string | null = null;

  // Mock Laboratory Data
  laboratory: Laboratory = {
    labId: 1,
    name: 'North Wing Pathology',
    location: 'Building A, Wing 4',
    phone: '+1-555-0101',
    headTechnicianId: 1,
    headTechnicianName: 'Sarah Johnson',
    departmentId: 1,
    departmentName: 'Hematology',
    status: 'Active',
    totalTests: 1420,
    staffCount: 12,
    createdAt: new Date('2021-06-15'),
    tests: [
      {
        testId: 101,
        testType: 'CBC',
        patientName: 'John Doe',
        status: 'done',
        testDate: new Date('2024-07-04'),
      },
      {
        testId: 102,
        testType: 'Lipid Panel',
        patientName: 'Maria Santos',
        status: 'pending',
        testDate: new Date('2024-07-05'),
      },
      {
        testId: 103,
        testType: 'Liver Function',
        patientName: 'Robert Brown',
        status: 'done',
        testDate: new Date('2024-07-03'),
      },
      {
        testId: 104,
        testType: 'Urinalysis',
        patientName: 'Elena Rodriguez',
        status: 'pending',
        testDate: new Date('2024-07-05'),
      },
    ],
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.labId = this.route.snapshot.paramMap.get('id');
    console.log('Viewing laboratory ID:', this.labId);
    // TODO: Fetch laboratory by ID from API
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Inactive':
        return 'bg-gray-100 text-gray-600';
      case 'Maintenance':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getStatusDotClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-green-600';
      case 'Inactive':
        return 'bg-gray-400';
      case 'Maintenance':
        return 'bg-amber-600';
      default:
        return 'bg-gray-400';
    }
  }

  getTestStatusClass(status: string): string {
    return status === 'done' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-600';
  }
}

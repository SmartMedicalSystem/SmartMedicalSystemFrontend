import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface Doctor {
  doctorId: number;
  name: string;
  specialization: string;
  licenseNumber: string;
}

interface Department {
  departmentId: number;
  name: string;
  floorNumber: number | null;
  headDoctorId: number | null;
  headDoctorName: string;
  phoneExt: string;
  doctorCount: number;
  createdAt: Date;
  status: 'Active' | 'Inactive' | 'Maintenance';
  doctors: Doctor[];
}

@Component({
  selector: 'app-department-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './department-details.html',
  styleUrls: ['./department-details.css'],
})
export class DepartmentDetails implements OnInit {
  departmentId: string | null = null;

  // Mock Department Data
  department: Department = {
    departmentId: 1,
    name: 'Cardiology Unit',
    floorNumber: 3,
    headDoctorId: 1,
    headDoctorName: 'Dr. Elena Rodriguez',
    phoneExt: '101',
    doctorCount: 24,
    createdAt: new Date('2022-01-12'),
    status: 'Active',
    doctors: [
      {
        doctorId: 1,
        name: 'Dr. Elena Rodriguez',
        specialization: 'Interventional Cardiology',
        licenseNumber: 'LIC-001',
      },
      {
        doctorId: 2,
        name: 'Dr. James Wilson',
        specialization: 'Cardiac Electrophysiology',
        licenseNumber: 'LIC-002',
      },
      {
        doctorId: 3,
        name: 'Dr. Maria Santos',
        specialization: 'Heart Failure',
        licenseNumber: 'LIC-003',
      },
      {
        doctorId: 4,
        name: 'Dr. Robert Brown',
        specialization: 'Preventive Cardiology',
        licenseNumber: 'LIC-004',
      },
    ],
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.departmentId = this.route.snapshot.paramMap.get('id');
    console.log('Viewing department ID:', this.departmentId);
    // TODO: Fetch department by ID from API
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
}

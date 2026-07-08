import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Doctor {
  doctorId: number;
  name: string;
}

interface Department {
  departmentId: number;
  name: string;
  floorNumber: number | null;
  headDoctorId: number | null;
  phoneExt: string;
  createdAt: Date;
  doctorCount: number;
}

@Component({
  selector: 'app-edit-departments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './edit-departments.html',
  styleUrls: ['./edit-departments.css'],
})
export class EditDepartments implements OnInit {
  departmentId: string | null = null;

  // Mock Doctors
  doctors: Doctor[] = [
    { doctorId: 1, name: 'Dr. Elena Rodriguez' },
    { doctorId: 2, name: 'Dr. Simon Kestner' },
    { doctorId: 3, name: 'Dr. Sarah Chen' },
    { doctorId: 4, name: 'Dr. Marcus Thorne' },
    { doctorId: 5, name: 'Dr. Linda Grey' },
  ];

  // Department Data (Mock)
  department: Department = {
    departmentId: 1,
    name: 'Cardiology Unit',
    floorNumber: 3,
    headDoctorId: 1,
    phoneExt: '101',
    createdAt: new Date('2022-01-12'),
    doctorCount: 24,
  };

  // Backup for reset
  originalDepartment!: Department;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.departmentId = this.route.snapshot.paramMap.get('id');
    console.log('Editing department ID:', this.departmentId);

    // Save original for reset
    this.originalDepartment = { ...this.department };

    // TODO: Fetch department by ID from API
    // this.departmentService.getDepartment(this.departmentId).subscribe(...)
  }

  getHeadDoctorName(): string {
    const doctor = this.doctors.find((d) => d.doctorId === this.department.headDoctorId);
    return doctor ? doctor.name : 'Not Assigned';
  }

  onSubmit() {
    console.log('Department Updated:', this.department);
    // TODO: Call API
    // PUT /api/departments/{id}
  }

  onReset() {
    this.department = { ...this.originalDepartment };
  }
}

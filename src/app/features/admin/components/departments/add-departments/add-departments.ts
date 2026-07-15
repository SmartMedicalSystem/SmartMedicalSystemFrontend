import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

// Mock Doctors for dropdown
interface Doctor {
  doctorId: number;
  name: string;
}

@Component({
  selector: 'app-add-departments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './add-departments.html',
  styleUrls: ['./add-departments.css'],
})
export class AddDepartments {
  // Mock Doctors
  doctors: Doctor[] = [
    { doctorId: 1, name: 'Dr. Elena Rodriguez' },
    { doctorId: 2, name: 'Dr. Simon Kestner' },
    { doctorId: 3, name: 'Dr. Sarah Chen' },
    { doctorId: 4, name: 'Dr. Marcus Thorne' },
    { doctorId: 5, name: 'Dr. Linda Grey' },
  ];

  department = {
    name: '',
    floorNumber: null as number | null,
    headDoctorId: null as number | null,
    phoneExt: '',
    status: '',
  };
  statuses = ['Active', 'Inactive', 'Maintenance'];
  onSubmit() {
    console.log('Department Created:', this.department);
    // TODO: Call API
    // POST /api/departments
    // {
    //   name: this.department.name,
    //   floorNumber: this.department.floorNumber,
    //   headDoctorId: this.department.headDoctorId,
    //   phoneExt: this.department.phoneExt
    // }
  }

  onReset() {
    this.department = {
      name: '',
      floorNumber: null,
      headDoctorId: null,
      phoneExt: '',
      status: '',
    };
  }
}

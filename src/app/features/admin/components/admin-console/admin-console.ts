import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// ============ Interfaces ============
export interface User {
  userId: number;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'lab';
  createdAt: Date;
}

export interface Patient {
  patientId: number;
  name: string;
  bloodType: string;
  dateOfBirth: Date;
  chronicConditions: string;
  allergies: string;
  insuranceNumber: string;
}

export interface Doctor {
  doctorId: number;
  name: string;
  department: string;
  specialization: string;
  licenseNumber: string;
  yearsExperience: number;
}

export interface LabTechnician {
  technicianId: number;
  name: string;
  labType: string;
  shift: string;
  certification: string;
}

export interface Department {
  departmentId: number;
  name: string;
  floorNumber: number;
  headDoctor: string;
  phoneExt: string;
}

export interface LabTest {
  testId: number;
  patientName: string;
  testType: string;
  technicianName: string;
  status: 'pending' | 'done';
  testDate: Date;
}

export interface AIReport {
  reportId: number;
  patientName: string;
  testType: string;
  confidenceScore: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  generatedAt: Date;
}

// ============ Component ============
@Component({
  selector: 'app-admin-console',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
  ],
  templateUrl: './admin-console.html',
  styleUrls: ['./admin-console.css'],
})
export class AdminConsole {
  // ====== Stats ======
  stats = [
    { label: 'Total Users', value: 1284, icon: 'people', change: '+12%' },
    { label: 'Total Patients', value: 12482, icon: 'person', change: '+8%' },
    { label: 'Total Doctors', value: 156, icon: 'medical_services', change: '+5%' },
    { label: 'Lab Technicians', value: 42, icon: 'science', change: '+3%' },
    { label: 'Departments', value: 12, icon: 'business', change: '0%' },
    { label: 'Lab Tests', value: 1420, icon: 'biotech', change: '+18%' },
    { label: 'Pending AI Reports', value: 24, icon: 'pending_actions', change: '-2%' },
    { label: 'Total AI Reports', value: 892, icon: 'auto_awesome', change: '+15%' },
  ];

  // ====== Users Data ======
  users: User[] = [
    {
      userId: 1,
      name: 'John Doe',
      email: 'john@email.com',
      role: 'patient',
      createdAt: new Date('2024-01-15'),
    },
    {
      userId: 2,
      name: 'Dr. Sarah Smith',
      email: 'sarah@email.com',
      role: 'doctor',
      createdAt: new Date('2023-06-20'),
    },
    {
      userId: 3,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      role: 'lab',
      createdAt: new Date('2024-02-10'),
    },
    {
      userId: 4,
      name: 'Michael Chen',
      email: 'michael@email.com',
      role: 'lab',
      createdAt: new Date('2024-03-05'),
    },
    {
      userId: 5,
      name: 'Dr. Robert Miller',
      email: 'robert@email.com',
      role: 'doctor',
      createdAt: new Date('2023-11-01'),
    },
  ];

  // ====== Patients Data ======
  patients: Patient[] = [
    {
      patientId: 1,
      name: 'John Doe',
      bloodType: 'A+',
      dateOfBirth: new Date('1985-03-12'),
      chronicConditions: 'Diabetes',
      allergies: 'None',
      insuranceNumber: 'INS-001',
    },
    {
      patientId: 2,
      name: 'Maria Santos',
      bloodType: 'B-',
      dateOfBirth: new Date('1992-07-18'),
      chronicConditions: 'None',
      allergies: 'Penicillin',
      insuranceNumber: 'INS-002',
    },
    {
      patientId: 3,
      name: 'Robert Brown',
      bloodType: 'O+',
      dateOfBirth: new Date('1978-11-29'),
      chronicConditions: 'Hypertension',
      allergies: 'None',
      insuranceNumber: 'INS-003',
    },
    {
      patientId: 4,
      name: 'Elena Rodriguez',
      bloodType: 'AB+',
      dateOfBirth: new Date('1995-01-22'),
      chronicConditions: 'Asthma',
      allergies: 'Dust',
      insuranceNumber: 'INS-004',
    },
  ];

  // ====== Doctors Data ======
  doctors: Doctor[] = [
    {
      doctorId: 1,
      name: 'Dr. Sarah Smith',
      department: 'Cardiology',
      specialization: 'Interventional Cardiology',
      licenseNumber: 'LIC-001',
      yearsExperience: 15,
    },
    {
      doctorId: 2,
      name: 'Dr. Robert Miller',
      department: 'Neurology',
      specialization: 'Stroke',
      licenseNumber: 'LIC-002',
      yearsExperience: 12,
    },
    {
      doctorId: 3,
      name: 'Dr. Emily Davis',
      department: 'Internal Medicine',
      specialization: 'Endocrinology',
      licenseNumber: 'LIC-003',
      yearsExperience: 8,
    },
  ];

  // ====== Lab Technicians Data ======
  labTechnicians: LabTechnician[] = [
    {
      technicianId: 1,
      name: 'Sarah Johnson',
      labType: 'Microbiology',
      shift: 'Morning B-2',
      certification: 'ASCP',
    },
    {
      technicianId: 2,
      name: 'Michael Chen',
      labType: 'CBC',
      shift: 'Morning A-1',
      certification: 'MLT',
    },
    {
      technicianId: 3,
      name: 'Patricia Williams',
      labType: 'Microbiology',
      shift: 'Evening C-3',
      certification: 'ASCP',
    },
    {
      technicianId: 4,
      name: 'David Rodriguez',
      labType: 'CBC',
      shift: 'Morning B-2',
      certification: 'MLT',
    },
  ];

  // ====== Departments Data ======
  departments: Department[] = [
    {
      departmentId: 1,
      name: 'Cardiology',
      floorNumber: 3,
      headDoctor: 'Dr. Sarah Smith',
      phoneExt: '101',
    },
    {
      departmentId: 2,
      name: 'Neurology',
      floorNumber: 4,
      headDoctor: 'Dr. Robert Miller',
      phoneExt: '102',
    },
    {
      departmentId: 3,
      name: 'Internal Medicine',
      floorNumber: 2,
      headDoctor: 'Dr. Emily Davis',
      phoneExt: '103',
    },
    {
      departmentId: 4,
      name: 'Pediatrics',
      floorNumber: 1,
      headDoctor: 'Dr. John Adams',
      phoneExt: '104',
    },
  ];

  // ====== Lab Tests Data ======
  labTests: LabTest[] = [
    {
      testId: 101,
      patientName: 'John Doe',
      testType: 'CBC',
      technicianName: 'Sarah Johnson',
      status: 'done',
      testDate: new Date('2024-07-04'),
    },
    {
      testId: 102,
      patientName: 'Maria Santos',
      testType: 'Lipid Panel',
      technicianName: 'Michael Chen',
      status: 'pending',
      testDate: new Date('2024-07-05'),
    },
    {
      testId: 103,
      patientName: 'Robert Brown',
      testType: 'Liver Function',
      technicianName: 'Sarah Johnson',
      status: 'done',
      testDate: new Date('2024-07-03'),
    },
    {
      testId: 104,
      patientName: 'Elena Rodriguez',
      testType: 'Urinalysis',
      technicianName: 'David Rodriguez',
      status: 'pending',
      testDate: new Date('2024-07-05'),
    },
  ];

  // ====== AI Reports Data ======
  aiReports: AIReport[] = [
    {
      reportId: 201,
      patientName: 'John Doe',
      testType: 'CBC',
      confidenceScore: 94.2,
      status: 'Approved',
      generatedAt: new Date('2024-07-04'),
    },
    {
      reportId: 202,
      patientName: 'Maria Santos',
      testType: 'Lipid Panel',
      confidenceScore: 88.5,
      status: 'Pending',
      generatedAt: new Date('2024-07-05'),
    },
    {
      reportId: 203,
      patientName: 'Robert Brown',
      testType: 'Liver Function',
      confidenceScore: 91.7,
      status: 'Rejected',
      generatedAt: new Date('2024-07-03'),
    },
    {
      reportId: 204,
      patientName: 'Elena Rodriguez',
      testType: 'Urinalysis',
      confidenceScore: 76.3,
      status: 'Pending',
      generatedAt: new Date('2024-07-05'),
    },
  ];

  // ====== Table Columns ======
  userColumns: string[] = ['userId', 'name', 'email', 'role', 'createdAt', 'actions'];
  patientColumns: string[] = [
    'patientId',
    'name',
    'bloodType',
    'dateOfBirth',
    'chronicConditions',
    'allergies',
    'actions',
  ];
  doctorColumns: string[] = [
    'doctorId',
    'name',
    'department',
    'specialization',
    'licenseNumber',
    'yearsExperience',
    'actions',
  ];
  technicianColumns: string[] = [
    'technicianId',
    'name',
    'labType',
    'shift',
    'certification',
    'actions',
  ];
  departmentColumns: string[] = [
    'departmentId',
    'name',
    'floorNumber',
    'headDoctor',
    'phoneExt',
    'actions',
  ];
  labTestColumns: string[] = [
    'testId',
    'patientName',
    'testType',
    'technicianName',
    'status',
    'testDate',
    'actions',
  ];
  aiReportColumns: string[] = [
    'reportId',
    'patientName',
    'testType',
    'confidenceScore',
    'status',
    'generatedAt',
    'actions',
  ];
}

import { DatePipe, NgClass, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface LabTest {
  testId: number;
  patientName: string;
  testType: string;
  status: 'pending' | 'done';
  technicianName: string;
  testDate: Date;
}

export interface AIReport {
  reportId: number;
  patientName: string;
  testType: string;
  confidenceScore: number;
  generatedAt: Date;
}

export interface Patient {
  patientId: number;
  name: string;
  bloodType: string;
  chronicConditions: string;
  allergies: string;
}

@Component({
  selector: 'app-admin-console',
  standalone: true,
  imports: [NgStyle, DatePipe, NgClass, MatIconModule],
  templateUrl: './admin-console.html',
  styleUrls: ['./admin-console.css'],
})
export class AdminConsole {
  // Stats
  stats = [
    { label: 'Total Tests', value: 1284, icon: 'science', change: '+12%' },
    { label: 'Pending Tests', value: 24, icon: 'pending_actions', change: '-3%' },
    { label: 'Completed Tests', value: 1260, icon: 'check_circle', change: '+8%' },
    { label: 'AI Reports', value: 892, icon: 'auto_awesome', change: '+15%' },
  ];

  // Lab Tests Data
  labTests: LabTest[] = [
    {
      testId: 101,
      patientName: 'John Doe',
      testType: 'CBC',
      status: 'done',
      technicianName: 'Sarah Johnson',
      testDate: new Date('2024-07-04'),
    },
    {
      testId: 102,
      patientName: 'Maria Santos',
      testType: 'Lipid Panel',
      status: 'pending',
      technicianName: 'Michael Chen',
      testDate: new Date('2024-07-05'),
    },
    {
      testId: 103,
      patientName: 'Robert Brown',
      testType: 'Liver Function',
      status: 'done',
      technicianName: 'Sarah Johnson',
      testDate: new Date('2024-07-03'),
    },
    {
      testId: 104,
      patientName: 'Elena Rodriguez',
      testType: 'Urinalysis',
      status: 'pending',
      technicianName: 'David Rodriguez',
      testDate: new Date('2024-07-05'),
    },
  ];

  // AI Reports Data
  aiReports: AIReport[] = [
    {
      reportId: 201,
      patientName: 'John Doe',
      testType: 'CBC',
      confidenceScore: 94.2,
      generatedAt: new Date('2024-07-04'),
    },
    {
      reportId: 202,
      patientName: 'Maria Santos',
      testType: 'Lipid Panel',
      confidenceScore: 88.5,
      generatedAt: new Date('2024-07-05'),
    },
    {
      reportId: 203,
      patientName: 'Robert Brown',
      testType: 'Liver Function',
      confidenceScore: 91.7,
      generatedAt: new Date('2024-07-03'),
    },
  ];

  // Patients Data
  patients: Patient[] = [
    {
      patientId: 1,
      name: 'John Doe',
      bloodType: 'A+',
      chronicConditions: 'Diabetes',
      allergies: 'None',
    },
    {
      patientId: 2,
      name: 'Maria Santos',
      bloodType: 'B-',
      chronicConditions: 'None',
      allergies: 'Penicillin',
    },
    {
      patientId: 3,
      name: 'Robert Brown',
      bloodType: 'O+',
      chronicConditions: 'Hypertension',
      allergies: 'None',
    },
  ];

  // Table Columns
  labTestColumns: string[] = [
    'testId',
    'patientName',
    'testType',
    'status',
    'technicianName',
    'testDate',
    'actions',
  ];
  aiReportColumns: string[] = [
    'reportId',
    'patientName',
    'testType',
    'confidenceScore',
    'generatedAt',
    'actions',
  ];
  patientColumns: string[] = [
    'patientId',
    'name',
    'bloodType',
    'chronicConditions',
    'allergies',
    'actions',
  ];
}

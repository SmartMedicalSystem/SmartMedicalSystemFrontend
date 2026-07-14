import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  contact: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: number;
  address: string;
  gender: number;
  nationalId: number;
  departmentId: number;
  departmentName: string;
}

@Component({
  selector: 'app-all-doctors',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './all-doctors.html',
  styleUrl: './all-doctors.css',
})
export class AllDoctors {

  // ================= Filters =================

  departmentFilter = signal<string>('All Departments');
  specializationFilter = signal<string>('All Specializations');
  joiningDateFilter = signal<string>('');
  searchTerm = signal<string>('');

  // ================= Pagination =================

  rowsPerPage = signal<number>(10);
  currentPage = signal<number>(1);
  totalDoctors = signal<number>(0);

  // ================= Data =================

  doctors = signal<Doctor[]>([
    {
      id: 1,
      name: 'Dr. Sarah Jenkins',
      specialization: 'Neurosurgeon',
      contact: '+1 (555) 012-9928',
      dateOfBirth: '1985-05-10',
      email: 'jenkins@medai.sys',
      mobileNumber: 15550129928,
      address: 'Boston',
      gender: 1,
      nationalId: 12345678901234,
      departmentId: 1,
      departmentName: 'Neurology',
    },
    {
      id: 2,
      name: 'Dr. Robert Chen',
      specialization: 'Cardiologist',
      contact: '+1 (555) 010-3321',
      dateOfBirth: '1982-09-20',
      email: 'chen@medai.sys',
      mobileNumber: 15550103321,
      address: 'New York',
      gender: 1,
      nationalId: 23456789012345,
      departmentId: 2,
      departmentName: 'Cardiology',
    },
    {
      id: 3,
      name: 'Dr. Marcus Thorne',
      specialization: 'Pediatrician',
      contact: '+1 (555) 019-8832',
      dateOfBirth: '1988-02-15',
      email: 'm.thorne@medai.sys',
      mobileNumber: 15550198832,
      address: 'Chicago',
      gender: 1,
      nationalId: 34567890123456,
      departmentId: 3,
      departmentName: 'Pediatrics',
    },
    {
      id: 4,
      name: 'Dr. Elena Rodriguez',
      specialization: 'Oncologist',
      contact: '+1 (555) 018-7711',
      dateOfBirth: '1984-07-11',
      email: 'e.rod@medai.sys',
      mobileNumber: 15550187711,
      address: 'Los Angeles',
      gender: 0,
      nationalId: 45678901234567,
      departmentId: 4,
      departmentName: 'Oncology',
    },
  ]);

  // ================= Pagination Helpers =================

  rangeStart = () =>
    (this.currentPage() - 1) * this.rowsPerPage() + 1;

  rangeEnd = () =>
    Math.min(this.currentPage() * this.rowsPerPage(), this.totalDoctors());

  // ================= Actions =================

  activeMenuId = signal<number | null>(null);

  toggleMenu(id: number) {
    this.activeMenuId.set(this.activeMenuId() === id ? null : id);
  }

  applyFilters() {
    console.log({
      department: this.departmentFilter(),
      specialization: this.specializationFilter(),
      joiningDate: this.joiningDateFilter(),
      search: this.searchTerm(),
    });
  }

  resetFilters() {
    this.departmentFilter.set('All Departments');
    this.specializationFilter.set('All Specializations');
    this.joiningDateFilter.set('');
    this.searchTerm.set('');
  }
}
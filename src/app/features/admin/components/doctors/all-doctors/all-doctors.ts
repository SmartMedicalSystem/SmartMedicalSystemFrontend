import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  department: string;
  contact: string;
}

@Component({
  selector: 'app-all-doctors',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './all-doctors.html',
  styleUrl: './all-doctors.css',
})
export class AllDoctors {
  // ------- Filters -------
  departmentFilter = signal<string>('All Departments');
  specializationFilter = signal<string>('All Specializations');
  employmentStatusFilter = signal<string>('All Statuses');
  joiningDateFilter = signal<string>('');
  genderFilter = signal<string>('All Genders');
  searchTerm = signal<string>('');

  rowsPerPage = signal<number>(10);
  currentPage = signal<number>(1);
  totalDoctors = signal<number>(48);

  doctors = signal<Doctor[]>([
    {
      id: '1',
      name: 'Dr. Sarah Jenkins',
      email: 'jenkins@medai.sys',
      specialization: 'Neurosurgeon',
      department: 'Neurology',
      contact: '+1 (555) 012-9928',
    },
    {
      id: '2',
      name: 'Dr. Robert Chen',
      email: 'chen@medai.sys',
      specialization: 'Cardiologist',
      department: 'Cardiology',
      contact: '+1 (555) 010-3321',
    },
    {
      id: '3',
      name: 'Dr. Marcus Thorne',
      email: 'm.thorne@medai.sys',
      specialization: 'Pediatrician',
      department: 'Pediatrics',
      contact: '+1 (555) 019-8832',
    },
    {
      id: '4',
      name: 'Dr. Elena Rodriguez',
      email: 'e.rod@medai.sys',
      specialization: 'Oncologist',
      department: 'Oncology',
      contact: '+1 (555) 018-7711',
    },
  ]);

  rangeStart = () => (this.currentPage() - 1) * this.rowsPerPage() + 1;
  rangeEnd = () => Math.min(this.currentPage() * this.rowsPerPage(), this.totalDoctors());
  activeMenuId = signal<string | null>(null);

  toggleMenu(id: string) {
    this.activeMenuId.set(this.activeMenuId() === id ? null : id);
  }

  applyFilters() {
    console.log({
      department: this.departmentFilter(),
      specialization: this.specializationFilter(),
      employmentStatus: this.employmentStatusFilter(),
      joiningDate: this.joiningDateFilter(),
      gender: this.genderFilter(),
    });
  }

  resetFilters() {
    this.departmentFilter.set('All Departments');
    this.specializationFilter.set('All Specializations');
    this.employmentStatusFilter.set('All Statuses');
    this.joiningDateFilter.set('');
    this.genderFilter.set('All Genders');
  }
}

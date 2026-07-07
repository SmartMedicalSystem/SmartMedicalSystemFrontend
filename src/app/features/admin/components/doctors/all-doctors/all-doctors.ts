import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


export interface Doctor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  licenseId: string;
  specialization: string;
  department: string;
  contact: string;
}
 
@Component({
  selector: 'app-all-doctors',
  imports: [RouterLink ,  CommonModule, FormsModule],
  templateUrl: './all-doctors.html',
  styleUrl: './all-doctors.css',
})
export class AllDoctors {
  // ------- Filters -------
  departmentFilter = signal<string>('All Departments');
  specializationFilter = signal<string>('All Specializations');
  employmentStatusFilter = signal<string>('All Statuses');
  minExperience = signal<string>('');
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
      avatar: 'https://i.pravatar.cc/40?img=47',
      licenseId: 'LIC-99283-X',
      specialization: 'Neurosurgeon',
      department: 'Neurology',
      contact: '+1 (555) 012-9928'
    },
    {
      id: '2',
      name: 'Dr. Robert Chen',
      email: 'chen@medai.sys',
      avatar: 'https://i.pravatar.cc/40?img=33',
      licenseId: 'LIC-11022-A',
      specialization: 'Cardiologist',
      department: 'Cardiology',
      contact: '+1 (555) 010-3321'
    },
    {
      id: '3',
      name: 'Dr. Marcus Thorne',
      email: 'm.thorne@medai.sys',
      avatar: 'https://i.pravatar.cc/40?img=12',
      licenseId: 'LIC-44589-M',
      specialization: 'Pediatrician',
      department: 'Pediatrics',
      contact: '+1 (555) 019-8832'
    },
    {
      id: '4',
      name: 'Dr. Elena Rodriguez',
      email: 'e.rod@medai.sys',
      avatar: 'https://i.pravatar.cc/40?img=48',
      licenseId: 'LIC-22100-B',
      specialization: 'Oncologist',
      department: 'Oncology',
      contact: '+1 (555) 018-7711'
    }
  ]);

  rangeStart = () => (this.currentPage() - 1) * this.rowsPerPage() + 1;
  rangeEnd = () => Math.min(this.currentPage() * this.rowsPerPage(), this.totalDoctors());

  applyFilters() {
    console.log({
      department: this.departmentFilter(),
      specialization: this.specializationFilter(),
      employmentStatus: this.employmentStatusFilter(),
      minExperience: this.minExperience(),
      joiningDate: this.joiningDateFilter(),
      gender: this.genderFilter()
    });
  }

  resetFilters() {
    this.departmentFilter.set('All Departments');
    this.specializationFilter.set('All Specializations');
    this.employmentStatusFilter.set('All Statuses');
    this.minExperience.set('');
    this.joiningDateFilter.set('');
    this.genderFilter.set('All Genders');
  }
}

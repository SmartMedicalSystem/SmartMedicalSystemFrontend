import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  Doctor,
  DoctorService,
} from '../../../../../core/services/doctor-service';

@Component({
  selector: 'app-all-doctors',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './all-doctors.html',
  styleUrl: './all-doctors.css',
})
export class AllDoctors implements OnInit {
  private doctorService = inject(DoctorService);

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

  allDoctors = signal<Doctor[]>([]);
  doctors = signal<Doctor[]>([]);

  // ================= Menu =================

  activeMenuId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService
      .getAllDoctors(this.currentPage(), this.rowsPerPage())
      .subscribe({
        next: (response) => {
          this.allDoctors.set(response.items);
          this.doctors.set(response.items);
          this.totalDoctors.set(response.items.length);
        },
        error: (err) => {
          console.error('Error loading doctors', err);
        },
      });
  }

  // ================= Pagination =================

  rangeStart = () =>
    this.totalDoctors() === 0
      ? 0
      : (this.currentPage() - 1) * this.rowsPerPage() + 1;

  rangeEnd = () =>
    Math.min(this.currentPage() * this.rowsPerPage(), this.totalDoctors());

  // ================= Actions =================

  toggleMenu(id: number) {
    this.activeMenuId.set(this.activeMenuId() === id ? null : id);
  }

  applyFilters(): void {
    let filtered = [...this.allDoctors()];

    // Search
    if (this.searchTerm().trim()) {
      const search = this.searchTerm().trim().toLowerCase();

      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(search) ||
          doctor.email.toLowerCase().includes(search)
      );
    }

    // Department
    if (this.departmentFilter() !== 'All Departments') {
      filtered = filtered.filter(
        (doctor) => doctor.departmentName === this.departmentFilter()
      );
    }

    // Specialization
    if (this.specializationFilter() !== 'All Specializations') {
      filtered = filtered.filter(
        (doctor) =>
          doctor.specialization === this.specializationFilter()
      );
    }

    this.doctors.set(filtered);
    this.totalDoctors.set(filtered.length);
  }

  resetFilters(): void {
    this.departmentFilter.set('All Departments');
    this.specializationFilter.set('All Specializations');
    this.joiningDateFilter.set('');
    this.searchTerm.set('');

    this.doctors.set(this.allDoctors());
    this.totalDoctors.set(this.allDoctors().length);
  }
}
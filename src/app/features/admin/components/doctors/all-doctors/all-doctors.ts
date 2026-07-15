import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Doctor, DoctorService } from '../../../../../core/services/doctor-service';

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
          this.doctors.set(response.items);
          this.totalDoctors.set(response.totalCount);
        },
        error: (err) => {
          console.error('Error loading doctors', err);
        },
      });
  }

  // ================= Pagination Helpers =================

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

  applyFilters() {
    console.log({
      department: this.departmentFilter(),
      specialization: this.specializationFilter(),
      joiningDate: this.joiningDateFilter(),
      search: this.searchTerm(),
    });

    // هنربط الفلاتر بعدين
  }

  resetFilters() {
    this.departmentFilter.set('All Departments');
    this.specializationFilter.set('All Specializations');
    this.joiningDateFilter.set('');
    this.searchTerm.set('');
  }
}
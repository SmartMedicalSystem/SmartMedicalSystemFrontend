import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Doctor } from '../../../../../shared/interfaces/Doctor/doctor.interface';
import {

  DoctorService,
} from '../../../../../core/services/doctor-service.service';
import { AlertService } from '../../../../../core/services/alert-service.service';

@Component({
  selector: 'app-all-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './all-doctors.html',
  styleUrl: './all-doctors.css',
})
export class AllDoctors implements OnInit {
  private doctorService = inject(DoctorService);
  private alertService = inject(AlertService);

  // ================= Data =================
  rawDoctors = signal<Doctor[]>([]);

  // ================= Pagination (من الباك) =================
  currentPage = signal(1);
  rowsPerPage = signal(10);
  totalDoctors = signal(0);
  totalPages = signal(0);
  hasNextPage = signal(false);
  hasPreviousPage = signal(false);

  // ================= Filters =================
  searchTerm = signal('');
  departmentFilter = signal('All Departments');
  specializationFilter = signal('');

  doctors = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const dept = this.departmentFilter();
    const spec = this.specializationFilter().trim().toLowerCase();

    return this.rawDoctors().filter((d) => {
      const matchesSearch =
        !term ||
        d.name.toLowerCase().includes(term) ||
        d.nationalId?.toLowerCase().includes(term);

      const matchesDept = dept === 'All Departments' || d.departmentName === dept;

      const matchesSpec = !spec || d.specialization.toLowerCase().includes(spec);

      return matchesSearch && matchesDept && matchesSpec;
    });
  });

  // ================= Menu =================
  activeMenuId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorService
      .getAllDoctorsY(this.currentPage(), this.rowsPerPage())
      .subscribe({
        next: (response) => {
          this.rawDoctors.set(response.items);
          this.totalDoctors.set(response.totalCount);
          this.totalPages.set(response.totalPages);
          this.hasNextPage.set(response.hasNextPage);
          this.hasPreviousPage.set(response.hasPreviousPage);
          this.activeMenuId.set(null);
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Failed to load doctors');
        },
      });
  }

  // ================= Pagination =================
  get rangeStart(): number {
    if (this.totalDoctors() === 0) return 0;
    return (this.currentPage() - 1) * this.rowsPerPage() + 1;
  }

  get rangeEnd(): number {
    const end = this.currentPage() * this.rowsPerPage();
    return end > this.totalDoctors() ? this.totalDoctors() : end;
  }

  goToFirstPage() {
    if (this.currentPage() === 1) return;
    this.currentPage.set(1);
    this.loadDoctors();
  }

  goToPreviousPage() {
    if (!this.hasPreviousPage()) return;
    this.currentPage.update((p) => p - 1);
    this.loadDoctors();
  }

  goToNextPage() {
    if (!this.hasNextPage()) return;
    this.currentPage.update((p) => p + 1);
    this.loadDoctors();
  }

  goToLastPage() {
    if (this.currentPage() === this.totalPages()) return;
    this.currentPage.set(this.totalPages());
    this.loadDoctors();
  }

  onRowsPerPageChange(value: number) {
    this.rowsPerPage.set(+value);
    this.currentPage.set(1);
    this.loadDoctors();
  }

  // ================= Menu =================
  toggleMenu(id: number) {
    this.activeMenuId.set(this.activeMenuId() === id ? null : id);
  }

  // ================= Filters =================
  applyFilters() {

  }
  onRefresh() {
    this.loadDoctors();
  }
  resetFilters() {
    this.searchTerm.set('');
    this.departmentFilter.set('All Departments');
    this.specializationFilter.set('All Specializations');
    this.currentPage.set(1);
    this.loadDoctors();
  }

  // ================= Delete =================
  deleteDoctor(doctor: Doctor) {
    this.alertService
      .confirm(`Are you sure you want to delete Dr. ${doctor.name}?`, 'Delete doctor?', 'Yes, delete')
      .then((result) => {
        if (!result.isConfirmed) return;

        this.doctorService.deleteDoctor(doctor.id).subscribe({
          next: () => {
            this.alertService.success(`Dr. ${doctor.name} has been deleted`);
            this.loadDoctors();
          },
          error: (err) => {
            console.error(err);
            this.alertService.error('Failed to delete doctor');
          },
        });
      });
  }
}
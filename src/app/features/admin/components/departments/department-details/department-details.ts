import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DepartmentService } from '../../../../../core/services/department-service.service';
import { DepartmentDetails as DeptDetails } from '../../../../../shared/interfaces/Department/DepartmentDetails';
import { DoctorAtDepartment } from '../../../../../shared/interfaces/Department/DoctorAtDepartment ';

@Component({
  selector: 'app-department-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './department-details.html',
  styleUrls: ['./department-details.css'],
})
export class DepartmentDetails implements OnInit {
  departmentId: number | null = null;
  department: DeptDetails = {
    id: 0,
    name: '',
    floorNumber: null,
    headDoctor: '',
    headDoctorId: null,

    status: 'Active',
    doctorCount: 0,
    createdAt: new Date(),
    doctors: [],
  };

  // Doctors Pagination
  doctors: DoctorAtDepartment[] = [];
  doctorPageNumber: number = 1;
  doctorPageSize: number = 5;
  totalDoctorCount: number = 0;
  totalDoctorPages: number = 0;
  doctorSearchTerm: string = '';

  isLoading = true;
  isLoadingDoctors = false;
  errorMessage: string | null = null;

  // Math for template
  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private departmentService: DepartmentService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.departmentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.departmentId) {
      this.loadDepartment();
      this.loadDoctors();
    }
  }

  // ============================================================
  // Load Department
  // ============================================================
  loadDepartment(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.departmentService.getDepartmentById(this.departmentId!).subscribe({
      next: (response) => {
        this.department = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load department details.';
        console.error('Error loading department:', err);
      },
    });
  }

  // ============================================================
  // Load Doctors with Pagination (using DoctorService)
  // ============================================================
  loadDoctors(): void {
    if (!this.departmentId) return;
    this.isLoadingDoctors = true;

    this.departmentService
      .getDepartmentDoctors(
        this.departmentId,
        this.doctorPageNumber,
        this.doctorPageSize,
        this.doctorSearchTerm || undefined,
      )
      .subscribe({
        next: (response) => {
          this.doctors = response.items || [];
          this.totalDoctorCount = response.totalCount || 0;
          this.totalDoctorPages = response.totalPages || 0;
          this.isLoadingDoctors = false;
          this.cdr.markForCheck(); // ✅ يجبر Angular يعمل re-render
        },
        error: (err) => {
          this.isLoadingDoctors = false;
          this.cdr.markForCheck();
          console.error('Error loading doctors:', err);
        },
      });
  }

  // ============================================================
  // Doctor Pagination
  // ============================================================
  changeDoctorPage(page: number): void {
    if (page < 1 || page > this.totalDoctorPages || this.isLoadingDoctors) {
      return;
    }
    this.doctorPageNumber = page;
    this.loadDoctors();
  }

  searchDoctors(): void {
    this.doctorPageNumber = 1;
    this.loadDoctors();
  }

  clearDoctorSearch(): void {
    this.doctorSearchTerm = '';
    this.doctorPageNumber = 1;
    this.loadDoctors();
  }

  // ============================================================
  // Status Helpers
  // ============================================================
  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Inactive':
        return 'bg-gray-100 text-gray-600';
      case 'Maintenance':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getStatusDotClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-green-600';
      case 'Inactive':
        return 'bg-gray-400';
      case 'Maintenance':
        return 'bg-amber-600';
      default:
        return 'bg-gray-400';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DepartmentService } from '../../../../../core/services/department-service.service';
import { UpdateDepartmentDto } from '../../../../../shared/interfaces/Department/UpdateDepartmentDto';
import { DoctorAtDepartment } from '../../../../../shared/interfaces/Department/DoctorAtDepartment ';

@Component({
  selector: 'app-edit-departments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './edit-departments.html',
  styleUrls: ['./edit-departments.css'],
})
export class EditDepartments implements OnInit {
  departmentId: number | null = null;
  readonly MIN_FLOOR = 0;
  readonly MAX_FLOOR = 50;
  readonly MIN_NAME_LENGTH = 3;
  // Doctors for select
  doctors: DoctorAtDepartment[] = [];
  isLoadingDoctors = false;

  // Department data
  department: UpdateDepartmentDto = {
    name: '',
    floorNumber: null,
    headDoctor: 'Not Assigned',
    headDoctorId: null,
    status: 'Active',
  };

  // Original data for reset
  originalDepartment: UpdateDepartmentDto = {
    name: '',
    floorNumber: null,
    headDoctor: 'Not Assigned',
    headDoctorId: null,
    phoneExt: null,
    status: 'Active',
  };

  // UI State
  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;

  // Statuses
  statuses = ['Active', 'Inactive', 'Maintenance'];

  // Doctor Pagination
  doctorPageNumber: number = 1;
  doctorPageSize: number = 10;
  totalDoctorCount: number = 0;
  totalDoctorPages: number = 0;
  doctorSearchTerm: string = '';

  // Summary data
  summary = {
    id: 0,
    name: '',
    doctorCount: 0,
    createdAt: new Date(),
    status: 'Active' as 'Active' | 'Inactive' | 'Maintenance',
  };

  // Math for template
  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService,
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
        this.department = {
          name: response.name,
          floorNumber: response.floorNumber,
          headDoctor: response.headDoctor || 'Not Assigned',
          headDoctorId: response.headDoctorId,
          status: response.status,
        };

        this.originalDepartment = { ...this.department };

        this.summary = {
          id: response.id,
          name: response.name,
          doctorCount: response.doctorCount,
          createdAt: response.createdAt,
          status: response.status,
        };

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load department.';
        console.error('Error loading department:', err);
      },
    });
  }

  // ============================================================
  // Load Doctors
  // ============================================================
  loadDoctors(): void {
    this.isLoadingDoctors = true;

    this.departmentService
      .getDepartmentDoctors(
        this.departmentId!,
        this.doctorPageNumber,
        this.doctorPageSize,
        this.doctorSearchTerm,
      )
      .subscribe({
        next: (response) => {
          this.doctors = response.items || [];
          this.totalDoctorCount = response.totalCount || 0;
          this.totalDoctorPages = response.totalPages || 0;
          this.isLoadingDoctors = false;
        },
        error: (err) => {
          this.isLoadingDoctors = false;
          console.error('Error loading doctors:', err);
        },
      });
  }

  // ============================================================
  // Doctor Pagination
  // ============================================================
  changeDoctorPage(page: number): void {
    if (page < 1 || page > this.totalDoctorPages || this.isLoadingDoctors) return;
    this.doctorPageNumber = page;
    this.loadDoctors();
  }

  searchDoctors(): void {
    this.doctorPageNumber = 1;
    this.loadDoctors();
  }

  // ============================================================
  // When Head Doctor changes
  // ============================================================
  onHeadDoctorChange(doctorId: number | null): void {
    if (doctorId) {
      const doctor = this.doctors.find((d) => d.id === +doctorId);
      this.department.headDoctor = doctor?.name || 'Not Assigned';
    } else {
      // ✅ None (Assign Later)
      this.department.headDoctor = 'Not Assigned';
      this.department.headDoctorId = null;
    }
  }

  // ============================================================
  // Validation
  // ============================================================
  isFormValid(): boolean {
    const trimmedName = this.department.name?.trim() || '';

    if (!trimmedName) return false;

    if (trimmedName.length < this.MIN_NAME_LENGTH) return false;

    if (this.department.floorNumber !== null) {
      if (
        !Number.isInteger(this.department.floorNumber) ||
        this.department.floorNumber! < this.MIN_FLOOR ||
        this.department.floorNumber! > this.MAX_FLOOR
      ) {
        return false;
      }
    }

    return true;
  }

  // ============================================================
  // Submit
  // ============================================================
  onSubmit(): void {
    // Validate all fields
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fix all validation errors before submitting.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    // Check if name is unique (excluding current department)
    this.departmentService
      .isDepartmentNameUnique(this.department.name, this.departmentId!)
      .subscribe({
        next: (isUnique) => {
          if (!isUnique) {
            this.errorMessage = `A department named '${this.department.name}' already exists.`;
            this.isSaving = false;
            return;
          }

          // Update the department
          this.departmentService.updateDepartment(this.departmentId!, this.department).subscribe({
            next: () => {
              this.isSaving = false;
              this.router.navigate(['/admin/dashboard/departments/all-departments']);
            },
            error: (err) => {
              this.isSaving = false;
              this.handleApiError(err);
            },
          });
        },
        error: (err) => {
          this.isSaving = false;

          // If 403, skip uniqueness check and try to update directly
          if (err.status === 403) {
            console.warn('Permission issue, skipping uniqueness check...');
            this.departmentService.updateDepartment(this.departmentId!, this.department).subscribe({
              next: () => {
                this.isSaving = false;
                this.router.navigate(['/admin/dashboard/departments/all-departments']);
              },
              error: (updateErr) => {
                this.isSaving = false;
                this.handleApiError(updateErr);
              },
            });
            return;
          }

          this.errorMessage = 'Failed to validate department name. Please try again.';
          console.error('Error checking name uniqueness:', err);
        },
      });
  }

  // ============================================================
  // Handle API Errors
  // ============================================================
  private handleApiError(err: any): void {
    console.error('API Error:', err);

    if (err.status === 400 && err.error?.errors) {
      const validationErrors = Object.values(err.error.errors).flat().join(' ');
      this.errorMessage = validationErrors || 'Validation failed. Please check your input.';
      return;
    }

    if (err.error?.message) {
      this.errorMessage = err.error.message;
    } else if (err.message) {
      this.errorMessage = err.message;
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again.';
    }
  }

  // ============================================================
  // Reset
  // ============================================================
  onReset(): void {
    this.department = { ...this.originalDepartment };
    this.errorMessage = null;
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

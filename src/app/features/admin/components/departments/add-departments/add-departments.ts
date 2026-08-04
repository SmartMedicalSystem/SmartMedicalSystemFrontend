import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CreateDepartmentDto } from '../../../../../shared/interfaces/Department/CreateDepartmentDto';
import { DepartmentService } from '../../../../../core/services/department-service.service';
import { DoctorForSelect } from '../../../../../shared/interfaces/Department/DoctorForSelect';

@Component({
  selector: 'app-add-departments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './add-departments.html',
  styleUrls: ['./add-departments.css'],
})
export class AddDepartments implements OnInit {
  // Doctors from API (Paginated)
  doctors: DoctorForSelect[] = [];
  totalDoctorCount: number = 0;
  doctorPageNumber: number = 1;
  doctorPageSize: number = 10;
  totalDoctorPages: number = 1;

  statuses = ['Active', 'Inactive', 'Maintenance'];

  readonly MIN_NAME_LENGTH = 3;
  readonly MIN_FLOOR = 0;
  readonly MAX_FLOOR = 50;

  department: CreateDepartmentDto = {
    name: '',
    floorNumber: null,
    headDoctor: 'Not Assigned',
    headDoctorId: null,
    status: 'Active',
  };

  isSubmitting = false;
  isLoadingDoctors = false;
  errorMessage: string | null = null;

  Math = Math;

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadDoctors();
  }

  // ============================================================
  // Load Doctors with Pagination
  // ============================================================
  loadDoctors(pageNumber: number = 1): void {
    this.isLoadingDoctors = true;
    this.departmentService.getDoctorsForSelect(pageNumber, this.doctorPageSize).subscribe({
      next: (result) => {
        this.doctors = result.items || [];
        this.totalDoctorCount = result.totalCount || 0;
        this.doctorPageNumber = result.pageNumber || 1;
        this.doctorPageSize = result.pageSize || 10;
        this.totalDoctorPages = result.totalPages || 1;
        this.isLoadingDoctors = false;
      },
      error: (err) => {
        this.isLoadingDoctors = false;
        console.error('Error loading doctors:', err);
        this.doctors = [];
      },
    });
  }

  changeDoctorPage(page: number): void {
    if (page < 1 || page > this.totalDoctorPages || this.isLoadingDoctors) {
      return;
    }
    this.loadDoctors(page);
  }

  onHeadDoctorChange(doctorId: number | null): void {
    if (doctorId) {
      const doctor = this.doctors.find((d) => d.id === +doctorId);
      this.department.headDoctor = doctor?.name || 'Not Assigned';
    } else {
      this.department.headDoctor = 'Not Assigned';
    }
  }

  // ============================================================
  // Submit
  // ============================================================
  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.errorMessage = 'Please fix all validation errors before submitting.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.departmentService.isDepartmentNameUnique(this.department.name).subscribe({
      next: (isUnique) => {
        if (!isUnique) {
          this.errorMessage = `A department named '${this.department.name}' already exists.`;
          this.isSubmitting = false;
          return;
        }

        this.departmentService.createDepartment(this.department).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.router.navigate(['/admin/dashboard/departments/all-departments']);
          },
          error: (err) => {
            this.isSubmitting = false;
            this.handleApiError(err);
          },
        });
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err.status === 403) {
          console.warn('Permission issue, skipping uniqueness check...');
          this.departmentService.createDepartment(this.department).subscribe({
            next: () => {
              this.isSubmitting = false;
              this.router.navigate(['/admin/dashboard/departments/all-departments']);
            },
            error: (createErr) => {
              this.isSubmitting = false;
              this.handleApiError(createErr);
            },
          });
          return;
        }

        this.errorMessage = 'Failed to validate department name. Please try again.';
        console.error('Error checking name uniqueness:', err);
      },
    });
  }

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

  onReset(): void {
    this.department = {
      name: '',
      floorNumber: null,
      headDoctor: 'Not Assigned',
      headDoctorId: null,
      status: 'Active',
    };
    this.errorMessage = null;
  }
}

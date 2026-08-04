import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CreateLaboratoryDto } from '../../../../../shared/interfaces/Laboratory/CreateLaboratoryDto';
import { LaboratoryService } from '../../../../../core/services/laboratory-service.service';
import { TechnicianForSelect } from '../../../../../shared/interfaces/Laboratory/TechnicianForSelect';

@Component({
  selector: 'app-add-laboratory',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './add-laboratory.html',
  styleUrls: ['./add-laboratory.css'],
})
export class AddLaboratory implements OnInit {
  // ============================================================
  // Data for selects
  // ============================================================
  departments: { id: number; name: string }[] = [];
  technicians: TechnicianForSelect[] = [];
  statuses = ['Active', 'Inactive', 'Maintenance', 'Closed'];

  // ============================================================
  // Departments Pagination
  // ============================================================
  deptPageNumber: number = 1;
  deptPageSize: number = 10;
  totalDeptCount: number = 0;
  totalDeptPages: number = 0;
  deptSearchTerm: string = '';

  // ============================================================
  // Technicians Pagination
  // ============================================================
  techPageNumber: number = 1;
  techPageSize: number = 10;
  totalTechCount: number = 0;
  totalTechPages: number = 0;
  techSearchTerm: string = '';

  // ============================================================
  // Form Data
  // ============================================================
  laboratory: CreateLaboratoryDto = {
    name: '',
    location: '',
    phone: '',
    code: '',
    specialty: '',
    status: 'Active',
    headTechnicianId: null,
    departmentId: null,
  };

  // ============================================================
  // UI State
  // ============================================================
  isLoading = false;
  isLoadingDepartments = false;
  isLoadingTechnicians = false;
  errorMessage: string | null = null;

  // Math for template
  Math = Math;

  constructor(
    private laboratoryService: LaboratoryService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadTechnicians();
  }

  // ============================================================
  // Load Departments with Pagination
  // ============================================================
  loadDepartments(): void {
    this.isLoadingDepartments = true;
    this.laboratoryService
      .getDepartmentsForSelect(
        this.deptPageNumber,
        this.deptPageSize,
        this.deptSearchTerm || undefined,
      )
      .subscribe({
        next: (response) => {
          this.departments = response.items || [];
          this.totalDeptCount = response.totalCount || 0;
          this.totalDeptPages = response.totalPages || 0;
          this.isLoadingDepartments = false;
        },
        error: (err) => {
          this.isLoadingDepartments = false;
          console.error('Error loading departments:', err);
          this.departments = [];
        },
      });
  }

  // ============================================================
  // Change Department Page
  // ============================================================
  changeDeptPage(page: number): void {
    if (page < 1 || page > this.totalDeptPages || this.isLoadingDepartments) return;
    this.deptPageNumber = page;
    this.loadDepartments();
  }

  searchDepartments(): void {
    this.deptPageNumber = 1;
    this.loadDepartments();
  }

  // ============================================================
  // Load Technicians with Pagination
  // ============================================================
  loadTechnicians(): void {
    this.isLoadingTechnicians = true;
    this.laboratoryService
      .getTechniciansForSelect(
        this.techPageNumber,
        this.techPageSize,
        this.techSearchTerm || undefined,
      )
      .subscribe({
        next: (response) => {
          this.technicians = response.items || [];
          this.totalTechCount = response.totalCount || 0;
          this.totalTechPages = response.totalPages || 0;
          this.isLoadingTechnicians = false;
        },
        error: (err) => {
          this.isLoadingTechnicians = false;
          console.error('Error loading technicians:', err);
          this.technicians = [];
        },
      });
  }

  // ============================================================
  // Change Technician Page
  // ============================================================
  changeTechPage(page: number): void {
    if (page < 1 || page > this.totalTechPages || this.isLoadingTechnicians) return;
    this.techPageNumber = page;
    this.loadTechnicians();
  }

  searchTechnicians(): void {
    this.techPageNumber = 1;
    this.loadTechnicians();
  } // ============================================================
  // Validation State
  // ============================================================
  fieldErrors: { [key: string]: string } = {};
  isSubmitting = false;

  // ============================================================
  // Validation Methods
  // ============================================================

  validateField(fieldName: string): void {
    switch (fieldName) {
      case 'name':
        if (!this.laboratory.name?.trim()) {
          this.fieldErrors['name'] = 'Laboratory name is required.';
        } else if (this.laboratory.name.length < 3) {
          this.fieldErrors['name'] = 'Laboratory name must be at least 3 characters.';
        } else {
          delete this.fieldErrors['name'];
        }
        break;

      case 'location':
        if (!this.laboratory.location?.trim()) {
          this.fieldErrors['location'] = 'Location is required.';
        } else {
          delete this.fieldErrors['location'];
        }
        break;

      case 'phone':
        if (!this.laboratory.phone?.trim()) {
          this.fieldErrors['phone'] = 'Phone number is required.';
        } else if (!this.isValidPhone(this.laboratory.phone)) {
          this.fieldErrors['phone'] =
            'Phone must start with 010, 011, 012, or 015 followed by 8 digits.';
        } else {
          delete this.fieldErrors['phone'];
        }
        break;

      case 'code':
        if (this.laboratory.code && !/^[A-Z0-9\-_]+$/.test(this.laboratory.code)) {
          this.fieldErrors['code'] =
            'Code can only contain letters, numbers, hyphens, and underscores.';
        } else {
          delete this.fieldErrors['code'];
        }
        break;
      case 'specialty':
        if (this.laboratory.specialty && this.laboratory.specialty.trim().length > 0) {
          if (this.laboratory.specialty.trim().length < 2) {
            this.fieldErrors['specialty'] = 'Specialty must be at least 2 characters.';
          } else if (this.laboratory.specialty.length > 100) {
            this.fieldErrors['specialty'] = 'Specialty must not exceed 100 characters.';
          } else if (!/^[a-zA-Z\u0600-\u06FF\s,\-&]+$/.test(this.laboratory.specialty)) {
            this.fieldErrors['specialty'] =
              'Specialty can only contain letters, spaces, commas, and hyphens.';
          } else {
            delete this.fieldErrors['specialty'];
          }
        } else {
          delete this.fieldErrors['specialty'];
        }
        break;
    }
  }

  isValidPhone(phone: string): boolean {
    // Egyptian phone numbers: 010, 011, 012, 015 + 8 digits = 11 digits total
    const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
    return phoneRegex.test(phone);
  }

  validateAllFields(): boolean {
    this.validateField('name');
    this.validateField('location');
    this.validateField('phone');
    this.validateField('code');
    this.validateField('specialty');
    return Object.keys(this.fieldErrors).length === 0;
  }

  isFieldInvalid(fieldName: string): boolean {
    return !!this.fieldErrors[fieldName];
  }

  getFieldError(fieldName: string): string | null {
    return this.fieldErrors[fieldName] || null;
  }

  isFormValid(): boolean {
    if (!this.laboratory.name?.trim()) return false;
    if (!this.laboratory.location?.trim()) return false;
    if (!this.laboratory.phone?.trim()) return false;
    if (!this.isValidPhone(this.laboratory.phone)) return false;
    if (this.laboratory.code && !/^[A-Z0-9\-_]+$/.test(this.laboratory.code)) return false;
    if (this.laboratory.specialty && this.laboratory.specialty.trim().length > 0) {
      if (this.laboratory.specialty.trim().length < 2) return false;
      if (this.laboratory.specialty.length > 100) return false;
      if (!/^[a-zA-Z\u0600-\u06FF\s,\-&]+$/.test(this.laboratory.specialty)) return false;
    }
    return true;
  }

  // ============================================================
  // Submit (مع الـ Validation)
  // ============================================================
  onSubmit(): void {
    // Validate all fields
    if (!this.validateAllFields()) {
      this.errorMessage = 'Please fix all validation errors before submitting.';
      return;
    }

    if (!this.isFormValid()) {
      this.errorMessage = 'Please fix all validation errors before submitting.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.laboratoryService.isLaboratoryNameUnique(this.laboratory.name).subscribe({
      next: (isUnique) => {
        if (!isUnique) {
          this.errorMessage = `A laboratory named '${this.laboratory.name}' already exists.`;
          this.isSubmitting = false;
          return;
        }

        this.laboratoryService.createLaboratory(this.laboratory).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.router.navigate(['/admin/dashboard/laboratories/all-laboratories']);
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
          this.laboratoryService.createLaboratory(this.laboratory).subscribe({
            next: () => {
              this.isSubmitting = false;
              this.router.navigate(['/admin/dashboard/laboratories/all-laboratories']);
            },
            error: (createErr) => {
              this.isSubmitting = false;
              this.handleApiError(createErr);
            },
          });
          return;
        }
        this.errorMessage = 'Failed to validate laboratory name.';
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

    this.errorMessage = err.error?.message || 'An unexpected error occurred. Please try again.';
  }

  // ============================================================
  // Reset
  // ============================================================
  onReset(): void {
    this.laboratory = {
      name: '',
      location: '',
      phone: '',
      code: '',
      specialty: '',
      status: 'Active',
      headTechnicianId: null,
      departmentId: null,
    };
    this.errorMessage = null;
  }
}

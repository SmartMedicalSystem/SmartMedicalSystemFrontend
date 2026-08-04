import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UpdateLaboratoryDto } from '../../../../../shared/interfaces/Laboratory/UpdateLaboratoryDto';
import { LaboratoryService } from '../../../../../core/services/laboratory-service.service';
import { TechnicianForSelect } from '../../../../../shared/interfaces/Laboratory/TechnicianForSelect';

@Component({
  selector: 'app-edit-laboratory',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './edit-laboratories.html',
  styleUrls: ['./edit-laboratories.css'],
})
export class EditLaboratory implements OnInit {
  laboratoryId: number | null = null;

  // ============================================================
  // Data for selects
  // ============================================================
  departments: { id: number; name: string }[] = [];
  technicians: TechnicianForSelect[] = [];
  statuses = ['Active', 'Inactive', 'Maintenance', 'Closed'];

  // ============================================================
  // Form Data
  // ============================================================
  laboratory: UpdateLaboratoryDto = {
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
  // Original Data (for reset)
  // ============================================================
  originalLaboratory: UpdateLaboratoryDto = {
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
  // Summary Data
  // ============================================================
  summary = {
    id: 0,
    name: '',
    testCount: 0,
    technicianCount: 0,
    createdAt: new Date(),
    status: 'Active' as 'Active' | 'Inactive' | 'Maintenance' | 'Closed',
  };

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
  // UI State
  // ============================================================
  isLoading = false;
  isLoadingDepartments = false;
  isLoadingTechnicians = false;
  isSaving = false;
  errorMessage: string | null = null;

  // ============================================================
  // Validation State
  // ============================================================
  fieldErrors: { [key: string]: string } = {};

  // Math for template
  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private laboratoryService: LaboratoryService,
  ) { }

  ngOnInit(): void {
    this.laboratoryId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.laboratoryId) {
      this.loadLaboratory();
      this.loadDepartments();
      this.loadTechnicians();
    }
  }

  // ============================================================
  // Load Laboratory
  // ============================================================
  loadLaboratory(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.laboratoryService.getLaboratoryById(this.laboratoryId!).subscribe({
      next: (response) => {
        this.laboratory = {
          name: response.name,
          location: response.location,
          phone: response.phone,
          code: response.code || '',
          specialty: response.specialty || '',
          status: response.status,
          headTechnicianId: response.headTechnicianId,
          departmentId: response.departmentId,
        };

        this.originalLaboratory = { ...this.laboratory };

        this.summary = {
          id: response.id,
          name: response.name,
          testCount: response.testCount,
          technicianCount: response.technicianCount,
          createdAt: response.createdAt,
          status: response.status,
        };

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load laboratory.';
        console.error('Error loading laboratory:', err);
      },
    });
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
  // Load Technicians with Pagination

  // ============================================================
  loadTechnicians(): void {
    this.isLoadingTechnicians = true;
    this.laboratoryService
      .getTechniciansForEdit(
        this.laboratoryId!,
        this.techPageNumber,
        this.techPageSize,
        this.techSearchTerm,
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
  // Pagination Controls
  // ============================================================
  changeDeptPage(page: number): void {
    if (page < 1 || page > this.totalDeptPages || this.isLoadingDepartments) return;
    this.deptPageNumber = page;
    this.loadDepartments();
  }

  changeTechPage(page: number): void {
    if (page < 1 || page > this.totalTechPages || this.isLoadingTechnicians) return;
    this.techPageNumber = page;
    this.loadTechnicians();
  }

  // ============================================================
  // Validation
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
    }
  }

  isValidPhone(phone: string): boolean {
    const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
    return phoneRegex.test(phone);
  }

  validateAllFields(): boolean {
    this.validateField('name');
    this.validateField('location');
    this.validateField('phone');
    this.validateField('code');
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
    return true;
  }

  // ============================================================
  // Submit
  // ============================================================
  onSubmit(): void {
    if (!this.validateAllFields()) {
      this.errorMessage = 'Please fix all validation errors before submitting.';
      return;
    }

    if (!this.isFormValid()) {
      this.errorMessage = 'Please fix all validation errors before submitting.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    this.laboratoryService
      .isLaboratoryNameUnique(this.laboratory.name, this.laboratoryId!)
      .subscribe({
        next: (isUnique) => {
          if (!isUnique) {
            this.errorMessage = `A laboratory named '${this.laboratory.name}' already exists.`;
            this.isSaving = false;
            return;
          }

          this.laboratoryService.updateLaboratory(this.laboratoryId!, this.laboratory).subscribe({
            next: () => {
              this.isSaving = false;
              this.router.navigate(['/admin/dashboard/laboratories/all-laboratories']);
            },
            error: (err) => {
              this.isSaving = false;
              this.handleApiError(err);
            },
          });
        },
        error: (err) => {
          this.isSaving = false;
          if (err.status === 403) {
            this.laboratoryService.updateLaboratory(this.laboratoryId!, this.laboratory).subscribe({
              next: () => {
                this.isSaving = false;
                this.router.navigate(['/admin/dashboard/laboratories/all-laboratories']);
              },
              error: (updateErr) => {
                this.isSaving = false;
                this.handleApiError(updateErr);
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
    this.laboratory = { ...this.originalLaboratory };
    this.fieldErrors = {};
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

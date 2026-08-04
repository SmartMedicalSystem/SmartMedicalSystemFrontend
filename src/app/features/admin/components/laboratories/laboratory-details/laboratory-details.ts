import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LaboratoryDetails as LabDetails } from '../../../../../shared/interfaces/Laboratory/LaboratoryDetails';

import { TechnicianDetails } from '../../../../../shared/interfaces/Laboratory/TechnicianDetails';
import { LaboratoryService } from '../../../../../core/services/laboratory-service.service';
import { LabTestDetails } from '../../../../../shared/interfaces/Laboratory/LabTestDetails';
@Component({
  selector: 'app-laboratory-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './laboratory-details.html',
  styleUrls: ['./laboratory-details.css'],
})
export class LaboratoryDetails implements OnInit {
  laboratoryId: number | null = null;
  laboratory: LabDetails = {
    id: 0,
    name: '',
    location: '',
    phone: '',
    code: null,
    specialty: null,
    status: 'Active',
    headTechnicianId: null,
    headTechnicianName: null,
    departmentId: null,
    departmentName: null,
    testCount: 0,
    technicianCount: 0,
    createdAt: new Date(),
  };

  Math = Math;

  // ============================================================
  // UI State
  // ============================================================
  isLoading = true;
  errorMessage: string | null = null;

  // ============================================================
  // Constructor
  // ============================================================
  constructor(
    private route: ActivatedRoute,
    private laboratoryService: LaboratoryService,
  ) { }

  // ============================================================
  // OnInit
  // ============================================================
  ngOnInit(): void {
    this.laboratoryId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.laboratoryId) {
      this.loadLaboratory();
      this.loadTechnicians();
      this.loadTests();
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
        this.laboratory = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load laboratory details.';
        console.error('Error loading laboratory:', err);
      },
    });
  }
  // ============================================================
  // Technicians Pagination
  // ============================================================
  technicians: TechnicianDetails[] = [];
  techPageNumber: number = 1;
  techPageSize: number = 5;
  totalTechCount: number = 0;
  totalTechPages: number = 0;
  techSearchTerm: string = '';
  isLoadingTechnicians = false;

  loadTechnicians(): void {
    if (!this.laboratoryId) return;

    this.isLoadingTechnicians = true;

    this.laboratoryService
      .getTechniciansByLaboratory(
        this.laboratoryId,
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
        },
      });
  }
  // ============================================================
  // Technician Pagination
  // ============================================================
  changeTechPage(page: number): void {
    if (page < 1 || page > this.totalTechPages || this.isLoadingTechnicians) return;
    this.techPageNumber = page;
    this.loadTechnicians();
  }

  searchTechnicians(): void {
    this.techPageNumber = 1;
    this.loadTechnicians();
  }

  // ============================================================
  // Tests Data
  // ============================================================
  tests: LabTestDetails[] = [];
  testPageNumber: number = 1;
  testPageSize: number = 5;
  totalTestCount: number = 0;
  totalTestPages: number = 0;
  testSearchTerm: string = '';
  isLoadingTests = false;
  // ============================================================
  // Load Tests (من LabTestsController)
  // ============================================================
  loadTests(): void {
    if (!this.laboratoryId) return;

    this.isLoadingTests = true;
    this.laboratoryService
      .getLabTestsByLaboratory(
        this.laboratoryId,
        this.testPageNumber,
        this.testPageSize,
        this.testSearchTerm || undefined,
      )
      .subscribe({
        next: (response) => {
          this.tests = response.items || [];
          this.totalTestCount = response.totalCount || 0;
          this.totalTestPages = response.totalPages || 0;
          this.isLoadingTests = false;
        },
        error: (err) => {
          this.isLoadingTests = false;
          console.error('Error loading tests:', err);
        },
      });
  }
  // ============================================================
  // Test Pagination
  // ============================================================
  changeTestPage(page: number): void {
    if (page < 1 || page > this.totalTestPages || this.isLoadingTests) return;
    this.testPageNumber = page;
    this.loadTests();
  }

  searchTests(): void {
    this.testPageNumber = 1;
    this.loadTests();
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

  getTestStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'completed':
      case 'done':
        return 'bg-green-100 text-green-700';
      case 'in progress':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }
}

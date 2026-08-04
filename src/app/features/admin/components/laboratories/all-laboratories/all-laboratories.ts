import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { Laboratory } from '../../../../../shared/interfaces/Laboratory/Laboratory';
import { LaboratoryService } from '../../../../../core/services/laboratory-service.service';
import { ConfirmationService } from '../../../../../core/services/Confirmation-service.service';

@Component({
  selector: 'app-all-laboratories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './all-laboratories.html',
  styleUrls: ['./all-laboratories.css'],
})
export class AllLaboratories implements OnInit {
  // ============================================================
  // Data
  // ============================================================
  laboratories: Laboratory[] = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  confirmationService = inject(ConfirmationService);
  // ============================================================
  // Search & Filters
  // ============================================================
  searchTerm: string = '';
  statusFilter: string = 'all';
  statuses = ['all', 'Active', 'Inactive', 'Maintenance', 'Closed'];

  // ============================================================
  // UI State
  // ============================================================
  isLoading = false;
  errorMessage: string | null = null;

  // Math for template
  Math = Math;

  constructor(private laboratoryService: LaboratoryService) { }

  ngOnInit(): void {
    this.loadLaboratories();
  }

  // ============================================================
  // Load Laboratories
  // ============================================================
  loadLaboratories(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const status = this.statusFilter === 'all' ? undefined : this.statusFilter;

    this.laboratoryService
      .getAllLaboratories(this.pageNumber, this.pageSize, this.searchTerm || undefined, status)
      .subscribe({
        next: (result) => {
          this.laboratories = result.items || [];
          this.totalCount = result.totalCount || 0;
          this.pageNumber = result.pageNumber || 1;
          this.pageSize = result.pageSize || 10;
          this.totalPages = result.totalPages || 1;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to load laboratories. Please try again.';
          console.error('Error loading laboratories:', err);
        },
      });
  }

  // ============================================================
  // Search & Filter
  // ============================================================
  applyFilters(): void {
    this.pageNumber = 1;
    this.loadLaboratories();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.applyFilters();
  }

  // ============================================================
  // Pagination
  // ============================================================
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.pageNumber) {
      return;
    }
    this.pageNumber = page;
    this.loadLaboratories();
  }

  previousPage(): void {
    if (this.pageNumber > 1) {
      this.goToPage(this.pageNumber - 1);
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.goToPage(this.pageNumber + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.pageNumber;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (current > 3) {
        pages.push(-1); // ...
      }
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) {
        pages.push(-1); // ...
      }
      pages.push(total);
    }

    return pages;
  }

  // ============================================================
  // Refresh
  // ============================================================
  refresh(): void {
    this.loadLaboratories();
  }

  // ============================================================
  // Delete
  // ============================================================
  async deleteLaboratory(id: number, name: string): Promise<void> {
    const confirmed = await this.confirmationService.confirmDelete(name);
    if (!confirmed) return;

    this.laboratoryService.deleteLaboratory(id).subscribe({
      next: () => {
        this.loadLaboratories();
        this.confirmationService.showSuccess('Deleted!', `${name} has been successfully removed.`);
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.confirmationService.showError('Error!', `An error occurred while deleting ${name}`);
      },
    });
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

  getIconForLab(name: string): string {
    // Return different icons based on lab name or type
    const icons: { [key: string]: string } = {
      Pathology: 'science',
      Hematology: 'bloodtype',
      Genetics: 'dna',
      Biochemistry: 'science',
      Microbiology: 'coronavirus',
      Molecular: 'dna',
      Virology: 'coronavirus',
      Chemistry: 'science',
      Immunology: 'vaccines',
      Urgency: 'emergency',
      Research: 'biotech',
    };

    for (const [key, icon] of Object.entries(icons)) {
      if (name.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return 'biotech';
  }
}

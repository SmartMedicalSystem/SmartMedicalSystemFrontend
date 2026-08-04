import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DepartmentService } from '../../../../../core/services/department-service.service';
import { Department } from '../../../../../shared/interfaces/Department/Department';
import Swal from 'sweetalert2';
import { ConfirmationService } from '../../../../../core/services/Confirmation-service.service';

@Component({
  selector: 'app-all-departments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './all-departments.html',
  styleUrls: ['./all-departments.css'],
})
export class AllDepartments implements OnInit {
  constructor(private departmentService: DepartmentService) { }

  // ==========================
  // Data
  // ==========================
  confirmationService = inject(ConfirmationService);
  departments: Department[] = [];

  searchQuery = '';
  statusFilter = 'all';
  creationDateFilter = 'all';
  managerFilter = 'all';

  statuses = ['all', 'Active', 'Inactive', 'Maintenance'];

  dateFilters = ['all', 'Last 30 Days', 'This Year'];

  managers: string[] = ['all'];

  // ==========================
  // Pagination
  // ==========================

  currentPage = 1;
  pageSize = 5;

  totalItems = 0;
  totalPages = 0;

  // ==========================
  // Init
  // ==========================

  ngOnInit(): void {
    this.loadDepartments();
  }

  // ==========================
  // Load Departments
  // ==========================

  loadDepartments(): void {
    const status = this.statusFilter === 'all' ? undefined : this.statusFilter;
    const creationDate = this.creationDateFilter === 'all' ? undefined : this.creationDateFilter;
    const manager = this.managerFilter === 'all' ? undefined : this.managerFilter;

    this.departmentService
      .getAllDepartments(
        this.currentPage,
        this.pageSize,
        this.searchQuery || undefined,
        status,
        creationDate,
        manager,
      )
      .subscribe({
        next: (response) => {
          this.departments = response.items;
          this.totalItems = response.totalCount;
          this.totalPages = response.totalPages;
          this.currentPage = response.pageNumber;
          this.pageSize = response.pageSize;

          // Fill Head Doctor Filter
          this.managers = [
            'all',
            ...new Set(response.items.map((d) => d.headDoctor).filter((x) => x && x.trim() !== '')),
          ];
        },
        error: (err) => {
          console.error('Failed to load departments', err);
        },
      });
  }

  // ==========================
  // Filters
  // ==========================

  applyFilter(): void {
    this.currentPage = 1;
    this.loadDepartments();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.creationDateFilter = 'all';
    this.managerFilter = 'all';

    this.currentPage = 1;

    this.loadDepartments();
  }

  // ==========================
  // Pagination Helpers
  // ==========================

  get paginatedDepartments(): Department[] {
    return this.departments;
  }

  get startIndex(): number {
    if (this.totalItems === 0) return 0;

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];

    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.loadDepartments();
  }

  previousPage(): void {
    if (this.currentPage <= 1) return;

    this.currentPage--;
    this.loadDepartments();
  }

  nextPage(): void {
    if (this.currentPage >= this.totalPages) return;

    this.currentPage++;
    this.loadDepartments();
  }

  // ==========================
  // Refresh
  // ==========================

  refresh(): void {
    this.loadDepartments();
  }

  // ==========================
  // Delete
  // ==========================
  async deleteDepartment(id: number, name: string): Promise<void> {
    const confirmed = await this.confirmationService.confirmDelete(name);
    if (!confirmed) return;

    this.departmentService.deleteDepartment(id).subscribe({
      next: () => {
        this.loadDepartments();
        this.confirmationService.showSuccess('Deleted!', `${name} has been successfully removed.`);
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.confirmationService.showError('Error!', `An error occurred while deleting ${name}`);
      },
    });
  }
}

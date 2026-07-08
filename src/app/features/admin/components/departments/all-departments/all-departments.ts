import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export interface Department {
  departmentId: number;
  name: string;
  floorNumber: number;
  headDoctor: string;
  phoneExt: string;
  doctorCount: number;
  status: 'Active' | 'Inactive' | 'Maintenance';
  createdAt: Date;
}

@Component({
  selector: 'app-all-departments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './all-departments.html',
  styleUrls: ['./all-departments.css'],
})
export class AllDepartments {
  // Mock Data
  allDepartments: Department[] = [
    {
      departmentId: 1,
      name: 'Cardiology Unit',
      floorNumber: 3,
      headDoctor: 'Dr. Elena Rodriguez',
      phoneExt: '101',
      doctorCount: 24,
      status: 'Active',
      createdAt: new Date('2022-01-12'),
    },
    {
      departmentId: 2,
      name: 'Neurology Center',
      floorNumber: 4,
      headDoctor: 'Dr. Simon Kestner',
      phoneExt: '102',
      doctorCount: 18,
      status: 'Active',
      createdAt: new Date('2022-03-05'),
    },
    {
      departmentId: 3,
      name: 'Diagnostic Imaging',
      floorNumber: 1,
      headDoctor: 'Dr. Sarah Chen',
      phoneExt: '103',
      doctorCount: 31,
      status: 'Inactive',
      createdAt: new Date('2021-10-20'),
    },
    {
      departmentId: 4,
      name: 'Emergency Medicine',
      floorNumber: 0,
      headDoctor: 'Dr. Marcus Thorne',
      phoneExt: '104',
      doctorCount: 45,
      status: 'Active',
      createdAt: new Date('2021-12-01'),
    },
    {
      departmentId: 5,
      name: 'Pediatrics',
      floorNumber: 2,
      headDoctor: 'Dr. Linda Grey',
      phoneExt: '105',
      doctorCount: 12,
      status: 'Maintenance',
      createdAt: new Date('2023-05-15'),
    },
    {
      departmentId: 6,
      name: 'Orthopedics',
      floorNumber: 5,
      headDoctor: 'Dr. James Wilson',
      phoneExt: '106',
      doctorCount: 20,
      status: 'Active',
      createdAt: new Date('2022-07-10'),
    },
    {
      departmentId: 7,
      name: 'Dermatology',
      floorNumber: 2,
      headDoctor: 'Dr. Anna Martinez',
      phoneExt: '107',
      doctorCount: 8,
      status: 'Active',
      createdAt: new Date('2023-02-20'),
    },
    {
      departmentId: 8,
      name: 'Ophthalmology',
      floorNumber: 1,
      headDoctor: 'Dr. Robert Chang',
      phoneExt: '108',
      doctorCount: 14,
      status: 'Inactive',
      createdAt: new Date('2021-11-15'),
    },
  ];

  departments: Department[] = [...this.allDepartments];
  searchQuery: string = '';
  statusFilter: string = 'all';
  creationDateFilter: string = 'all';
  managerFilter: string = 'all';

  statuses = ['all', 'Active', 'Inactive', 'Maintenance'];
  dateFilters = ['all', 'Last 30 Days', 'This Year'];
  managers = [
    'all',
    'Dr. Elena Rodriguez',
    'Dr. Simon Kestner',
    'Dr. Sarah Chen',
    'Dr. Marcus Thorne',
    'Dr. Linda Grey',
  ];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = this.allDepartments.length;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get paginatedDepartments(): Department[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.departments.slice(start, end);
  }

  applyFilter() {
    let filtered = [...this.allDepartments];

    // Search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (dept) =>
          dept.name.toLowerCase().includes(query) ||
          dept.headDoctor.toLowerCase().includes(query) ||
          dept.departmentId.toString().includes(query),
      );
    }

    // Status Filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter((dept) => dept.status === this.statusFilter);
    }

    // Date Filter
    if (this.creationDateFilter === 'Last 30 Days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter((dept) => dept.createdAt >= thirtyDaysAgo);
    } else if (this.creationDateFilter === 'This Year') {
      const thisYear = new Date().getFullYear();
      filtered = filtered.filter((dept) => dept.createdAt.getFullYear() === thisYear);
    }

    // Manager Filter
    if (this.managerFilter !== 'all') {
      filtered = filtered.filter((dept) => dept.headDoctor === this.managerFilter);
    }

    this.departments = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  clearFilters() {
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.creationDateFilter = 'all';
    this.managerFilter = 'all';
    this.applyFilter();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}

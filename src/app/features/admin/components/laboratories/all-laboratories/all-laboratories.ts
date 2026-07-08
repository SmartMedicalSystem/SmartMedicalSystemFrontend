import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export interface Laboratory {
  labId: number;
  name: string;
  code: string;
  department: string;
  headTechnician: string;
  headTechnicianInitials: string;
  testsPerMonth: number;
  staffCount: number;
  status: 'Active' | 'Maintenance' | 'Inactive' | 'Closed';
  createdAt: Date;
}

@Component({
  selector: 'app-all-laboratories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './all-laboratories.html',
  styleUrls: ['./all-laboratories.css'],
})
export class AllLaboratories {
  // Mock Data
  allLaboratories: Laboratory[] = [
    {
      labId: 1,
      name: 'Central Hematology Lab',
      code: 'HEM-001',
      department: 'Hematology',
      headTechnician: 'Sarah Miller',
      headTechnicianInitials: 'SM',
      testsPerMonth: 12450,
      staffCount: 24,
      status: 'Active',
      createdAt: new Date('2021-06-15'),
    },
    {
      labId: 2,
      name: 'Molecular Diagnostics',
      code: 'MOL-042',
      department: 'Genetics',
      headTechnician: 'James Kovic',
      headTechnicianInitials: 'JK',
      testsPerMonth: 4200,
      staffCount: 12,
      status: 'Maintenance',
      createdAt: new Date('2022-08-20'),
    },
    {
      labId: 3,
      name: 'Clinical Bio-Analysis',
      code: 'BIO-219',
      department: 'Biochemistry',
      headTechnician: 'Anita Lee',
      headTechnicianInitials: 'AL',
      testsPerMonth: 18900,
      staffCount: 38,
      status: 'Active',
      createdAt: new Date('2021-09-25'),
    },
    {
      labId: 4,
      name: 'Transfusion Center',
      code: 'TRS-009',
      department: 'Hematology',
      headTechnician: 'Robert Dean',
      headTechnicianInitials: 'RD',
      testsPerMonth: 3100,
      staffCount: 9,
      status: 'Inactive',
      createdAt: new Date('2022-11-01'),
    },
    {
      labId: 5,
      name: 'Virology Unit B',
      code: 'VIR-551',
      department: 'Microbiology',
      headTechnician: 'Tessa Hu',
      headTechnicianInitials: 'TH',
      testsPerMonth: 0,
      staffCount: 0,
      status: 'Closed',
      createdAt: new Date('2023-01-10'),
    },
  ];

  laboratories: Laboratory[] = [...this.allLaboratories];

  // Search & Filters
  searchQuery: string = '';
  statusFilter: string = 'all';
  departmentFilter: string = 'all';

  statuses = ['all', 'Active', 'Maintenance', 'Inactive', 'Closed'];
  departments = ['all', 'Hematology', 'Genetics', 'Biochemistry', 'Microbiology'];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = this.allLaboratories.length;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get paginatedLaboratories(): Laboratory[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.laboratories.slice(start, end);
  }

  applyFilter() {
    let filtered = [...this.allLaboratories];

    // Search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lab) =>
          lab.name.toLowerCase().includes(query) ||
          lab.code.toLowerCase().includes(query) ||
          lab.headTechnician.toLowerCase().includes(query) ||
          lab.department.toLowerCase().includes(query),
      );
    }

    // Status Filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter((lab) => lab.status === this.statusFilter);
    }

    // Department Filter
    if (this.departmentFilter !== 'all') {
      filtered = filtered.filter((lab) => lab.department === this.departmentFilter);
    }

    this.laboratories = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  clearFilters() {
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.departmentFilter = 'all';
    this.applyFilter();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Maintenance':
        return 'bg-amber-100 text-amber-700';
      case 'Inactive':
        return 'bg-gray-100 text-gray-600';
      case 'Closed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getStatusDotClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-green-600';
      case 'Maintenance':
        return 'bg-amber-600';
      case 'Inactive':
        return 'bg-gray-400';
      case 'Closed':
        return 'bg-red-600';
      default:
        return 'bg-gray-400';
    }
  }

  getIconForLab(name: string): string {
    const icons: { [key: string]: string } = {
      Hematology: 'bloodtype',
      Genetics: 'dna',
      Biochemistry: 'science',
      Microbiology: 'coronavirus',
    };
    return icons[name] || 'biotech';
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

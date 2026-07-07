import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

export interface Patient {
  id: string;
  name: string;
  avatar: string;
  gender: 'Male' | 'Female';
  age: number;
  nationalId: string;
  bloodGroup: string;
  weight: number;
  assignedDoctor: string;
  department: string;
  contact: string;
  regDate: string;
  status: 'Active' | 'Critical' | 'Discharged';
}

@Component({
  selector: 'app-all-patients',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './all-patients.html',
  styleUrl: './all-patients.css',
})
export class AllPatients {
  genderFilter = signal<string>('All');
  ageRangeFilter = signal<string>('Any');
  bloodGroupFilter = signal<string>('All');
  departmentFilter = signal<string>('All');
  statusFilter = signal<string>('Any');
  regDateFilter = signal<string>('');
  searchTerm = signal<string>('');

  rowsPerPage = signal<number>(10);
  currentPage = signal<number>(1);
  totalPatients = signal<number>(1248);

  activeMenuId = signal<string | null>(null);

  patients = signal<Patient[]>([
    {
      id: '1',
      name: 'Albert H. Jenkins',
      avatar: 'https://i.pravatar.cc/40?img=12',
      gender: 'Male',
      age: 72,
      nationalId: '122-455-9008',
      bloodGroup: 'O+',
      weight: 84,
      assignedDoctor: 'Dr. Sarah Chen',
      department: 'Cardiology',
      contact: '+1 (555) 092-1144',
      regDate: 'Oct 12, 2023',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Elena Rodriguez',
      avatar: 'https://i.pravatar.cc/40?img=47',
      gender: 'Female',
      age: 29,
      nationalId: '098-223-1122',
      bloodGroup: 'AB-',
      weight: 62,
      assignedDoctor: 'Dr. Julian Vance',
      department: 'Internal Medicine',
      contact: '+1 (555) 902-8832',
      regDate: 'Nov 05, 2023',
      status: 'Critical',
    },
    {
      id: '3',
      name: 'Mark S. Thomson',
      avatar: 'https://i.pravatar.cc/40?img=33',
      gender: 'Male',
      age: 54,
      nationalId: '442-119-0032',
      bloodGroup: 'A+',
      weight: 91,
      assignedDoctor: 'Dr. Sarah Chen',
      department: 'Cardiology',
      contact: '+1 (555) 223-9090',
      regDate: 'Dec 20, 2023',
      status: 'Discharged',
    },
    {
      id: '4',
      name: 'Leo K. Walker',
      avatar: 'https://i.pravatar.cc/40?img=15',
      gender: 'Male',
      age: 8,
      nationalId: '667-210-4491',
      bloodGroup: 'B+',
      weight: 28,
      assignedDoctor: 'Dr. Amanda Lee',
      department: 'Pediatrics',
      contact: '+1 (555) 111-2233',
      regDate: 'Jan 02, 2024',
      status: 'Active',
    },
  ]);

  selectedIds = signal<Set<string>>(new Set());

  allSelected = computed(
    () => this.patients().length > 0 && this.patients().every((p) => this.selectedIds().has(p.id)),
  );

  rangeStart = computed(() => (this.currentPage() - 1) * this.rowsPerPage() + 1);
  rangeEnd = computed(() =>
    Math.min(this.currentPage() * this.rowsPerPage(), this.totalPatients()),
  );

  toggleAll(checked: boolean) {
    if (checked) {
      this.selectedIds.set(new Set(this.patients().map((p) => p.id)));
    } else {
      this.selectedIds.set(new Set());
    }
  }

  toggleOne(id: string, checked: boolean) {
    const next = new Set(this.selectedIds());
    checked ? next.add(id) : next.delete(id);
    this.selectedIds.set(next);
  }

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  toggleMenu(id: string) {
    this.activeMenuId.set(this.activeMenuId() === id ? null : id);
  }

  applyFilters() {
    // TODO: call service with current filter signals
    console.log({
      gender: this.genderFilter(),
      ageRange: this.ageRangeFilter(),
      bloodGroup: this.bloodGroupFilter(),
      department: this.departmentFilter(),
      status: this.statusFilter(),
      regDate: this.regDateFilter(),
    });
  }

  resetFilters() {
    this.genderFilter.set('All');
    this.ageRangeFilter.set('Any');
    this.bloodGroupFilter.set('All');
    this.departmentFilter.set('All');
    this.statusFilter.set('Any');
    this.regDateFilter.set('');
  }

  statusClasses(status: Patient['status']): string {
    switch (status) {
      case 'Active':
        return 'bg-secondary/10 text-secondary';
      case 'Critical':
        return 'bg-tertiary/10 text-tertiary';
      case 'Discharged':
        return 'bg-gray-100 text-gray-500';
    }
  }
}

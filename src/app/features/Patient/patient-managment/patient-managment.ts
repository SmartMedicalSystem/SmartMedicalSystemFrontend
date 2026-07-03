import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type PatientStatus = 'Active' | 'Inactive' | 'Pending';
 
export interface Patient {
  id: string;
  initials: string;
  name: string;
  dob: string;
  age: number;
  lastVisit: string;
  status: PatientStatus;
}
 
@Component({
  selector: 'app-patient-managment',
  imports:  [CommonModule , FormsModule],
  templateUrl: './patient-managment.html',
  styleUrl: './patient-managment.css',
})
export class PatientManagment {
  patients = signal<Patient[]>([
    { id: '#ME-9021', initials: 'AJ', name: 'Alice Johnson', dob: 'Mar 12, 1984', age: 40, lastVisit: 'Yesterday, 14:20', status: 'Active' },
    { id: '#ME-8842', initials: 'RK', name: 'Robert Kim',    dob: 'Jul 05, 1976', age: 47, lastVisit: 'Oct 24, 2023',    status: 'Inactive' },
    { id: '#ME-1025', initials: 'EL', name: 'Elena Lopez',   dob: 'Jan 18, 1992', age: 32, lastVisit: 'Pending Sync',    status: 'Pending' },
    { id: '#ME-7721', initials: 'MS', name: 'Marcus Smith',  dob: 'Nov 29, 1958', age: 65, lastVisit: '2 days ago',      status: 'Active' },
    { id: '#ME-3419', initials: 'SD', name: 'Sarah Davis',   dob: 'Sep 15, 1999', age: 24, lastVisit: 'Oct 30, 2023',    status: 'Inactive' },
    { id: '#ME-2188', initials: 'TW', name: 'Thomas Wright', dob: 'Dec 04, 1965', age: 58, lastVisit: 'Today, 09:15',    status: 'Active' },
  ]);
 
  totalPatients = signal(12482);
  activeNow = signal(3120);
  visitsToday = signal(142);
  urgentReview = signal(18);
 
  filterText = signal('');
  rowsPerPage = signal(15);
  currentPage = signal(1);
  totalCount = signal(12482);
 
  filteredPatients = computed(() => {
    const term = this.filterText().trim().toLowerCase();
    if (!term) return this.patients();
    return this.patients().filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term) ||
      p.status.toLowerCase().includes(term)
    );
  });
 
  rangeStart = computed(() => (this.currentPage() - 1) * this.rowsPerPage() + 1);
  rangeEnd = computed(() => Math.min(this.currentPage() * this.rowsPerPage(), this.totalCount()));
 
  statusClasses(status: PatientStatus): string {
    switch (status) {
      case 'Active':
        return 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]';
      case 'Pending':
        return 'bg-violet-100 text-violet-600';
      case 'Inactive':
      default:
        return 'bg-gray-100 text-gray-500';
    }
  }
 
  nextPage() {
    if (this.rangeEnd() < this.totalCount()) this.currentPage.update(p => p + 1);
  }
 
  prevPage() {
    if (this.currentPage() > 1) this.currentPage.update(p => p - 1);
  }
 
  onAdvancedFilters() {
   
    console.log('Open advanced filters');
  }
 
  onAddPatient() {
    console.log('Add patient');
  }
 
  

}

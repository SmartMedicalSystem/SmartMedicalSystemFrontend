import { Component, computed, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';


type PendingStatus = 'pending' | 'none';

interface Patient {
  id: string;
  name: string;
  avatarInitials: string;
  ssn: string;
  age: number;
  gender: 'Male' | 'Female';
  lastVisit: string;
  pendingStatus: PendingStatus;
}
@Component({
  selector: 'app-all-patients',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './all-patients.html',
  styleUrl: './all-patients.css',
})
export class AllPatients {
  urlContainsDoctor: boolean = false;
  constructor(private router: Router) {
    this.urlContainsDoctor = this.router.url.includes('doctor');
  }



  totalPatients = 1248;

  searchTerm = '';
  genderFilter = 'All Genders';
  ageGroupFilter = 'All Ages';
  lastVisitFilter = 'Any Time';
  statusFilter = 'All Statuses';

  genderOptions = ['All Genders', 'Male', 'Female'];
  ageGroupOptions = ['All Ages', '0-18', '19-35', '36-55', '56+'];
  lastVisitOptions = ['Any Time', 'Last 7 days', 'Last 30 days', 'Last 90 days'];
  statusOptions = ['All Statuses', 'Pending Reports', 'No Pending Reports'];

  rowsPerPage = signal(10);
  currentPage = signal(1);

  patients = signal<Patient[]>([
    {
      id: '#44920',
      name: 'Sarah J. Miller',
      avatarInitials: 'SM',
      ssn: '**-**-5821',
      age: 42,
      gender: 'Female',
      lastVisit: 'Oct 24, 2023',
      pendingStatus: 'pending',
    },
    {
      id: '#44831',
      name: 'Robert H. Dawson',
      avatarInitials: 'RD',
      ssn: '**-**-9912',
      age: 78,
      gender: 'Male',
      lastVisit: 'Oct 22, 2023',
      pendingStatus: 'none',
    },
    {
      id: '#44820',
      name: 'Kevin T. Wu',
      avatarInitials: 'KW',
      ssn: '**-**-2204',
      age: 29,
      gender: 'Male',
      lastVisit: 'Oct 21, 2023',
      pendingStatus: 'pending',
    },
    {
      id: '#44771',
      name: 'Elena Rodriguez',
      avatarInitials: 'ER',
      ssn: '**-**-1109',
      age: 36,
      gender: 'Female',
      lastVisit: 'Oct 19, 2023',
      pendingStatus: 'none',
    },
    {
      id: '#44755',
      name: 'Martha Stevens',
      avatarInitials: 'MS',
      ssn: '**-**-8433',
      age: 69,
      gender: 'Female',
      lastVisit: 'Oct 18, 2023',
      pendingStatus: 'none',
    },
  ]);

  totalRowsLabel = computed(() => {
    const start = (this.currentPage() - 1) * this.rowsPerPage() + 1;
    const end = Math.min(this.currentPage() * this.rowsPerPage(), this.totalPatients);
    return `${start} - ${end} of ${this.totalPatients}`;
  });

  applyFilters(): void {
    console.log('Applying filters', {
      search: this.searchTerm,
      gender: this.genderFilter,
      ageGroup: this.ageGroupFilter,
      lastVisit: this.lastVisitFilter,
      status: this.statusFilter,
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.genderFilter = 'All Genders';
    this.ageGroupFilter = 'All Ages';
    this.lastVisitFilter = 'Any Time';
    this.statusFilter = 'All Statuses';
  }

  openPatient(patient: Patient): void {
    console.log('Opening patient', patient.id);

    this.router.navigate(['/doctor/dashboard/patients/patient-details']);
  }

  editPatient(patient: Patient): void {
    console.log('Opening patient', patient.id);
    this.router.navigate(['/admin/dashboard/patients/edit-patients']);
  }

  onRowsPerPageChange(value: string): void {
    this.rowsPerPage.set(Number(value));
    this.currentPage.set(1);
  }

  goToFirstPage(): void {
    this.currentPage.set(1);
  }

  goToPrevPage(): void {
    this.currentPage.update((p) => Math.max(1, p - 1));
  }

  goToNextPage(): void {
    this.currentPage.update((p) => p + 1);
  }

  goToLastPage(): void {
    this.currentPage.set(Math.ceil(this.totalPatients / this.rowsPerPage()));
  }
}

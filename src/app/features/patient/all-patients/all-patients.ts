import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PatientsService } from '../../../core/services/patient-service.service';
import { IPaginatedResponse } from '../../../shared/interfaces/Common/ipaginated-response';
import { Patient } from '../../../shared/interfaces/Patient/patient.interface';


@Component({
  selector: 'app-all-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './all-patients.html',
  styleUrl: './all-patients.css',
})
export class AllPatients implements OnInit {
  urlContainsDoctor = false;

  constructor(
    private router: Router,
    private patientService: PatientsService
  ) {
    this.urlContainsDoctor = this.router.url.includes('doctor');
  }

  totalPatients = 0;
  totalPages = 1;
  hasNextPage = false;
  hasPreviousPage = false;

  searchTerm = '';
  genderFilter = 'All Genders';
  ageGroupFilter = 'All Ages';
  lastVisitFilter = 'Any Time';
  statusFilter = 'All Statuses';

  genderOptions = ['All Genders', 'Male', 'Female'];
  ageGroupOptions = ['All Ages', '0-18', '19-35', '36-55', '56+'];
  lastVisitOptions = [
    'Any Time',
    'Last 7 days',
    'Last 30 days',
    'Last 90 days',
  ];
  statusOptions = [
    'All Statuses',
    'Pending Reports',
    'No Pending Reports',
  ];

  rowsPerPage = signal(10);
  currentPage = signal(1);

  patients = signal<Patient[]>([]);
  allPatients: Patient[] = [];

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService
      .getAllPatient(this.currentPage(), this.rowsPerPage())
      .subscribe({
        next: (response: IPaginatedResponse<Patient>) => {

          this.allPatients = [...response.items];
          this.patients.set(response.items);

          this.totalPatients = response.totalCount;
          this.totalPages = response.totalPages;
          this.hasNextPage = response.hasNextPage;
          this.hasPreviousPage = response.hasPreviousPage;
        },
        error: (err) => {
          console.error('Error loading patients:', err);
        },
      });
  }

  totalRowsLabel = computed(() => {
    if (this.totalPatients === 0) {
      return '0 - 0 of 0';
    }

    const start = (this.currentPage() - 1) * this.rowsPerPage() + 1;
    const end = Math.min(
      this.currentPage() * this.rowsPerPage(),
      this.totalPatients
    );

    return `${start} - ${end} of ${this.totalPatients}`;
  });

  applyFilters(): void {

    let filtered = [...this.allPatients];

    // ================= Search =================

    if (this.searchTerm.trim()) {

      const search = this.searchTerm.toLowerCase();

      filtered = filtered.filter(patient =>
        patient.firstName.toLowerCase().includes(search) ||
        patient.lastName.toLowerCase().includes(search) ||
        patient.nationalId.includes(search)
      );

    }

    // ================= Gender =================

    if (this.genderFilter !== 'All Genders') {

      filtered = filtered.filter(patient => {

        if (

          patient.gender === 'Male'
        ) {
          return this.genderFilter === 'Male';
        }

        if (

          patient.gender === 'Female'
        ) {
          return this.genderFilter === 'Female';
        }

        return false;

      });

    }

    // ================= Age =================

    if (this.ageGroupFilter !== 'All Ages') {

      filtered = filtered.filter(patient => {

        switch (this.ageGroupFilter) {

          case '0-18':
            return patient.age <= 18;

          case '19-35':
            return patient.age >= 19 && patient.age <= 35;

          case '36-55':
            return patient.age >= 36 && patient.age <= 55;

          case '56+':
            return patient.age >= 56;

          default:
            return true;

        }

      });

    }

    this.patients.set(filtered);

    this.totalPatients = filtered.length;

  }

  resetFilters(): void {

    this.searchTerm = '';
    this.genderFilter = 'All Genders';
    this.ageGroupFilter = 'All Ages';
    this.lastVisitFilter = 'Any Time';
    this.statusFilter = 'All Statuses';

    this.patients.set(this.allPatients);

    this.totalPatients = this.allPatients.length;

  }

  openPatient(patient: Patient): void {
    console.log(patient);

    this.router.navigate([
      '/doctor/dashboard/patients/patient-details',
      patient.id,
    ]);
  }

  editPatient(patient: Patient): void {
    console.log(patient);

    this.router.navigate([
      '/admin/dashboard/patients/edit-patients',
      patient.id,
    ]);
  }

  onRowsPerPageChange(value: string): void {
    this.rowsPerPage.set(Number(value));
    this.currentPage.set(1);
    this.loadPatients();
  }

  goToFirstPage(): void {
    if (this.currentPage() === 1) return;

    this.currentPage.set(1);
    this.loadPatients();
  }

  goToPrevPage(): void {
    if (!this.hasPreviousPage) return;

    this.currentPage.update((page) => page - 1);
    this.loadPatients();
  }

  goToNextPage(): void {
    if (!this.hasNextPage) return;

    this.currentPage.update((page) => page + 1);
    this.loadPatients();
  }

  goToLastPage(): void {
    if (this.currentPage() === this.totalPages) return;

    this.currentPage.set(this.totalPages);
    this.loadPatients();
  }
}
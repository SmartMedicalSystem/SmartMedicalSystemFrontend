import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { DoctorService } from '../../../core/services/doctor-service.service';
import { Patient as ApiPatient } from '../../../shared/interfaces/Doctor/patient.interface';

// TODO: تأكد من ترتيب enum BloodType الفعلي في الباك (Domain.Enums.BloodType)
// وعدّل الترتيب هنا لو مختلف — نفس الملاحظة المتكررة في patient-details.ts
const BLOOD_TYPE_MAP: Record<string, string> = {
  APositive: 'A+',
  ANegative: 'A-',
  BPositive: 'B+',
  BNegative: 'B-',
  ABPositive: 'AB+',
  ABNegative: 'AB-',
  OPositive: 'O+',
  ONegative: 'O-',
};

function displayBloodType(raw: string | null | undefined): string {
  if (!raw) return 'Unknown';
  return BLOOD_TYPE_MAP[raw] ?? raw;
}

interface DisplayPatient {
  id: number;
  name: string;
  avatarInitials: string;
  ssn: string;
  age: number;
  gender: string;
  bloodType: string;
}

@Component({
  selector: 'app-all-patients',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './all-patients.html',
  styleUrl: './all-patients.css',
})
export class AllPatients implements OnInit {

  urlContainsDoctor = false;

  constructor(
    private router: Router,
    private doctorService: DoctorService
  ) {
    this.urlContainsDoctor = this.router.url.includes('doctor');
  }

  loading = signal(true);
  loadError = signal<string | null>(null);

  searchTerm = '';
  genderFilter = 'All Genders';
  ageGroupFilter = 'All Ages';

  genderOptions = ['All Genders', 'Male', 'Female'];
  ageGroupOptions = ['All Ages', '0-18', '19-35', '36-55', '56+'];

  rowsPerPage = signal(10);
  currentPage = signal(1);
  totalCount = signal(0);
  totalPages = signal(1);

  patients = signal<DisplayPatient[]>([]);

  totalRowsLabel = computed(() => {
    if (this.totalCount() === 0) return '0 of 0';
    const start = (this.currentPage() - 1) * this.rowsPerPage() + 1;
    const end = Math.min(this.currentPage() * this.rowsPerPage(), this.totalCount());
    return `${start} - ${end} of ${this.totalCount()}`;
  });

   // ========== AI Chat ==========
  // ملحوظة: هنا بس patientId بتتبعت null دايمًا (مش مربوطة بمريض معين)،
  // عكس نفس الشات في patient-details اللي بتبعت patientId حقيقي.
  chatOpen = signal(false);
  chatLoading = signal(false);
  chatInput = signal('');

  chatMessages = signal<
    {
      role: 'user' | 'ai';
      content: string;
    }[]
  >([
    {
      role: 'ai',
      content: 'Hello, I am your AI medical assistant. Ask me anything.',
    },
  ]);

  ngOnInit(): void {
    this.fetchPatients();
  }

  fetchPatients(): void {
    this.loading.set(true);
    this.loadError.set(null);

    this.doctorService.getAllPatients(
      this.currentPage(),
      this.rowsPerPage(),
      this.searchTerm || undefined,
      this.genderFilter === 'All Genders' ? undefined : this.genderFilter,
      this.getMinAge(),
      this.getMaxAge()
    )
    .pipe(finalize(() => this.loading.set(false)))
    .subscribe({
      next: (res) => {
        this.patients.set(res.items.map(p => this.toDisplayPatient(p)));
        this.totalCount.set(res.totalCount);
        this.totalPages.set(res.totalPages || 1);
      },
      error: () => {
        this.loadError.set('تعذر تحميل بيانات المرضى.');
      }
    });
  }

  private toDisplayPatient(p: ApiPatient): DisplayPatient {
    return {
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      avatarInitials: `${p.firstName.charAt(0)}${p.lastName.charAt(0)}`.toUpperCase(),
      ssn: this.maskNationalId(p.nationalId),
      age: p.age,
      // الباك اند بيرجّع gender كـ string جاهزة ("Male"/"Female")، فمفيش داعي
      // لأي تحويل رقمي هنا (patient.interface.ts: gender: string).
      gender: p.gender,
      bloodType: BLOOD_TYPE_MAP[p.bloodType] ?? 'Unknown',
    };
  }

  private maskNationalId(id: number): string {
    const str = String(id);
    return str.length > 4 ? `**-**-${str.slice(-4)}` : str;
  }

  private getMinAge(): number | undefined {
    switch (this.ageGroupFilter) {
      case '0-18': return 0;
      case '19-35': return 19;
      case '36-55': return 36;
      case '56+': return 56;
      default: return undefined;
    }
  }

  private getMaxAge(): number | undefined {
    switch (this.ageGroupFilter) {
      case '0-18': return 18;
      case '19-35': return 35;
      case '36-55': return 55;
      default: return undefined;
    }
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.fetchPatients();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.genderFilter = 'All Genders';
    this.ageGroupFilter = 'All Ages';
    this.currentPage.set(1);
    this.fetchPatients();
  }

  openPatient(patient: DisplayPatient): void {
    this.router.navigate(['/doctor/dashboard/patients/patient-details', patient.id]);
  }

  editPatient(patient: DisplayPatient): void {
    this.router.navigate(['/admin/dashboard/patients/edit-patients', patient.id]);
  }

  onRowsPerPageChange(value: string): void {
    this.rowsPerPage.set(Number(value));
    this.currentPage.set(1);
    this.fetchPatients();
  }

  goToFirstPage(): void {
    if (this.currentPage() === 1) return;
    this.currentPage.set(1);
    this.fetchPatients();
  }

  goToPrevPage(): void {
    if (this.currentPage() <= 1) return;
    this.currentPage.update(p => p - 1);
    this.fetchPatients();
  }

  goToNextPage(): void {
    if (this.currentPage() >= this.totalPages()) return;
    this.currentPage.update(p => p + 1);
    this.fetchPatients();
  }

  goToLastPage(): void {
    if (this.currentPage() === this.totalPages()) return;
    this.currentPage.set(this.totalPages());
    this.fetchPatients();
  }

  // ========== AI Chat Methods ==========

  toggleChat(): void {
    this.chatOpen.update((value) => !value);
  }

  sendChatMessage(): void {
    const question = this.chatInput().trim();

    if (!question || this.chatLoading()) {
      return;
    }

    this.chatMessages.update((messages) => [
      ...messages,
      {
        role: 'user',
        content: question,
      },
    ]);

    this.chatInput.set('');
    this.chatLoading.set(true);

    this.doctorService
      .askPatientAI({
        patientId: null, // ← الفرق الوحيد عن patient-details: هنا دايمًا null
        question: question,
      })
      .pipe(finalize(() => this.chatLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.chatMessages.update((messages) => [
            ...messages,
            {
              role: 'ai',
              content: response.answer,
            },
          ]);
        },
        error: () => {
          this.chatMessages.update((messages) => [
            ...messages,
            {
              role: 'ai',
              content: 'Sorry, something went wrong while contacting AI.',
            },
          ]);
        },
      });
  }
}

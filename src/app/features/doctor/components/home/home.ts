import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin, catchError, of } from 'rxjs';
import { DoctorService, DoctorReadDto } from '../../../../core/services/doctor-service.service';
import { AuthenticationService } from '../../../../core/services/authenticationService.service';
import { getCurrentDoctorIdFromToken } from '../../../../core/utils/jwt-utils';
import { PatientResultReadDto, PatinetResultAIReportStatus } from '../../../../shared/interfaces/Doctor/patient-result.interface';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  constructor(
    private doctorService: DoctorService,
    private authService: AuthenticationService
  ) {}

  loading = signal(true);
  loadError = signal<string | null>(null);

  doctor = signal<DoctorReadDto | null>(null);
  totalPatients = signal<number | null>(null);
  totalLabTests = signal<number | null>(null);
  patientResults = signal<PatientResultReadDto[]>([]);

  PatinetResultAIReportStatus = PatinetResultAIReportStatus;

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
    const token = this.authService.getAccessToken();
    const doctorId = getCurrentDoctorIdFromToken(token);

    if (!doctorId) {
      this.loadError.set('Could not determine the current doctor from the session.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.loadError.set(null);

    forkJoin({
      doctor: this.doctorService.getDoctorById(doctorId).pipe(
        catchError((err) => {
          console.error('Error fetching doctor profile', err);
          return of(null);
        })
      ),
      patients: this.doctorService.getAllPatients(1, 1).pipe(
        catchError((err) => {
          console.error('Error fetching patients count', err);
          return of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 1, totalPages: 0 });
        })
      ),
      labTests: this.doctorService.getLabTests(1, 1).pipe(
        catchError((err) => {
          console.error('Error fetching lab tests count', err);
          return of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 1, totalPages: 0 });
        })
      ),
      results: this.doctorService.getPatientResultsByDoctor(doctorId, 1, 20).pipe(
        catchError((err) => {
          console.error('Error fetching doctor patient results', err);
          return of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 20, totalPages: 0 });
        })
      ),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ doctor, patients, labTests, results }) => {
          if (doctor) {
            this.doctor.set(doctor);
          }
          this.totalPatients.set(patients ? patients.totalCount : 0);
          this.totalLabTests.set(labTests ? labTests.totalCount : 0);
          this.patientResults.set(results && results.items ? results.items : []);
        },
        error: (err) => {
          console.error('Unexpected error loading dashboard data', err);
          this.loadError.set('Failed to load dashboard data.');
        },
      });
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
        groupByPatient: true
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

import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { finalize, forkJoin, catchError, of, filter, Subscription } from 'rxjs';
import { DoctorService, DoctorReadDto } from '../../../../core/services/doctor-service.service';
import { AuthenticationService } from '../../../../core/services/authenticationService.service';
import { getCurrentDoctorIdFromToken } from '../../../../core/utils/jwt-utils';
import { PatientResultReadDto, PatinetResultAIReportStatus } from '../../../../shared/interfaces/Doctor/patient-result.interface';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  private routerSub?: Subscription;

  constructor(
    private doctorService: DoctorService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  loading = signal(true);
  loadError = signal<string | null>(null);

  doctor = signal<DoctorReadDto | null>(null);
  totalPatients = signal<number | null>(null);
  totalLabTests = signal<number | null>(null);
  patientResults = signal<PatientResultReadDto[]>([]);

  PatinetResultAIReportStatus = PatinetResultAIReportStatus;

  isApprovedStatus(status: any): boolean {
    if (status === PatinetResultAIReportStatus.Approved || status === 2 || status === 'Approved' || status === '2') {
      return true;
    }
    return false;
  }

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
    // Initial load
    this.loadDashboard();

    // Re-load patient results every time navigation ends on this page
    // so status changes from the review page are reflected immediately.
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if ((event.url as string).includes('/doctor/dashboard/home')) {
        this.reloadPatientResults();
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private loadDashboard(): void {
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
        catchError(err => {
          console.error('Error fetching doctor by ID', err);
          return of(null);
        })
      ),
      patients: this.doctorService.getAllPatients(1, 100).pipe(
        catchError(err => {
          console.error('Error fetching patients count', err);
          return of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0, hasNextPage: false, hasPreviousPage: false, firstItemIndex: 0, lastItemIndex: 0 });
        })
      ),
      labTests: this.doctorService.getLabTests(1, 100).pipe(
        catchError(err => {
          console.error('Error fetching lab tests count', err);
          return of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0, hasNextPage: false, hasPreviousPage: false, firstItemIndex: 0, lastItemIndex: 0 });
        })
      ),
      results: this.doctorService.getPatientResultsByDoctor(doctorId, 1, 50).pipe(
        catchError((err) => {
          console.error('Error fetching doctor patient results', err);
          return of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 50, totalPages: 0 });
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

          const patientMap = new Map<number, string>();
          if (patients && patients.items) {
            patients.items.forEach((p: any) => {
              const name = `${p.firstName || ''} ${p.lastName || ''}`.trim();
              if (name && p.id) {
                patientMap.set(p.id, name);
              }
            });
          }

          const labTestMap = new Map<number, string>();
          if (labTests && labTests.items) {
            labTests.items.forEach((lt: any) => {
              if (lt.id && lt.testName) {
                labTestMap.set(lt.id, lt.testName);
              }
            });
          }

          const mappedResults = (results && results.items ? results.items : []).map(r => {
            const pName = r.patientName || patientMap.get(r.patientId) || '';
            const ltName = r.labTestName || labTestMap.get(r.labTestId) || '';
            return {
              ...r,
              patientName: pName,
              labTestName: ltName
            };
          });

          // Resolve any remaining missing patient names or lab test names individually
          mappedResults.forEach(r => {
            if (!r.patientName && r.patientId) {
              this.doctorService.getPatientById(r.patientId).subscribe({
                next: (p) => {
                  const resolved = `${p.firstName || ''} ${p.lastName || ''}`.trim();
                  if (resolved) {
                    this.patientResults.update(list =>
                      list.map(item => item.id === r.id ? { ...item, patientName: resolved } : item)
                    );
                  }
                }
              });
            }

            if (!r.labTestName && r.labTestId) {
              this.doctorService.getLabTestById(r.labTestId).subscribe({
                next: (lt) => {
                  if (lt.testName) {
                    this.patientResults.update(list =>
                      list.map(item => item.id === r.id ? { ...item, labTestName: lt.testName } : item)
                    );
                  }
                }
              });
            }

            if (!r.sessionDate && r.sessionId) {
              this.doctorService.getSessionById(r.sessionId).subscribe({
                next: (s) => {
                  if (s && s.sessionDate) {
                    this.patientResults.update(list =>
                      list.map(item => item.id === r.id ? { ...item, sessionDate: s.sessionDate } : item)
                    );
                  }
                }
              });
            }
          });

          const sorted = mappedResults
            .slice()
            .sort((a, b) => {
              const aApp = this.isApprovedStatus(a.aiReportStatus);
              const bApp = this.isApprovedStatus(b.aiReportStatus);
              if (aApp && !bApp) return 1;
              if (!aApp && bApp) return -1;
              return b.id - a.id;
            });
          this.patientResults.set(sorted);
        },
        error: (err) => {
          console.error('Unexpected error loading dashboard data', err);
          this.loadError.set('Failed to load dashboard data.');
        },
      });
  }

  private reloadPatientResults(): void {
    const token = this.authService.getAccessToken();
    const doctorId = getCurrentDoctorIdFromToken(token);
    if (!doctorId) return;

    forkJoin({
      patients: this.doctorService.getAllPatients(1, 100).pipe(catchError(() => of({ items: [] }))),
      labTests: this.doctorService.getLabTests(1, 100).pipe(catchError(() => of({ items: [] }))),
      results: this.doctorService.getPatientResultsByDoctor(doctorId, 1, 50).pipe(
        catchError(err => {
          console.error('Error refreshing patient results', err);
          return of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 50, totalPages: 0 });
        })
      )
    }).subscribe(({ patients, labTests, results }) => {
      const patientMap = new Map<number, string>();
      if (patients && (patients as any).items) {
        (patients as any).items.forEach((p: any) => {
          const name = `${p.firstName || ''} ${p.lastName || ''}`.trim();
          if (name && p.id) patientMap.set(p.id, name);
        });
      }

      const labTestMap = new Map<number, string>();
      if (labTests && (labTests as any).items) {
        (labTests as any).items.forEach((lt: any) => {
          if (lt.id && lt.testName) labTestMap.set(lt.id, lt.testName);
        });
      }

      const mappedResults = (results && results.items ? results.items : []).map(r => ({
        ...r,
        patientName: r.patientName || patientMap.get(r.patientId) || '',
        labTestName: r.labTestName || labTestMap.get(r.labTestId) || ''
      }));

      mappedResults.forEach(r => {
        if (!r.patientName && r.patientId) {
          this.doctorService.getPatientById(r.patientId).subscribe({
            next: (p) => {
              const resolved = `${p.firstName || ''} ${p.lastName || ''}`.trim();
              if (resolved) {
                this.patientResults.update(list =>
                  list.map(item => item.id === r.id ? { ...item, patientName: resolved } : item)
                );
              }
            }
          });
        }
        if (!r.labTestName && r.labTestId) {
          this.doctorService.getLabTestById(r.labTestId).subscribe({
            next: (lt) => {
              if (lt.testName) {
                this.patientResults.update(list =>
                  list.map(item => item.id === r.id ? { ...item, labTestName: lt.testName } : item)
                );
              }
            }
          });
        }
        if (!r.sessionDate && r.sessionId) {
          this.doctorService.getSessionById(r.sessionId).subscribe({
            next: (s) => {
              if (s && s.sessionDate) {
                this.patientResults.update(list =>
                  list.map(item => item.id === r.id ? { ...item, sessionDate: s.sessionDate } : item)
                );
              }
            }
          });
        }
      });

      const sorted = mappedResults
        .slice()
        .sort((a, b) => {
          const aApp = this.isApprovedStatus(a.aiReportStatus);
          const bApp = this.isApprovedStatus(b.aiReportStatus);
          if (aApp && !bApp) return 1;
          if (!aApp && bApp) return -1;
          return b.id - a.id;
        });
      this.patientResults.set(sorted);
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

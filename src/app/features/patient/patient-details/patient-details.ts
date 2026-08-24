import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { DoctorService } from '../../../core/services/doctor-service.service';
import { PatientResultReadDto, PatinetResultAIReportStatus, PatientResultUpdateDto } from '../../../shared/interfaces/Doctor/patient-result.interface';
import { PatientResultElementDto } from '../../../shared/interfaces/Doctor/patient-result-element.interface';
import {
  PatientFullAIReportDto,
  PatientResultAIAnalysisDto,
} from '../../../shared/interfaces/Doctor/patient-ai-report.interface';
import { Patient as ApiPatient } from '../../../shared/interfaces/Doctor/patient.interface';
import { SessionReadDto } from '../../../shared/interfaces/Doctor/session.interface';
import { AuthenticationService } from '../../../core/services/authenticationService.service';
import { getCurrentDoctorIdFromToken } from '../../../core/utils/jwt-utils';
import {
  getActiveSessionId,
  clearActiveSessionId,
} from '../../../core/utils/active-session-storage';

interface DisplayPatient {
  name: string;
  ssn: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  address: string;
}

type SectionId = 'personal' | 'lab' | 'ai' | 'sessions';

// ⚠️ bloodType بيرجع من الباك كـ string (اسم الـ enum زي gender بالظبط)، مش
// رقم. المفاتيح هنا لازم تتأكد إنها مطابقة تمامًا لأسامي Domain.Enums.BloodType
// الحقيقية (خمّنت الأسامي الشائعة: APositive/ANegative/... إلخ - لو مختلفة
// عندك، عدّل المفاتيح بس، مش القيم).
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

// لو مالقتش القيمة في الماب فوق (اسم مختلف عن المتوقع)، نعرض القيمة الخام
// اللي راجعة من الباك بدل "Unknown" علشان الداتا الحقيقية تفضل بايظة على
// الشاشة وتكون سهلة نلاحظها ونصلح المفتاح المطابق بدل ما تختفي تمامًا.
function displayBloodType(raw: string | null | undefined): string {
  if (!raw) return 'Unknown';
  return BLOOD_TYPE_MAP[raw] ?? raw;
}

@Component({
  selector: 'app-patient-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-details.html',
  styleUrl: './patient-details.css',
})
export class PatientDetails implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private authService: AuthenticationService
  ) {}


  // ========== AI Chat ==========

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
      content: 'Hello, I am your AI medical assistant. Ask me anything about this patient.'
    }
  ]);


  loading = signal(true);

  loadError = signal<string | null>(null);

  patientId!: number;

  // الـ session النشطة الحالية (لو اتعملت) — بتحدد شكل الـ Quick Actions
  activeSessionId = signal<number | null>(null);

  // ---------- Patient summary (من PatientReadDto الحقيقي) ----------
  patient = signal<DisplayPatient>({
    name: '',
    ssn: '',
    age: 0,
    gender: '',
    bloodGroup: '',
    phone: '',
    address: '',
  });

  avatarInitials = computed(() => {
    const name = this.patient().name.trim();
    if (!name) return '';
    const parts = name.split(' ');
    return `${parts[0]?.charAt(0) ?? ''}${parts[1]?.charAt(0) ?? ''}`.toUpperCase();
  });

  // ---------- Doctor الحالي اللي فاتح ملف المريض ده (من التوكن) ----------
  currentDoctorName = signal<string>('');

  // ---------- Sessions (من SessionsController.GetByPatient) ----------
  loadingSessions = signal(true);
  sessions = signal<SessionReadDto[]>([]);

  lastVisitLabel = computed(() => {
    const list = this.sessions();
    if (list.length === 0) return 'No visits yet';
    const latest = [...list].sort(
      (a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
    )[0];
    return new Date(latest.sessionDate).toLocaleDateString();
  });

  // ---------- Laboratory Results ----------
  // الـ PatientResults تُستخدم لمعرفة النتائج الموجودة فعليًا ولتشغيل AI analysis.
  // تفاصيل عناصر التحليل المعروضة في الجدول تأتي من PatientAIReports/full-report
  // كـ PatientResultElementSummaryDto.
  loadingResults = signal(true);
  resultsError = signal<string | null>(null);
  labResults = signal<PatientResultReadDto[]>([]);

  // ---------- AI Reports (من PatientAIReportsController) ----------
  loadingAiReport = signal(true);
  aiReportError = signal<string | null>(null);
  aiReport = signal<PatientFullAIReportDto | null>(null);
  generatingResultId = signal<number | null>(null);

  PatinetResultAIReportStatus = PatinetResultAIReportStatus;

  // ---------- Overall Summary Editing ----------
  isEditingOverallSummary = signal(false);
  editOverallSummaryContent = signal('');
  savingOverallSummary = signal(false);
  overallSummarySuccess = signal<string | null>(null);

  toggleEditOverallSummary(): void {
    if (!this.isEditingOverallSummary()) {
      this.editOverallSummaryContent.set(this.aiReport()?.overallAISummary || '');
    }
    this.isEditingOverallSummary.update(v => !v);
  }

  saveOverallSummary(): void {
    if (!this.patientId) return;
    this.savingOverallSummary.set(true);
    this.overallSummarySuccess.set(null);
    const content = this.editOverallSummaryContent();
    this.doctorService.updateStoredFullPatientReport(this.patientId, { content }).subscribe({
      next: () => {
        if (this.aiReport()) {
          this.aiReport.update(r => r ? { ...r, overallAISummary: content } : null);
        }
        this.savingOverallSummary.set(false);
        this.isEditingOverallSummary.set(false);
        this.overallSummarySuccess.set('Overall AI Report updated successfully!');
      },
      error: () => {
        this.savingOverallSummary.set(false);
      }
    });
  }

  // ---------- Per-Result AI Analysis Editing ----------
  editingResultId = signal<number | null>(null);
  editResultSummary = signal('');
  editResultClassifiedReport = signal('');
  editResultSuggestion = signal('');
  savingResultEdit = signal(false);

  startEditResult(analysis: PatientResultAIAnalysisDto): void {
    this.editingResultId.set(analysis.patientResultId);
    this.editResultSummary.set(analysis.summary || '');
    this.editResultClassifiedReport.set(analysis.aiClassifiedReport || '');
    this.editResultSuggestion.set(analysis.aiSuggestion || '');
  }

  cancelEditResult(): void {
    this.editingResultId.set(null);
  }

  saveResultEditAndApprove(resultId: number): void {
    this.savingResultEdit.set(true);
    const dto: PatientResultUpdateDto = {
      summary: this.editResultSummary(),
      aIClassifiedReport: this.editResultClassifiedReport(),
      aISuggestion: this.editResultSuggestion()
    };

    this.doctorService.updatePatientResult(resultId, dto).subscribe({
      next: () => {
        this.doctorService.updatePatientResultStatus(resultId, { status: PatinetResultAIReportStatus.Approved }).subscribe({
          next: () => {
            this.savingResultEdit.set(false);
            this.editingResultId.set(null);
            this.loadAiReport(this.patientId);
            this.loadPatientResults(this.patientId);
          },
          error: () => {
            this.savingResultEdit.set(false);
            this.editingResultId.set(null);
            this.loadAiReport(this.patientId);
          }
        });
      },
      error: () => {
        this.savingResultEdit.set(false);
      }
    });
  }

  approveResultOnly(resultId: number): void {
    this.doctorService.updatePatientResultStatus(resultId, { status: PatinetResultAIReportStatus.Approved }).subscribe({
      next: () => {
        this.loadAiReport(this.patientId);
        this.loadPatientResults(this.patientId);
      }
    });
  }

  pendingAiAnalysisCount = computed(() => {
    const analyzedIds = new Set(
      (this.aiReport()?.results ?? []).map((r) => r.patientResultId)
    );
    return this.labResults().filter((r) => !analyzedIds.has(r.id)).length;
  });

  labElementCount = computed(() =>
    (this.aiReport()?.results ?? []).reduce(
      (total, result) => total + this.getElementSummaries(result).length,
      0
    )
  );

  // ---------- Accordion state ----------
  openSections = signal<Set<SectionId>>(new Set<SectionId>(['personal']));
  isOpen(section: SectionId): boolean {
    return this.openSections().has(section);
  }
  toggleSection(section: SectionId): void {
    this.openSections.update((current) => {
      const next = new Set(current);
      next.has(section) ? next.delete(section) : next.add(section);
      return next;
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (!id) {
      this.loadError.set('Invalid patient ID.');
      this.loading.set(false);
      this.loadingResults.set(false);
      this.loadingAiReport.set(false);
      this.loadingSessions.set(false);
      return;
    }

    this.patientId = id;
    this.activeSessionId.set(getActiveSessionId(id));

    this.loading.set(true);
    this.loadError.set(null);

    this.doctorService
      .getPatientById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (p) => this.patient.set(this.toDisplayPatient(p)),
        error: () => this.loadError.set('Failed to load patient data.'),
      });

    this.loadCurrentDoctorName();
    this.loadPatientResults(id);
    this.loadAiReport(id);
    this.loadSessions(id);
  }

  private loadCurrentDoctorName(): void {
    const token = this.authService.getAccessToken();
    const doctorId = getCurrentDoctorIdFromToken(token);
    if (!doctorId) return;

    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (d) => this.currentDoctorName.set(d.name),
      error: () => {
        // مش حرج - لو فشل هنسيب الحقل فاضي بدل ما نكسر باقي الصفحة
      },
    });
  }

  private loadSessions(patientId: number): void {
    this.loadingSessions.set(true);
    this.doctorService
      .getSessionsByPatient(patientId, 1, 20)
      .pipe(finalize(() => this.loadingSessions.set(false)))
      .subscribe({
        next: (res) => this.sessions.set(res.items),
        error: () => {
          // مش حرج - lastVisitLabel هيرجع "No visits yet" لو الليست فاضية
        },
      });
  }

  private loadPatientResults(patientId: number): void {
    this.loadingResults.set(true);
    this.resultsError.set(null);

    this.doctorService
      .getPatientResultsByPatient(patientId, 1, 100)
      .pipe(finalize(() => this.loadingResults.set(false)))
      .subscribe({
        next: (res) => this.labResults.set(res.items),
        error: () => this.resultsError.set('Failed to load laboratory results.'),
      });
  }

  private loadAiReport(patientId: number): void {
    this.loadingAiReport.set(true);
    this.aiReportError.set(null);

    this.doctorService
      .getFullPatientAIReport(patientId)
      .pipe(finalize(() => this.loadingAiReport.set(false)))
      .subscribe({
        next: (report) => this.aiReport.set(report),
        error: () => this.aiReportError.set('Failed to load the AI report.'),
      });
  }

  getElementSummaries(result: PatientResultAIAnalysisDto): PatientResultElementDto[] {
    const raw = result as unknown as {
      elementSummaries?: PatientResultElementDto[];
      elements?: PatientResultElementDto[];
      resultElements?: PatientResultElementDto[];
    };

    return raw.elementSummaries ?? raw.elements ?? raw.resultElements ?? [];
  }

  getReportTestName(result: PatientResultAIAnalysisDto): string {
    const raw = result as unknown as {
      labTestName?: string;
      testName?: string;
      name?: string;
    };

    return raw.labTestName ?? raw.testName ?? raw.name ?? `Patient Result #${result.patientResultId}`;
  }

  getReportDate(result: PatientResultAIAnalysisDto): string {
    const raw = result as unknown as {
      resultDate?: string;
      testDate?: string;
      createdAt?: string;
      date?: string;
    };

    const value = raw.resultDate ?? raw.testDate ?? raw.createdAt ?? raw.date;
    return value ? new Date(value).toLocaleString() : '';
  }

  getFlagClass(flag: string): string {
    switch (flag?.toLowerCase()) {
      case 'low':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'normal':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getFlagDotClass(flag: string): string {
    switch (flag?.toLowerCase()) {
      case 'low':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      case 'normal':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  }

  generateAnalysisFor(result: PatientResultReadDto): void {
    this.generatingResultId.set(result.id);
    this.doctorService
      .generateAIAnalysisForResult(result.id)
      .pipe(finalize(() => this.generatingResultId.set(null)))
      .subscribe({
        next: () => this.loadAiReport(this.patientId),
        error: () => this.aiReportError.set('Failed to generate AI analysis for this result.'),
      });
  }

  analysisForResult(labResultId: number): PatientResultAIAnalysisDto | undefined {
    return this.aiReport()?.results.find((r) => r.patientResultId === labResultId);
  }

  private toDisplayPatient(p: ApiPatient): DisplayPatient {
    return {
      name: `${p.firstName} ${p.lastName}`,
      ssn: this.maskNationalId(p.nationalId),
      age: p.age,
      gender: p.gender,
      // bloodType هنا نوعه string دلوقتي (اسم enum) مش number
      bloodGroup: displayBloodType(p.bloodType as unknown as string),
      phone: String(p.mobileNumber),
      address: p.address,
    };
  }

  private maskNationalId(id: number): string {
    const str = String(id);
    return str.length > 4 ? `**-**-${str.slice(-4)}` : str;
  }

  // ---------- Actions ----------
  requestLabTest(): void {
    const sessionId = this.activeSessionId();
    if (sessionId) {
      this.router.navigate(['/doctor/dashboard/patients/new-lab-test', sessionId]);
    } else {
      this.createSession();
    }
  }

  createSession(): void {
    this.router.navigate(['/doctor/dashboard/patients/create-session', this.patientId]);
  }

  closeSession(): void {
    clearActiveSessionId(this.patientId);
    this.activeSessionId.set(null);
    // بعد قفل الـ session، الجدول الحقيقي للـ Sessions اتغيّر - نعيد تحميله
    this.loadSessions(this.patientId);
  }

   // ========== AI Chat Methods ==========

toggleChat(): void {
  this.chatOpen.update(value => !value);
}


sendChatMessage(): void {

  const question = this.chatInput().trim();


  if (!question || this.chatLoading()) {
    return;
  }


  // إضافة سؤال الدكتور للشات
  this.chatMessages.update(messages => [
    ...messages,
    {
      role: 'user',
      content: question
    }
  ]);


  // تفريغ الـ input
  this.chatInput.set('');


  // تشغيل loading
  this.chatLoading.set(true);


  this.doctorService
    .askPatientAI({
      patientId: this.patientId,
      question: question
    })
    .pipe(
      finalize(() => this.chatLoading.set(false))
    )
    .subscribe({

      next: (response) => {

        this.chatMessages.update(messages => [
          ...messages,
          {
            role: 'ai',
            content: response.answer
          }
        ]);

      },


      error: () => {

        this.chatMessages.update(messages => [
          ...messages,
          {
            role: 'ai',
            content: 'Sorry, something went wrong while contacting AI.'
          }
        ]);

      }

    });

}
}
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type LabStatus = 'critical' | 'normal' | 'pending';
type AiReportStatus = 'pending' | 'verified';

interface LabResult {
  test: string;
  lab: string;
  date: string;
  status: LabStatus;
}

interface AiReport {
  title: string;
  subtitle: string;
  reportId: string;
  confidence: number;
  status: AiReportStatus;
  summary: string;
  generatedOn: string;
  doctorNotes: string;
}

interface MedicalNote {
  doctorName: string;
  specialty: string;
  date: string;
  text: string;
}

interface HistoryEntry {
  date: string;
  title: string;
  doctor: string;
  description: string;
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
export class PatientDetails {
  constructor(private router: Router) { }

  // ---------- Patient summary ----------
  patient = {
    name: 'Sarah J. Miller',
    status: 'Active',
    ssn: '**-***-9812',
    age: 42,
    gender: 'Female',
    bloodGroup: 'B (Positive +)',
    phone: '+1 (555) 234-5678',
    assignedDoctor: 'Dr. Julian Vance',
    lastVisit: 'Oct 12, 2023',
    emergencyContactName: 'Robert Miller',
    emergencyContactRelation: 'Husband',
    emergencyContactPhone: '+1 (555) 987-6543',
  };

  stats = {
    totalLabTests: 48,
    pendingAiReports: 12,
    approvedReports: 36,
    lastResultDate: 'Oct 24, 2023',
  };

  // ---------- Personal / Patient Information ----------
  contactDetails = {
    address: '432 Bridgeton Ave, Springfield, OH 63928',
    phone: '+1 (555) 234-5678',
    email: 's.miller@email.com',
  };

  insurance = {
    provider: 'BlueShield Health Insurance',
    policyNumber: 'BSH-4092-1123',
  };

  // ---------- Laboratory Results ----------
  labResults = signal<LabResult[]>([
    { test: 'Comprehensive Metabolic Panel (CMP)', lab: 'Central Medical Lab', date: 'Oct 24, 2023', status: 'critical' },
    { test: 'Complete Blood Count (CBC)', lab: 'Central Medical Lab', date: 'Oct 20, 2023', status: 'normal' },
    { test: 'Lipid Panel', lab: 'Central Medical Lab', date: 'Oct 15, 2023', status: 'pending' },
  ]);

  // ---------- AI Reports ----------
  aiReports = signal<AiReport[]>([
    {
      title: 'Neurology Scan AI',
      subtitle: 'MRI Brain Scan Analysis',
      reportId: 'Report ID: AI-SCAN-6382',
      confidence: 94.2,
      status: 'pending',
      summary:
        'AI has detected early-stage markers of neuro-inflammation in the hippocampal region. Comparing with historical scans from 2021, there is a 5% increase in density observed.',
      generatedOn: 'Oct 25, 2023 - 11:03 PM',
      doctorNotes: '',
    },
  ]);

  // ---------- Medical Notes ----------
  medicalNotes = signal<MedicalNote[]>([
    {
      doctorName: 'Dr. Adrian Thorne',
      specialty: 'General Oncology',
      date: 'Sep 22, 2023',
      text: 'Patient reports occasional fatigue during physical activity, auscultation is clear. Blood pressure stable at 122/78. Continuing present regimen.',
    },
    {
      doctorName: 'Dr. Melissa Sharp',
      specialty: 'Laboratory Specialist',
      date: 'Sep 15, 2023',
      text: 'Some minor improvement noted. Adjusting supplement dosage to 40mg daily. Scheduled follow-up in 2 weeks.',
    },
  ]);

  newNoteText = '';

  // ---------- Patient History ----------
  historyEntries = signal<HistoryEntry[]>([
    { date: 'Oct 12, 2023', title: 'Annual Check-up', doctor: 'Dr. Julian Vance', description: 'Routine physical exam, vitals within normal range.' },
    { date: 'Jul 03, 2023', title: 'Follow-up Visit', doctor: 'Dr. Adrian Thorne', description: 'Reviewed lab results, adjusted medication dosage.' },
    { date: 'Feb 18, 2023', title: 'Lab Test - Full Panel', doctor: 'Central Medical Lab', description: 'Comprehensive blood work requested for routine screening.' },
  ]);

  // ---------- Accordion state ----------
  openSections = signal<Set<SectionId>>(new Set<SectionId>(['personal']));

  isOpen(section: SectionId): boolean {
    return this.openSections().has(section);
  }

  toggleSection(section: SectionId): void {
    this.openSections.update((current) => {
      const next = new Set(current);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
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
    this.loadLabTestNames();
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

  private loadLabTestNames(): void {
    this.doctorService.getLabTests(1, 100).subscribe({
      next: (res) => {
        const map: Record<number, string> = {};
        res.items.forEach((t) => (map[t.id] = t.testName));
        this.labTestNames.set(map);
      },
      error: () => { },
    });
  }

  private loadPatientResults(patientId: number): void {
    this.loadingResults.set(true);
    this.resultsError.set(null);

    this.doctorService
      .getPatientResultsByPatient(patientId)
      .pipe(finalize(() => this.loadingResults.set(false)))
      .subscribe({
        next: (res) => this.labResults.set(res.items),
        error: () => this.resultsError.set('Failed to load lab results.'),
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
    this.router.navigate(['/doctor/dashboard/patients/new-lab-test']);
  }

  exportReport(): void {
    console.log('Exporting patient report as PDF');
  }

  viewFullHistory(): void {
    console.log('Viewing full patient access history');
  }

  viewLabResult(result: LabResult): void {
    console.log('Viewing lab result', result.test);
  }

  requestNewAnalysis(): void {
    console.log('Requesting new lab analysis');
  }

  viewHistoricalTrends(): void {
    console.log('Viewing historical trends');
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
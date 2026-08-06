import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { DoctorService } from '../../../../core/services/doctor-service.service';
import {
  RequestLabsCreateDto,
  LabRequestPriority,
} from '../../../../shared/interfaces/Doctor/request-labs.interface';
import { LabTestReadDto } from '../../../../shared/interfaces/Doctor/lab-test.interface';
import { Patient as ApiPatient } from '../../../../shared/interfaces/Doctor/patient.interface';

interface LabTestOption {
  id: number;
  name: string;
}

interface DisplayPatient {
  name: string;
  ssn: string;
  age: number;
  gender: string;
  bloodGroup: string;
  contact: string;
}

// TODO: تأكد من ترتيب enum BloodType الفعلي في الباك (Domain.Enums.BloodType).
// ملحوظة: زي ما حصل مع Gender، ممكن الباك يرجعها هي كمان كـ string مش رقم.
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


const PRIORITY_OPTIONS: LabRequestPriority[] = ['Low', 'Normal', 'High', 'Urgent'];

@Component({
  selector: 'app-lab-test',
  imports: [CommonModule, FormsModule],
  templateUrl: './lab-test.html',
  styleUrl: './lab-test.css',
})
export class LabTest implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService
  ) {}

  // ---------- Session / Patient ----------
  // الروت new-lab-test/:id بياخد sessionId فعلي (جاي من create-session بعد
  // ما يتعمل، أو من أي مكان تاني بيحمل sessionId صحيح). مش patientId.
  // RequestLabsCreateDto.SessionId لازم يتحقق منه في الباك (Sessions.GetByIdAsync)،
  // فمينفعش نبعت patientId غلط هنا زي ما كان بيحصل قبل كده.
  sessionId!: number;
  patientId!: number;

  loadingPatient = signal(true);
  loadPatientError = signal<string | null>(null);

  priorityOptions = PRIORITY_OPTIONS;
  priority: LabRequestPriority = 'Normal';

  // ---------- Patient summary ----------
  patient = signal<DisplayPatient>({
    name: '',
    ssn: '',
    age: 0,
    gender: '',
    bloodGroup: '',
    contact: '',
  });

  // TODO: الحقول دي مش موجودة في PatientReadDto حاليًا — placeholder
  patientExtra = {
    assignedDoctor: 'Dr. Adrian Thorne',
    fileStatus: 'Active File',
  };

  // ---------- Laboratory Tests (multi-select) ----------
  // RequestLabsCreateDto.LabTestIds = List<int>, فبقت اختيار متعدد بدل select واحد
  // بتتجاب من LabTestsController.GetAll بدل ما تكون ثابتة
  labTestOptions = signal<LabTestOption[]>([]);
  loadingLabTests = signal(true);
  loadLabTestsError = signal<string | null>(null);

  selectedLabTestIds = new Set<number>();

  requestedDate: string = new Date().toISOString().slice(0, 10);

  submitting = signal(false);
  submitError = signal<string | null>(null);

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

  // الـ session النشطة الحالية (لو اتعملت) — بتحدد شكل الـ Quick Actions
  activeSessionId = signal<number | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (!id) {
      this.loadPatientError.set('Invalid session ID.');
      this.loadingPatient.set(false);
      return;
    }

    this.sessionId = id;
    this.resolvePatientFromSession(id);
    this.fetchLabTests();
  }

  // بيجيب السيشن الأول عشان ناخد منه patientId الصح، وبعدين يجيب بيانات المريض ده
  private resolvePatientFromSession(sessionId: number): void {
    this.loadingPatient.set(true);
    this.loadPatientError.set(null);

    this.doctorService.getSessionById(sessionId).subscribe({
      next: (session) => {
        this.patientId = session.patientId;

        this.doctorService
          .getPatientById(session.patientId)
          .pipe(finalize(() => this.loadingPatient.set(false)))
          .subscribe({
            next: (p) => this.patient.set(this.toDisplayPatient(p)),
            error: () => this.loadPatientError.set('Failed to load patient data.'),
          });
      },
      error: () => {
        this.loadingPatient.set(false);
        this.loadPatientError.set('Failed to load session data. Make sure a valid session was created first.');
      },
    });
  }

  private fetchLabTests(): void {
    this.loadingLabTests.set(true);
    this.loadLabTestsError.set(null);

    this.doctorService
      .getLabTests(1, 100)
      .pipe(finalize(() => this.loadingLabTests.set(false)))
      .subscribe({
        next: (res) => {
          this.labTestOptions.set(
            res.items.map((t: LabTestReadDto) => ({ id: t.id, name: t.testName }))
          );
        },
        error: () => this.loadLabTestsError.set('Failed to load the list of available lab tests.'),
      });
  }

  private toDisplayPatient(p: ApiPatient): DisplayPatient {
    return {
      name: `${p.firstName} ${p.lastName}`,
      ssn: this.maskNationalId(p.nationalId),
      age: p.age,
      gender: p.gender, // جاي جاهز كـ string ("Male"/"Female") من الباك
      bloodGroup: BLOOD_TYPE_MAP[p.bloodType] ?? 'Unknown',
      contact: String(p.mobileNumber),
    };
  }

  private maskNationalId(id: number): string {
    const str = String(id);
    return str.length > 4 ? `**-**-${str.slice(-4)}` : str;
  }

  isLabTestSelected(id: number): boolean {
    return this.selectedLabTestIds.has(id);
  }

  toggleLabTest(id: number): void {
    if (this.selectedLabTestIds.has(id)) {
      this.selectedLabTestIds.delete(id);
    } else {
      this.selectedLabTestIds.add(id);
    }
  }

  onCancel(): void {
    this.router.navigate(['/doctor/dashboard/patients/patient-details', this.patientId]);
  }

  onSubmit(): void {
    if (!this.sessionId) {
      this.submitError.set('No session is selected to create this request for.');
      return;
    }

    if (this.selectedLabTestIds.size === 0) {
      this.submitError.set('Select at least one lab test.');
      return;
    }

    const dto: RequestLabsCreateDto = {
      sessionId: this.sessionId,
      requestedAt: new Date(this.requestedDate).toISOString(),
      labTestIds: Array.from(this.selectedLabTestIds),
      priority: this.priority,
    };

    this.submitting.set(true);
    this.submitError.set(null);

    this.doctorService.createLabRequest(dto).subscribe({
      next: () => {
        this.submitting.set(false);
        this.onCancel();
      },
      error: () => {
        this.submitting.set(false);
        this.submitError.set('Failed to submit the lab request, please try again.');
      },
    });
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

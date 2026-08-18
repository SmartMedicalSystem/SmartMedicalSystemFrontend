import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import {
  DoctorService,
} from '../../../../core/services/doctor-service.service';
import { SessionCreateDto } from '../../../../shared/interfaces/Doctor/session.interface';
import { Patient as ApiPatient } from '../../../../shared/interfaces/Doctor/patient.interface';
import { AuthenticationService } from '../../../../core/services/authenticationService.service';
import { getCurrentDoctorIdFromToken } from '../../../../core/utils/jwt-utils';
import { setActiveSessionId } from '../../../../core/utils/active-session-storage';

interface DisplayPatient {
  name: string;
  ssn: string;
  age: number;
  gender: string;
}

@Component({
  selector: 'app-create-session',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-session.html',
  styleUrl: './create-session.css',
})
export class CreateSession implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private authService: AuthenticationService
  ) {}

  patientId!: number;
  doctorId!: number;
  deptId: number | null = null;

  loadingPatient = signal(true);
  loadPatientError = signal<string | null>(null);

  loadingDoctor = signal(true);
  loadDoctorError = signal<string | null>(null);

  patient = signal<DisplayPatient>({
    name: '',
    ssn: '',
    age: 0,
    gender: '',
  });

  sessionDate: string = new Date().toISOString().slice(0, 10);
  notes = '';

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
    const idParam = this.route.snapshot.paramMap.get('patientId');
    const id = idParam ? Number(idParam) : NaN;

    if (!id) {
      this.loadPatientError.set('Invalid patient ID.');
      this.loadingPatient.set(false);
      this.loadingDoctor.set(false);
      return;
    }

    this.patientId = id;
    this.fetchPatient(id);
    this.resolveDoctorAndDept();
  }

  private fetchPatient(id: number): void {
    this.loadingPatient.set(true);
    this.loadPatientError.set(null);

    this.doctorService
      .getPatientById(id)
      .pipe(finalize(() => this.loadingPatient.set(false)))
      .subscribe({
        next: (p) => this.patient.set(this.toDisplayPatient(p)),
        error: () => this.loadPatientError.set('Failed to load patient data.'),
      });
  }

  // doctorId بيتجاب من claims التوكن، وdeptId بيتجاب من سجل نفس الدكتور
  private resolveDoctorAndDept(): void {
    const token = this.authService.getAccessToken();
    const doctorId = getCurrentDoctorIdFromToken(token);

    if (!doctorId) {
      this.loadDoctorError.set('Could not determine the current doctor from the session.');
      this.loadingDoctor.set(false);
      return;
    }

    this.doctorId = doctorId;

    this.doctorService
      .getDoctorById(doctorId)
      .pipe(finalize(() => this.loadingDoctor.set(false)))
      .subscribe({
        next: (d) => (this.deptId = d.departmentId),
        error: () => this.loadDoctorError.set('Failed to load the doctor\'s department data.'),
      });
  }

  private toDisplayPatient(p: ApiPatient): DisplayPatient {
    return {
      name: `${p.firstName} ${p.lastName}`,
      ssn: this.maskNationalId(p.nationalId),
      age: p.age,
      gender: p.gender, // جاي جاهز كـ string ("Male"/"Female") من الباك
    };
  }

  private maskNationalId(id: number): string {
    const str = String(id);
    return str.length > 4 ? `**-**-${str.slice(-4)}` : str;
  }

  onCancel(): void {
    this.router.navigate(['/doctor/dashboard/patients/patient-details', this.patientId]);
  }

  onSubmit(): void {
    if (!this.doctorId || this.deptId === null) {
      this.submitError.set('Could not determine doctor data, please try again.');
      return;
    }

    if (!this.sessionDate) {
      this.submitError.set('Please select a session date.');
      return;
    }

    const dto: SessionCreateDto = {
      patientId: this.patientId,
      doctorId: this.doctorId,
      deptId: this.deptId,
      sessionDate: new Date(this.sessionDate).toISOString(),
      notes: this.notes || undefined,
    };

    this.submitting.set(true);
    this.submitError.set(null);

    this.doctorService.createSession(dto).subscribe({
      // نحفظ id السيشن اللي اتعمل كـ "active session" للمريض ده، عشان أي إجراء
      // تاني (زي طلب تحليل) يقدر يستخدمها من غير ما نعمل session جديدة كل مرة.
      // وبعدين نرجع لصفحة تفاصيل المريض بدل ما ننقل مباشرة لطلب تحليل.
      next: (createdSession) => {
        setActiveSessionId(this.patientId, createdSession.id);
        this.submitting.set(false);
        this.onCancel();
      },
      error: () => {
        this.submitting.set(false);
        this.submitError.set('Failed to create the session, please try again.');
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
      question: question,
      groupByPatient: false
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

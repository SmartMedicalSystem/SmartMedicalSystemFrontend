import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DoctorService } from '../../../../core/services/doctor-service.service';
import {
  PatientResultReadDto,
  PatientResultUpdateDto,
  PatinetResultAIReportStatus
} from '../../../../shared/interfaces/Doctor/patient-result.interface';
import { PatientFullAIReportDto } from '../../../../shared/interfaces/Doctor/patient-ai-report.interface';
import { catchError, of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-patient-result-detail',
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './patient-result-detail.html',
  styleUrl: './patient-result-detail.css',
})
export class PatientResultDetail implements OnInit {
  resultId = signal<number | null>(null);
  result = signal<PatientResultReadDto | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  actionMessage = signal<string | null>(null);

  /** Patient name fetched alongside the result */
  patientName = signal<string>('');
  /** Lab test name fetched alongside the result */
  labTestName = signal<string>('');
  /** Session test date fetched alongside the result */
  sessionDate = signal<string>('');

  // Edit fields for PatientResult AI report (per-result)
  isEditing = signal(false);
  editSummary = signal('');
  editClassifiedReport = signal('');
  editSuggestion = signal('');

  // Generating AI per-result analysis
  generatingAI = signal(false);

  // Full Patient AI Report state
  fullReport = signal<PatientFullAIReportDto | null>(null);
  storedFullReportContent = signal('');
  isEditingFullReport = signal(false);
  editFullReportContent = signal('');
  savingFullReport = signal(false);

  // Separate editing for Overall AI Summary and Overall AI Suggestion
  isEditingOverall = signal(false);
  editOverallSummary = signal('');
  editOverallSuggestion = signal('');
  savingOverall = signal(false);

  generatingFullReport = signal(false);

  PatinetResultAIReportStatus = PatinetResultAIReportStatus;

  isApprovedStatus(status: any): boolean {
    if (status === PatinetResultAIReportStatus.Approved || status === 2 || status === 'Approved' || status === '2') {
      return true;
    }
    return false;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.resultId.set(Number(idParam));
      this.loadResult(Number(idParam));
    } else {
      this.error.set('Invalid Result ID.');
      this.loading.set(false);
    }
  }

  loadResult(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.doctorService.getPatientResultById(id).subscribe({
      next: (res) => {
        this.result.set(res);

        // Resolve patient name: prefer backend-supplied patientName, fallback to getPatientById
        if (res.patientName) {
          this.patientName.set(res.patientName);
        } else if (res.patientId) {
          this.doctorService.getPatientById(res.patientId).subscribe({
            next: (p) => this.patientName.set(`${p.firstName || ''} ${p.lastName || ''}`.trim()),
            error: () => this.patientName.set('Patient')
          });
        }

        // Resolve lab test name: prefer backend-supplied labTestName, fallback to getLabTestById
        if (res.labTestName) {
          this.labTestName.set(res.labTestName);
        } else if (res.labTestId) {
          this.doctorService.getLabTestById(res.labTestId).subscribe({
            next: (lt) => this.labTestName.set(lt.testName),
            error: () => this.labTestName.set('Lab Test')
          });
        }

        // Resolve session test date: prefer backend-supplied sessionDate, fallback to getSessionById
        if (res.sessionDate) {
          this.sessionDate.set(res.sessionDate);
        } else if (res.sessionId) {
          this.doctorService.getSessionById(res.sessionId).subscribe({
            next: (s) => {
              if (s && s.sessionDate) {
                this.sessionDate.set(s.sessionDate);
              }
            }
          });
        }

        this.editSummary.set(res.summary || '');
        this.editClassifiedReport.set(res.aIClassifiedReport || '');
        this.editSuggestion.set(res.aISuggestion || '');
        this.loading.set(false);

        // If AI Classified Report or AI Suggestion are missing, auto-generate them
        if (!res.aIClassifiedReport || !res.aISuggestion) {
          this.generateAIAnalysis(false);
        }

        if (res.patientId) {
          this.loadFullReport(res.patientId);
        }
      },
      error: () => {
        this.error.set('Failed to load patient result details.');
        this.loading.set(false);
      }
    });
  }

  /** Calls the generate endpoint to get/create AI Classified Report & Suggestion */
  generateAIAnalysis(userTriggered = true): void {
    const id = this.resultId();
    if (!id) return;

    this.generatingAI.set(true);
    if (userTriggered) this.actionMessage.set(null);

    this.doctorService.generateAIAnalysisForResult(id).subscribe({
      next: (analysis) => {
        // Merge the generated AI fields into the existing result
        const current = this.result();
        if (current) {
          const updated: PatientResultReadDto = {
            ...current,
            aIClassifiedReport: analysis.aiClassifiedReport || current.aIClassifiedReport,
            aISuggestion: analysis.aiSuggestion || current.aISuggestion,
            summary: analysis.summary || current.summary,
          };
          this.result.set(updated);
          this.editClassifiedReport.set(updated.aIClassifiedReport || '');
          this.editSuggestion.set(updated.aISuggestion || '');
          this.editSummary.set(updated.summary || '');
        }
        this.generatingAI.set(false);
        if (userTriggered) this.actionMessage.set('AI analysis generated successfully.');
      },
      error: () => {
        this.generatingAI.set(false);
        if (userTriggered) this.error.set('Failed to generate AI analysis.');
      }
    });
  }

  loadFullReport(patientId: number): void {
    // Load both the generated full report and the stored content in parallel
    forkJoin({
      full: this.doctorService.getFullPatientAIReport(patientId).pipe(
        catchError(err => { console.warn('Could not generate full report', err); return of(null); })
      ),
      stored: this.doctorService.getStoredFullPatientReport(patientId).pipe(
        catchError(() => of(null))
      )
    }).subscribe(({ full, stored }) => {
      if (full) {
        this.fullReport.set(full);
        this.editOverallSummary.set(full.overallAISummary || '');
        this.editOverallSuggestion.set(full.overallAISuggestion || '');
      }
      if (stored && stored.content) {
        this.storedFullReportContent.set(stored.content);
        this.editFullReportContent.set(stored.content);
      }
    });
  }

  /** Regenerate the full patient AI report on demand */
  regenerateFullReport(): void {
    const res = this.result();
    if (!res?.patientId) return;
    this.generatingFullReport.set(true);
    this.actionMessage.set(null);

    this.doctorService.getFullPatientAIReport(res.patientId).subscribe({
      next: (report) => {
        this.fullReport.set(report);
        this.editOverallSummary.set(report.overallAISummary || '');
        this.editOverallSuggestion.set(report.overallAISuggestion || '');
        this.generatingFullReport.set(false);
        this.actionMessage.set('Full AI report regenerated successfully.');
      },
      error: () => {
        this.error.set('Failed to regenerate full report.');
        this.generatingFullReport.set(false);
      }
    });
  }

  toggleEditMode(): void {
    const res = this.result();
    if (res) {
      this.editSummary.set(res.summary || '');
      this.editClassifiedReport.set(res.aIClassifiedReport || '');
      this.editSuggestion.set(res.aISuggestion || '');
    }
    this.isEditing.update(v => !v);
  }

  approveStatusOnly(): void {
    const id = this.resultId();
    if (!id) return;

    this.actionMessage.set(null);
    this.doctorService.updatePatientResultStatus(id, { status: PatinetResultAIReportStatus.Approved }).subscribe({
      next: (updated) => {
        const current = this.result();
        this.result.set({
          ...(current || {} as any),
          ...updated,
          aiReportStatus: PatinetResultAIReportStatus.Approved
        });
        this.actionMessage.set('Status successfully updated to Approved!');
      },
      error: () => {
        this.error.set('Failed to approve result status.');
      }
    });
  }

  saveAndApprove(): void {
    const id = this.resultId();
    if (!id) return;

    const current = this.result();
    const dto: PatientResultUpdateDto = {
      summary: this.editSummary(),
      aIClassifiedReport: this.editClassifiedReport(),
      aISuggestion: this.editSuggestion(),
      status: PatinetResultAIReportStatus.Approved
    };

    this.actionMessage.set(null);
    this.doctorService.updatePatientResult(id, dto).subscribe({
      next: (updatedResult) => {
        this.doctorService.updatePatientResultStatus(id, { status: PatinetResultAIReportStatus.Approved }).subscribe({
          next: (finalRes) => {
            this.result.set({
              ...(current || {} as any),
              ...updatedResult,
              ...finalRes,
              aiReportStatus: PatinetResultAIReportStatus.Approved
            });
            this.isEditing.set(false);
            this.actionMessage.set('AI report updated and approved successfully!');
          },
          error: () => {
            this.result.set({
              ...(current || {} as any),
              ...updatedResult,
              aiReportStatus: PatinetResultAIReportStatus.Approved
            });
            this.isEditing.set(false);
            this.actionMessage.set('AI report updated and approved!');
          }
        });
      },
      error: () => {
        this.error.set('Failed to update AI report.');
      }
    });
  }

  // ============ Overall AI Summary & Suggestion editing ============

  toggleEditOverall(): void {
    if (!this.isEditingOverall()) {
      const fr = this.fullReport();
      this.editOverallSummary.set(fr?.overallAISummary || '');
      this.editOverallSuggestion.set(fr?.overallAISuggestion || '');
    }
    this.isEditingOverall.update(v => !v);
  }

  saveOverallReport(): void {
    const res = this.result();
    if (!res || !res.patientId) return;

    this.savingOverall.set(true);
    const overallSummary = this.editOverallSummary();
    const overallSuggestion = this.editOverallSuggestion();

    // Store the combined overall content in the RAG store
    const content = `Overall AI Summary:\n${overallSummary}\n\nOverall AI Suggestion:\n${overallSuggestion}`;
    this.doctorService.updateStoredFullPatientReport(res.patientId, { content }).subscribe({
      next: () => {
        // Update local fullReport signal so the view reflects changes immediately
        const fr = this.fullReport();
        if (fr) {
          this.fullReport.set({ ...fr, overallAISummary: overallSummary, overallAISuggestion: overallSuggestion });
        }
        this.storedFullReportContent.set(content);
        this.isEditingOverall.set(false);
        this.savingOverall.set(false);
        this.actionMessage.set('Overall AI Summary & Suggestion saved and indexed to RAG successfully!');
      },
      error: () => {
        this.error.set('Failed to save Overall AI report.');
        this.savingOverall.set(false);
      }
    });
  }

  // ============ Stored Report Content editing ============

  toggleEditFullReport(): void {
    if (!this.editFullReportContent()) {
      const fr = this.fullReport();
      if (fr) {
        this.editFullReportContent.set(
          `Overall AI Summary:\n${fr.overallAISummary || ''}\n\nOverall AI Suggestions:\n${fr.overallAISuggestion || ''}`
        );
      }
    }
    this.isEditingFullReport.update(v => !v);
  }

  saveStoredFullReport(): void {
    const res = this.result();
    if (!res || !res.patientId) return;

    this.savingFullReport.set(true);
    const content = this.editFullReportContent();
    this.doctorService.updateStoredFullPatientReport(res.patientId, { content }).subscribe({
      next: () => {
        this.storedFullReportContent.set(content);
        this.isEditingFullReport.set(false);
        this.savingFullReport.set(false);
        this.actionMessage.set('Full Patient AI Report stored successfully!');
      },
      error: () => {
        this.error.set('Failed to update stored full report.');
        this.savingFullReport.set(false);
      }
    });
  }
}

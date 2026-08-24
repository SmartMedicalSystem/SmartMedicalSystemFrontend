import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DoctorService } from '../../../../core/services/doctor-service.service';
import {
  PatientResultReadDto,
  PatientResultUpdateDto,
  PatinetResultAIReportStatus
} from '../../../../shared/interfaces/Doctor/patient-result.interface';
import { PatientFullAIReportDto } from '../../../../shared/interfaces/Doctor/patient-ai-report.interface';

@Component({
  selector: 'app-patient-result-detail',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './patient-result-detail.html',
  styleUrl: './patient-result-detail.css',
})
export class PatientResultDetail implements OnInit {
  resultId = signal<number | null>(null);
  result = signal<PatientResultReadDto | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  actionMessage = signal<string | null>(null);

  // Edit fields for PatientResult AI report
  isEditing = signal(false);
  editSummary = signal('');
  editClassifiedReport = signal('');
  editSuggestion = signal('');

  // Full Patient AI Report state
  fullReport = signal<PatientFullAIReportDto | null>(null);
  storedFullReportContent = signal('');
  isEditingFullReport = signal(false);
  editFullReportContent = signal('');
  savingFullReport = signal(false);

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
  ) {}

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
        this.editSummary.set(res.summary || '');
        this.editClassifiedReport.set(res.aIClassifiedReport || '');
        this.editSuggestion.set(res.aISuggestion || '');
        this.loading.set(false);
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

  loadFullReport(patientId: number): void {
    this.doctorService.getFullPatientAIReport(patientId).subscribe({
      next: (report) => {
        this.fullReport.set(report);
      },
      error: (err) => {
        console.warn('Could not load full report', err);
      }
    });

    this.doctorService.getStoredFullPatientReport(patientId).subscribe({
      next: (stored) => {
        if (stored && stored.content) {
          this.storedFullReportContent.set(stored.content);
          this.editFullReportContent.set(stored.content);
        }
      },
      error: () => {
        // No stored report yet
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
        this.result.set(updated);
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

    const dto: PatientResultUpdateDto = {
      summary: this.editSummary(),
      aIClassifiedReport: this.editClassifiedReport(),
      aISuggestion: this.editSuggestion()
    };

    this.actionMessage.set(null);
    this.doctorService.updatePatientResult(id, dto).subscribe({
      next: (updatedResult) => {
        this.doctorService.updatePatientResultStatus(id, { status: PatinetResultAIReportStatus.Approved }).subscribe({
          next: (finalRes) => {
            this.result.set(finalRes);
            this.isEditing.set(false);
            this.actionMessage.set('AI report updated and approved successfully!');
          },
          error: () => {
            this.result.set(updatedResult);
            this.isEditing.set(false);
            this.actionMessage.set('AI report updated, but failed to change status.');
          }
        });
      },
      error: () => {
        this.error.set('Failed to update AI report.');
      }
    });
  }

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

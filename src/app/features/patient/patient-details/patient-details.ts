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

type SectionId = 'personal' | 'lab' | 'ai' | 'notes' | 'history';
@Component({
  selector: 'app-patient-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-details.html',
  styleUrl: './patient-details.css',
})
export class PatientDetails {
  constructor(private router: Router) {}
  
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

  rejectAiReport(report: AiReport): void {
    console.log('Rejecting AI report', report.title);
  }

  approveAiReport(report: AiReport): void {
    console.log('Approving AI report', report.title);
  }

  addNewNote(): void {
    if (!this.newNoteText.trim()) return;
    this.medicalNotes.update((notes) => [
      { doctorName: 'Dr. Julian Vance', specialty: 'Clinical Oncologist', date: 'Today', text: this.newNoteText },
      ...notes,
    ]);
    this.newNoteText = '';
  }
}

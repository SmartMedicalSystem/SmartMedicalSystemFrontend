import { Component, signal } from '@angular/core';
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
export class LabTest {
  // ---------- Patient summary ----------
  patient = {
    name: 'Sarah J. Miller',
    id: '#44920',
    ssn: '***-XX-8912',
    age: 42,
    gender: 'Female',
    bloodGroup: 'A Rh Positive',
    contact: '+1 555-012-3456',
    assignedDoctor: 'Dr. Adrian Thorne',
    fileStatus: 'Active File',
  };

  // ---------- Laboratory Information ----------
  laboratoryOptions = ['Central Clinical Lab', 'Northside Diagnostics', 'Metro Pathology Lab'];
  laboratoryTestOptions = ['Full Blood Count (FBC)', 'Comprehensive Metabolic Panel (CMP)', 'Lipid Panel', 'Liver Function Test (LFT)'];
  priorityOptions = ['Routine', 'Urgent', 'STAT'];

  form = {
    laboratory: 'Central Clinical Lab',
    laboratoryTest: 'Full Blood Count (FBC)',
    priority: 'Routine',
    requestedDate: '2024-11-20',
    clinicalNotes: '',
  };

  // ---------- Optional Information ----------
  optionalOpen = signal(false);

  fastingRequired = signal(false);
  attachments: string[] = [];

  toggleOptional(): void {
    this.optionalOpen.update((v) => !v);
  }

  toggleFasting(): void {
    this.fastingRequired.update((v) => !v);
  }

  onCancel(): void {
    console.log('Cancelling new laboratory request');
  }

  onSubmit(): void {
    console.log('Submitting laboratory request', this.form);
  }
}

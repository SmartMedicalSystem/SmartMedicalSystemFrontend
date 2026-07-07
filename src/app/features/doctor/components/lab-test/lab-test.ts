import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface PatientSummary {
  name: string;
  avatar: string;
  patientId: string;
  nationalId: string;
  status: 'Active' | 'Critical' | 'Discharged';
  registeredDate: string;
}
@Component({
  selector: 'app-edit-patient',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-patient.html',
  styleUrl: './edit-patient.css',
})
export class EditPatient {
  private fb = inject(FormBuilder);

  patient = signal<PatientSummary>({
    name: 'Leo Walker',
    avatar: 'https://i.pravatar.cc/80?img=15',
    patientId: '#P-88219',
    nationalId: '667-210-4491',
    status: 'Active',
    registeredDate: 'Jan 02, 2024'
  });

  modifiedFields = signal<Set<string>>(new Set(['occupation']));

  form = this.fb.group({
    // Basic Information
    firstName: ['Leo', Validators.required],
    lastName: ['Walker', Validators.required],
    dateOfBirth: ['1982-05-14', Validators.required],
    gender: ['Male', Validators.required],
    occupation: ['Software Architect'],
    patientNumber: [{ value: 'P-88219', disabled: true }],

    // Contact Information
    countryCode: ['+1'],
    phoneNumber: ['202-555-0143', Validators.required],
    email: ['leo.walker82@example.com', Validators.email],
    address: ['482 Oakwood Ave, San Francisco, CA 94110'],

    // Hospital Information
    assignedDepartment: ['Neurology'],
    primaryPhysician: ['Dr. Julian Vance'],
    patientStatus: ['Active'],
    registrationDate: [{ value: 'Jan 02, 2024', disabled: true }]
  });

  originalValue = this.form.getRawValue();

  isModified(controlName: string): boolean {
    return this.modifiedFields().has(controlName);
  }

  onFieldChange(controlName: string) {
    const control = this.form.get(controlName);
    const original = (this.originalValue as any)[controlName];
    const next = new Set(this.modifiedFields());

    if (control?.value !== original) {
      next.add(controlName);
    } else {
      next.delete(controlName);
    }
    this.modifiedFields.set(next);
  }

  statusClasses(status: PatientSummary['status']): string {
    switch (status) {
      case 'Active':
        return 'bg-secondary/10 text-secondary';
      case 'Critical':
        return 'bg-tertiary/10 text-tertiary';
      case 'Discharged':
        return 'bg-gray-100 text-gray-500';
    }
  }

  onCancel() {
    this.form.reset(this.originalValue);
    this.modifiedFields.set(new Set());
  }

  onResetChanges() {
    this.form.reset(this.originalValue);
    this.modifiedFields.set(new Set());
  }

  onSaveAndContinue() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Save & continue editing:', this.form.getRawValue());
    this.originalValue = this.form.getRawValue();
    this.modifiedFields.set(new Set());
  }

  onSaveChanges() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Save changes:', this.form.getRawValue());
  }

  onArchivePatient() {
    console.log('Archive patient:', this.patient().patientId);
  }
}

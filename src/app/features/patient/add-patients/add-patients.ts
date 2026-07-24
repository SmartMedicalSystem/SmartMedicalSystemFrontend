import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-patients',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-patients.html',
  styleUrl: './add-patients.css',
})
export class AddPatients {
  private fb = inject(FormBuilder);

  submitted = signal(false);

  patientNumber = signal('P-2024-8842');
  registrationDate = signal('November 12, 2024');

  form = this.fb.group({
    // Basic Information
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    nationalId: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    gender: ['', Validators.required],
    bloodGroup: [''],
   

    // Contact Information
    mobileNumber: ['', Validators.required],
    address: [''],
    city: [''],
   

    // Hospital Information
    patientStatus: ['Active'],
    assignedDepartment: [''],
    assignedDoctor: ['']
  });

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted());
  }

  errorMessage(controlName: string, label: string): string {
    const control = this.form.get(controlName);
    if (control?.hasError('required')) return `${label} is required`;
    if (control?.hasError('email')) return `Enter a valid email`;
    return '';
  }

  onCancel() {
    this.form.reset({ patientStatus: 'Active' });
    this.submitted.set(false);
  }

  onSavePatient() {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Save patient:', this.form.value);
  }
}

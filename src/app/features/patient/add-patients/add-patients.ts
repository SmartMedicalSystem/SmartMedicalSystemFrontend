import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreatePatientDto } from '../../../shared/interfaces/Patient/create-patient.dto';

import { PatientsService } from '../../../core/services/patient-service';
import { AlertService } from '../../../core/services/alert-service';

@Component({
  selector: 'app-add-patients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-patients.html',
  styleUrl: './add-patients.css',
})
export class AddPatients {
  private fb = inject(FormBuilder);
  private patientService = inject(PatientsService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  submitted = signal(false);

  patientNumber = signal('P-2024-8842');
  registrationDate = signal('November 12, 2024');

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    nationalId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], 

    dateOfBirth: ['', Validators.required],
    gender: [null as number | null, Validators.required],
    bloodType: [null as number | null, Validators.required],
    mobileNumber: ['', Validators.required],
    address: [''],

    // UI Only — مش موجودين في CreatePatientDto فمش هيتبعتوا للباك
    city: [''],
    patientStatus: ['Active'],
    assignedDepartment: [''],
    assignedDoctor: [''],
  });

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted());
  }

  errorMessage(controlName: string, label: string): string {
    const control = this.form.get(controlName);
    if (control?.hasError('required')) {
      return `${label} is required`;
    }
    return '';
  }

  onCancel() {
    this.alertService
      .confirm('Discard all entered data for this new patient?', 'Cancel adding patient?')
      .then((result) => {
        if (!result.isConfirmed) return;

        this.form.reset({
          gender: null,
          bloodType: null,
          patientStatus: 'Active',
        });

        this.submitted.set(false);
      });
  }

  onSavePatient() {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.alertService
      .confirm('Save this new patient record?', 'Confirm save')
      .then((result) => {
        if (!result.isConfirmed) return;

        const value = this.form.getRawValue();

        const dto: CreatePatientDto = {
          firstName: value.firstName!,
          lastName: value.lastName!,
          nationalId: value.nationalId!, 
          dateOfBirth: value.dateOfBirth!,
          gender: Number(value.gender),
          email: value.email!,   

          mobileNumber: value.mobileNumber!,
          address: value.address ?? '',
          bloodType: Number(value.bloodType),
        };

        this.patientService.addPatient(dto).subscribe({
          next: (res) => {
            this.alertService.success('Patient added successfully');
            this.router.navigate(['/admin/dashboard/patients/all-patients']);
          },

          error: (err) => {
            console.error(err);
            this.alertService.error(err.error?.message ?? 'Failed to add patient');
          },
        });
      });
  }
}
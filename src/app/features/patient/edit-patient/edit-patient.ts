import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientsService } from '../../../core/services/patient-service.service';
import { UpdatePatientDto } from '../../../shared/interfaces/Patient/update-patient.dto';
import { AlertService } from '../../../core/services/alert-service.service';

const NATIONAL_ID_PATTERN = /^\d{14}$/;

function notInFutureValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const inputDate = new Date(control.value);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return inputDate > today ? { futureDate: true } : null;
}

@Component({
  selector: 'app-edit-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-patient.html',
  styleUrl: './edit-patient.css',
})
export class EditPatient implements OnInit {
  private fb = inject(FormBuilder);
  private patientService = inject(PatientsService);
  private alertService = inject(AlertService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  patientId!: number;
  submitted = signal(false);

  patient = signal({
    name: '',
    patientId: '',
    nationalId: '',
    status: 'Active',
    registeredDate: '',
  });

  modifiedFields = signal<Set<string>>(new Set());

  // nationalId is editable now — same as add-patient — just with a stricter
  // pattern check since we already know the expected format.
  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    nationalId: ['', [Validators.required, Validators.pattern(NATIONAL_ID_PATTERN)]],
    dateOfBirth: ['', [Validators.required, notInFutureValidator]],
    gender: ['', Validators.required],
    mobileNumber: ['', Validators.required],
    address: [''],
    bloodType: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],

    // UI Only
    patientNumber: [{ value: '', disabled: true }],
    registrationDate: [{ value: '', disabled: true }],
    assignedDepartment: [''],
    primaryPhysician: [''],
  });

  originalValue = this.form.getRawValue();

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.patientId) {
      this.loadPatient();
    }
  }

  loadPatient(): void {
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (patient) => {
        this.patient.set({
          name: `${patient.firstName} ${patient.lastName}`,
          patientId: patient.id.toString(),
          nationalId: patient.nationalId ?? '',
          status: 'Active',
          registeredDate: '',
        });

        this.form.patchValue({
          firstName: patient.firstName,
          lastName: patient.lastName,
          nationalId: patient.nationalId ?? '',
          dateOfBirth: patient.dateOfBirth.substring(0, 10),
          gender: patient.gender,
          mobileNumber: patient.mobileNumber.toString(),
          address: patient.address,
          email: patient.email,
          bloodType: patient.bloodType,
          patientNumber: patient.id.toString(),
          registrationDate: '',
        });

        this.originalValue = this.form.getRawValue();
      },
      error: (err) => {
        console.error(err);
        this.alertService.error('Failed to load patient');
      },
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted());
  }

  errorMessage(controlName: string, label: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) return `${label} is required`;
    if (control.hasError('email')) return 'Invalid email address';
    if (control.hasError('futureDate')) return `${label} cannot be in the future`;
    if (control.hasError('pattern')) {
      if (controlName === 'nationalId') return 'National ID must be exactly 14 digits';
      return `${label} is invalid`;
    }
    return '';
  }

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

  statusClasses(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-secondary/10 text-secondary';
      case 'Critical':
        return 'bg-tertiary/10 text-tertiary';
      case 'Discharged':
        return 'bg-gray-100 text-gray-500';
      default:
        return '';
    }
  }

  onCancel() {
    this.alertService
      .confirm('Discard any unsaved changes and leave this page?', 'Cancel editing?')
      .then((result) => {
        if (!result.isConfirmed) return;

        this.form.reset(this.originalValue);
        this.modifiedFields.set(new Set());
        this.router.navigate(['/admin/dashboard/patients/all-patients']);
      });
  }

  onResetChanges() {
    this.alertService
      .confirm('Reset all fields back to their last saved values?', 'Reset changes?')
      .then((result) => {
        if (!result.isConfirmed) return;

        this.form.reset(this.originalValue);
        this.modifiedFields.set(new Set());
      });
  }

  onSaveAndContinue() {
    this.onSaveChanges();
  }

  onSaveChanges() {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.alertService
      .confirm('Save changes to this patient record?', 'Confirm save')
      .then((result) => {
        if (!result.isConfirmed) return;

        const value = this.form.getRawValue();

        const dto: UpdatePatientDto = {
          firstName: value.firstName!,
          lastName: value.lastName!,
          nationalId: value.nationalId!,
          email: value.email!,
          dateOfBirth: value.dateOfBirth!,
          gender: Number(value.gender),
          mobileNumber: value.mobileNumber!,
          address: value.address ?? '',
          bloodType: Number(value.bloodType),
        };

        this.patientService.updatePatientById(this.patientId, dto).subscribe({
          next: () => {
            this.alertService.success('Patient updated successfully');
            this.originalValue = this.form.getRawValue();
            this.modifiedFields.set(new Set());
            this.router.navigate(['/admin/dashboard/patients/all-patients']);
          },
          error: (err) => {
            console.error(err);
            this.alertService.error(err.error?.message ?? 'Failed to update patient');
          },
        });
      });
  }

  onArchivePatient() {
    console.log('Archive patient');
  }
}
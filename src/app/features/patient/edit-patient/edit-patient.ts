import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientsService } from '../../../core/services/patient-service';

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  patientId = 0;

  patient = signal({
    name: '',
    patientId: '',
    nationalId: '',
    status: 'Active',
    registeredDate: ''
  });

  modifiedFields = signal<Set<string>>(new Set());

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    nationalId: [0, Validators.required],
    dateOfBirth: ['', Validators.required],
    gender: [0, Validators.required],
    mobileNumber: [0, Validators.required],
    address: [''],
    bloodType: [1, Validators.required],

    // UI Only
    patientNumber: [{ value: '', disabled: true }],
    registrationDate: [{ value: '', disabled: true }],
    assignedDepartment: [''],
    primaryPhysician: ['']
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
          nationalId: patient.nationalId.toString(),
          status: 'Active',
          registeredDate: ''
        });

        this.form.patchValue({
          firstName: patient.firstName,
          lastName: patient.lastName,
          nationalId: patient.nationalId,
          dateOfBirth: patient.dateOfBirth.substring(0, 10),
          gender: patient.gender,
          mobileNumber: patient.mobileNumber,
          address: patient.address,
          bloodType: patient.bloodType,
          patientNumber: patient.id.toString(),
          registrationDate: ''
        });

        this.originalValue = this.form.getRawValue();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load patient');
      }
    });
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
    this.form.reset(this.originalValue);
    this.modifiedFields.set(new Set());
    this.router.navigate(['/admin/dashboard/patients/all-patients']);
  }

  onResetChanges() {
    this.form.reset(this.originalValue);
    this.modifiedFields.set(new Set());
  }

  onSaveAndContinue() {
    this.onSaveChanges();
  }

  onSaveChanges() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const dto = {
      firstName: value.firstName!,
      lastName: value.lastName!,
      nationalId: Number(value.nationalId),
      dateOfBirth: value.dateOfBirth!,
      gender: Number(value.gender),
      mobileNumber: Number(value.mobileNumber),
      address: value.address ?? '',
      bloodType: Number(value.bloodType)
    };

    this.patientService.updatePatient(this.patientId, dto).subscribe({
      next: () => {
        alert('Patient updated successfully');
        this.originalValue = this.form.getRawValue();
        this.modifiedFields.set(new Set());
        this.router.navigate(['/admin/dashboard/patients/all-patients']);
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message ?? 'Failed to update patient');
      }
    });
  }

  onArchivePatient() {
    console.log('Archive patient');
  }
}
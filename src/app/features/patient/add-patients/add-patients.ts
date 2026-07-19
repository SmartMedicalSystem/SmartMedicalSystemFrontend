import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreatePatientDto, PatientsService } from '../../../core/services/patient-service';


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

  submitted = signal(false);

  patientNumber = signal('P-2024-8842');
  registrationDate = signal('November 12, 2024');

  form = this.fb.group({

    firstName: ['', Validators.required],

    lastName: ['', Validators.required],

    nationalId: ['', Validators.required],

    dateOfBirth: ['', Validators.required],

    gender: [0, Validators.required],

    bloodType: [1, Validators.required],

    mobileNumber: ['', Validators.required],

    address: [''],

    // UI Only
    city: [''],
    patientStatus: ['Active'],
    assignedDepartment: [''],
    assignedDoctor: ['']

  });

  isInvalid(controlName: string): boolean {

    const control = this.form.get(controlName);

    return !!control &&
      control.invalid &&
      (control.touched || this.submitted());

  }

  errorMessage(controlName: string, label: string): string {

    const control = this.form.get(controlName);

    if (control?.hasError('required')) {
      return `${label} is required`;
    }

    return '';

  }

  onCancel() {

    this.form.reset({
      gender: 0,
      bloodType: 1,
      patientStatus: 'Active'
    });

    this.submitted.set(false);

  }

  onSavePatient() {

    this.submitted.set(true);

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    const value = this.form.getRawValue();

    const dto: CreatePatientDto = {

      firstName: value.firstName!,

      lastName: value.lastName!,

      nationalId: Number(value.nationalId),

      dateOfBirth: value.dateOfBirth!,

      gender: Number(value.gender),

      mobileNumber: Number(value.mobileNumber),

      address: value.address ?? '',

      bloodType: Number(value.bloodType)

    };

    console.log(dto);

    this.patientService.addPatient(dto).subscribe({

      next: (res) => {

        console.log(res);

        alert('Patient added successfully');

        this.onCancel();

      },

      error: (err) => {

        console.error(err);

        alert('Failed to add patient');

      }

    });

  }

}
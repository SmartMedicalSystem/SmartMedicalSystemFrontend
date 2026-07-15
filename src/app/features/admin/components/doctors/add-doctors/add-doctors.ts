import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Doctor, DoctorService } from '../../../../../core/services/doctor-service';
@Component({
  selector: 'app-add-doctors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-doctors.html',
  styleUrl: './add-doctors.css',
})
export class AddDoctors {
  private fb = inject(FormBuilder);
  private doctorService = inject(DoctorService);

  submitted = signal(false);
  photoPreview = signal<string |null>(null);

  employeeId = signal('EMP-2024-0482');
  temporaryPassword = signal('kX9!pL42_mQ');

  form = this.fb.group({
    // Personal Information
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    gender: [0, Validators.required],
    dateOfBirth: ['', Validators.required],
    nationalId: ['', Validators.required],

    // Professional Information
    department: ['', Validators.required], // DepartmentId
    specialization: ['', Validators.required],
    joiningDate: [''],

    // Contact Information
    mobileNumber: ['', Validators.required],
    personalEmail: ['', [Validators.required, Validators.email]],
    residentialAddress: [''],

    // Contact
    contact: ['Clinic 101', Validators.required],
  });

  regeneratePassword() {
    const chars =
      'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@_';

    let pass = '';

    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    this.temporaryPassword.set(pass);
  }

  copyPassword() {
    navigator.clipboard.writeText(this.temporaryPassword());
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);

    return !!control && control.invalid && (control.touched || this.submitted());
  }

  onClearForm() {
    this.form.reset({
      gender: 0,
      contact: 'Clinic 101',
    });

    this.photoPreview.set(null);
    this.submitted.set(false);
  }

  onCancel() {
    this.onClearForm();
  }

  onCreateAndAddAnother() {
    this.createDoctor(true);
  }

  onCreateDoctor() {
    this.createDoctor(false);
  }

  private createDoctor(addAnother: boolean) {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const doctor = {
      name: `${value.firstName} ${value.lastName}`,

      specialization: value.specialization!,

      contact: value.contact!,

      dateOfBirth: value.dateOfBirth!,

      email: value.personalEmail!,

      mobileNumber: Number(value.mobileNumber),

      address: value.residentialAddress ?? '',

      gender: Number(value.gender),

      nationalId: Number(value.nationalId),

      departmentId: Number(value.department),
    };

    this.doctorService.addDoctor(doctor).subscribe({
      next: (res) => {
        console.log('Doctor Created', res);

        alert('Doctor added successfully');

        if (addAnother) {
          this.onClearForm();
        }
      },

      error: (err) => {
        console.error(err);

        alert(err.error?.message ?? 'Failed to create doctor');
      },
    });
  }
}
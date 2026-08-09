import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CreateDoctorDto } from '../../../../../shared/interfaces/Doctor/create-doctor.interface';
import { DoctorService } from '../../../../../core/services/doctor-service.service';
import { AlertService } from '../../../../../core/services/alert-service.service';

// مطابق لـ Guard.ValidatePhone في الباك: 010/011/012/015 + 8 أرقام
const EGYPT_PHONE_PATTERN = /^(010|011|012|015)\d{8}$/;

// رقم قومي مصري: 14 رقم بالظبط
const NATIONAL_ID_PATTERN = /^\d{14}$/;

function notInFutureValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const inputDate = new Date(control.value);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // نسمح بتاريخ النهاردة نفسه

  return inputDate > today ? { futureDate: true } : null;
}

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
  private alertService = inject(AlertService);
  private router = inject(Router);

  submitted = signal(false);
  photoPreview = signal<string | null>(null);

  employeeId = signal('EMP-2024-0482');
  temporaryPassword = signal('kX9!pL42_mQ');

  form = this.fb.group({
    // Personal Information
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    gender: [null as number | null, Validators.required],
    dateOfBirth: ['', [Validators.required, notInFutureValidator]],
    nationalId: ['', [Validators.required, Validators.pattern(NATIONAL_ID_PATTERN)]],

    // Professional Information
    department: [null as number | null, Validators.required],
    specialization: ['', [Validators.required, Validators.maxLength(100)]],
    joiningDate: [''],

    // Contact Information
    mobileNumber: ['', [Validators.required, Validators.pattern(EGYPT_PHONE_PATTERN)]],
    personalEmail: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    residentialAddress: ['', Validators.maxLength(250)],
    city: ['', Validators.maxLength(100)],
    country: ['', Validators.maxLength(100)],

    // Contact (محلي بس، مش بيتبعت للباك)
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

  errorMessage(controlName: string, label: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) return '';


    if (control.hasError('required')) return `${label} is required`;
    if (control.hasError('email')) return `Invalid email address`;
    if (control.hasError('maxlength')) {
      const max = control.getError('maxlength').requiredLength;
      return `${label} exceeds the maximum length (${max} characters)`;
    }
    if (control.hasError('futureDate')) return `${label} cannot be in the future`;
    if (control.hasError('pattern')) {
      if (controlName === 'mobileNumber') {
        return 'Mobile number must start with 010, 011, 012, or 015 followed by 8 digits';
      }
      if (controlName === 'nationalId') {
        return 'National ID must be exactly 14 digits';
      }
      return `${label} is invalid`;
    }
    return '';
  }

  onClearForm() {
    this.form.reset({
      gender: null,
      contact: 'Clinic 101',
    });

    this.photoPreview.set(null);
    this.submitted.set(false);
  }

  onCancel() {
    this.alertService
      .confirm('Discard all entered data for this new doctor?', 'Cancel adding doctor?')
      .then((result) => {
        if (!result.isConfirmed) return;
        this.onClearForm();
      });
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

    this.alertService
      .confirm('Create this new doctor profile?', 'Confirm creation')
      .then((result) => {
        if (!result.isConfirmed) return;

        const value = this.form.getRawValue();

        const doctor: CreateDoctorDto = {
          name: `${value.firstName} ${value.lastName}`.trim(),
          specialization: value.specialization!,
          dateOfBirth: value.dateOfBirth!,
          email: value.personalEmail!,
          mobileNumber: value.mobileNumber!,
          password: this.temporaryPassword(),
          address: value.residentialAddress ?? '',
          city: value.city ?? '',
          country: value.country ?? '',
          gender: Number(value.gender),
          nationalId: value.nationalId!,
          departmentId: Number(value.department),
        };

        this.doctorService.addDoctor(doctor).subscribe({
          next: (res) => {
            this.alertService.success('Doctor added successfully');

            if (addAnother) {
              this.onClearForm();
            } else {
              this.router.navigate(['/admin/dashboard/doctors/all-doctors']);
            }
          },

          error: (err) => {
            console.error(err);
            this.alertService.error(err.error?.message ?? 'Failed to create doctor');
          },
        });
      });
  }
}
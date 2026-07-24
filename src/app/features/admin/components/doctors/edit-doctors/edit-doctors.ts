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

import {
  DoctorService,
  UpdateDoctorDto,
} from '../../../../../core/services/doctor-service';

// Matches Guard.ValidatePhone in the backend: 010/011/012/015 + 8 digits
const EGYPT_PHONE_PATTERN = /^(010|011|012|015)\d{8}$/;

// Egyptian national ID: exactly 14 digits
const NATIONAL_ID_PATTERN = /^\d{14}$/;

function notInFutureValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const inputDate = new Date(control.value);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // allow today's date itself

  return inputDate > today ? { futureDate: true } : null;
}

@Component({
  selector: 'app-edit-doctors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-doctors.html',
  styleUrl: './edit-doctors.css',
})
export class EditDoctors implements OnInit {
  private fb = inject(FormBuilder);
  private doctorService = inject(DoctorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  doctorId = 0;
  submitted = signal(false);

  doctor = signal({
    name: '',
  });

  lastModified = signal({
    date: 'Today',
    by: 'Administrator',
    adminId: '001',
  });

  departments = signal([
    { id: 1, name: 'Cardiology' },
    { id: 2, name: 'Neurology' },
    { id: 3, name: 'Pediatrics' },
    { id: 4, name: 'Oncology' },
  ]);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    gender: [null as number | null, Validators.required],
    dateOfBirth: ['', [Validators.required, notInFutureValidator]],
    nationalId: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(NATIONAL_ID_PATTERN)]],
    specialization: ['', [Validators.required, Validators.maxLength(100)]],
    departmentId: [null as number | null, Validators.required],
    mobileNumber: ['', [Validators.required, Validators.pattern(EGYPT_PHONE_PATTERN)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    address: ['', Validators.maxLength(250)],
  });

  originalValue = this.form.getRawValue();

  ngOnInit(): void {
    this.doctorId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadDoctor();
  }

  loadDoctor() {
    this.doctorService.getDoctorById(this.doctorId).subscribe({
      next: (doctor) => {
        this.doctor.set({
          name: doctor.name,
        });

        this.form.patchValue({
          name: doctor.name,
          gender: doctor.gender,
          dateOfBirth: doctor.dateOfBirth.substring(0, 10),
          nationalId: doctor.nationalId,
          specialization: doctor.specialization,
          departmentId: doctor.departmentId,
          mobileNumber: doctor.mobileNumber,
          email: doctor.email,
          address: doctor.address,
        });

        this.originalValue = this.form.getRawValue();
      },

      error: (err) => {
        console.error(err);
        alert('Failed to load doctor');
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

  onCancel() {
    this.form.reset(this.originalValue);
    this.submitted.set(false);
  }

  onSaveChanges() {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue(); // getRawValue since nationalId is disabled

    const dto: UpdateDoctorDto = {
      name: raw.name!,
      specialization: raw.specialization!,
      dateOfBirth: raw.dateOfBirth!,
      email: raw.email!,
      mobileNumber: raw.mobileNumber!,
      address: raw.address ?? '',
      gender: Number(raw.gender),
      nationalId: raw.nationalId!,
      departmentId: Number(raw.departmentId),
    };

    this.doctorService.updateDoctor(this.doctorId, dto).subscribe({
      next: (res) => {
        console.log(res);
        alert('Doctor updated successfully');
        this.router.navigate(['/admin/dashboard/doctors/all-doctors']);
      },

      error: (err) => {
        console.error(err);
        alert(err.error?.message ?? 'Failed to update doctor');
      },
    });
  }
}
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface DoctorSummary {
  name: string;
}

@Component({
  selector: 'app-edit-doctors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-doctors.html',
  styleUrl: './edit-doctors.css',
})
export class EditDoctors {

  private fb = inject(FormBuilder);

  doctor = signal<DoctorSummary>({
    name: 'Dr. Sarah Jenkins',
  });

  lastModified = signal({
    date: '14 Oct 2023',
    by: 'Administrator',
    adminId: '442',
  });

  form = this.fb.group({

    // Personal Information
    name: ['', Validators.required],

    gender: [0, Validators.required],

    dateOfBirth: ['', Validators.required],

    nationalId: [null as number | null, Validators.required],

    // Professional Information
    specialization: ['', Validators.required],

    departmentId: [null as number | null, Validators.required],

    // Contact Information
    contact: ['', Validators.required],

    mobileNumber: [null as number | null, Validators.required],

    email: ['', [Validators.required, Validators.email]],

    address: ['']
  });

  originalValue = this.form.getRawValue();

  departments = signal([
    { id: 1, name: 'Neurology' },
    { id: 2, name: 'Cardiology' },
    { id: 3, name: 'Pediatrics' },
    { id: 4, name: 'Oncology' }
  ]);

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);

    return !!control && control.invalid && control.touched;
  }

  onCancel() {
    this.form.reset(this.originalValue);
  }

  onSaveChanges() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const doctorDto = this.form.getRawValue();

    console.log(doctorDto);

    /*
    this.doctorService.updateDoctor(id, doctorDto).subscribe({
      next: () => {

      }
    });
    */

  }
}
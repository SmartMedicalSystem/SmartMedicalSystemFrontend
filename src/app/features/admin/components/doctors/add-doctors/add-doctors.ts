import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-doctors',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-doctors.html',
  styleUrl: './add-doctors.css',
})
export class AddDoctors {
  private fb = inject(FormBuilder);

  submitted = signal(false);
  photoPreview = signal<string | null>(null);

  employeeId = signal('EMP-2024-0482');
  temporaryPassword = signal('kX9!pL42_mQ');

  form = this.fb.group({
    // Personal Information
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    gender: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    nationalId: ['', Validators.required],

    // Professional Information
    department: ['', Validators.required],
    specialization: ['', Validators.required],
    joiningDate: [''],

    // Contact Information
    mobileNumber: ['', Validators.required],
    personalEmail: ['', Validators.email],
    residentialAddress: [''],
  });

  regeneratePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@_';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.temporaryPassword.set(pass);
  }

  copyPassword() {
    navigator.clipboard.writeText(this.temporaryPassword());
  }

  toggleField(controlName: string) {
    const control = this.form.get(controlName);
    control?.setValue(!control.value);
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted());
  }

  onClearForm() {
    this.form.reset({});
    this.photoPreview.set(null);
    this.submitted.set(false);
  }

  onCancel() {
    this.onClearForm();
  }

  onCreateAndAddAnother() {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Create & add another:', this.form.getRawValue());
    this.onClearForm();
  }

  onCreateDoctor() {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Create doctor:', this.form.getRawValue());
  }
}

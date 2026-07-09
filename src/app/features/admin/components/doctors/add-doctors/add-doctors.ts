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
    nationality: [''],
    nationalId: ['', Validators.required],
    maritalStatus: ['Single'],

    // Professional Information
    licenseNumber: ['', Validators.required],
    department: ['', Validators.required],
    specialization: ['', Validators.required],
    yearsOfExperience: [''],
    employmentType: ['Full-Time'],
    joiningDate: [''],
    highestQualification: [''],
    professionalNotes: [''],

    // Contact Information
    mobileNumber: ['', Validators.required],
    personalEmail: ['', Validators.email],
    officeNumber: [''],
    extension: [''],
    residentialAddress: [''],
    city: [''],
    postalCode: [''],

    // Account & System Identity
    username: ['j.doe.cis', Validators.required],
    hospitalEmail: [{ value: 'j.doe@medai-hospital.com', disabled: true }],
    userRole: ['Doctor'],
    accountActive: [true],
    allowLogin: [true],
    notifications: [true],
    reviewAI: [true],
    approveReports: [false],

    // Account Delivery
    sendWelcomeEmail: [true],
    sendAccountCredentials: [true]
  });

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.photoPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.photoPreview.set(null);
  }

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
    this.form.reset({
      maritalStatus: 'Single',
      employmentType: 'Full-Time',
      username: 'j.doe.cis',
      userRole: 'Doctor',
      accountActive: true,
      allowLogin: true,
      notifications: true,
      reviewAI: true,
      approveReports: false,
      sendWelcomeEmail: true,
      sendAccountCredentials: true
    });
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

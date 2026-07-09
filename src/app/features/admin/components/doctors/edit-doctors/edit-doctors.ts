import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';


interface DoctorSummary {
  name: string;
  avatar: string;
  status: 'Active' | 'Inactive';
  licenseId: string;
  department: string;
}
@Component({
  selector: 'app-edit-doctors',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-doctors.html',
  styleUrl: './edit-doctors.css',
})
export class EditDoctors {private fb = inject(FormBuilder);

  doctor = signal<DoctorSummary>({
    name: 'Dr. Sarah Jenkins',
    avatar: 'https://i.pravatar.cc/80?img=47',
    status: 'Active',
    licenseId: 'LIC-99283-X',
    department: 'Neurosurgery'
  });

  lastModified = signal({
    date: '14 Oct 2023',
    by: 'Administrator',
    adminId: '442'
  });

  form = this.fb.group({
    // Personal Information
    firstName: ['Sarah', Validators.required],
    lastName: ['Jenkins', Validators.required],
    gender: ['Female', Validators.required],
    dateOfBirth: ['1984-05-12', Validators.required],
    nationalId: ['US-928374-12'],

    // Professional Details
    licenseNumber: [{ value: 'LIC-99283-X', disabled: true }],
    specialization: ['Neurosurgery', Validators.required],
    department: ['Neurology Dept B', Validators.required],
    yearsOfExperience: [12],
    joiningDate: ['2016-08-20'],

    // Contact Information
    mobilePhone: ['+1 (555) 029-3847', Validators.required],
    officeExt: ['4421'],
    officialEmail: ['sarah.j@medai.sys', Validators.email],
    officeAddress: ['72 West Medical Plaza, Suite 400, Chicago, IL'],

    // System Permissions
    allowSystemLogin: [true],
    canReviewAIReports: [true],
    adminPanelAccess: [false],
    directPrescriptionAuth: [true]
  });

  originalValue = this.form.getRawValue();

  toggleField(controlName: string) {
    const control = this.form.get(controlName);
    control?.setValue(!control.value);
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  statusClasses(status: DoctorSummary['status']): string {
    return status === 'Active' ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-500';
  }

  onCancel() {
    this.form.reset(this.originalValue);
  }

  onResetChanges() {
    this.form.reset(this.originalValue);
  }

  onSaveAndContinue() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Save & continue editing:', this.form.getRawValue());
    this.originalValue = this.form.getRawValue();
  }

  onSaveChanges() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Save changes:', this.form.getRawValue());
  }}

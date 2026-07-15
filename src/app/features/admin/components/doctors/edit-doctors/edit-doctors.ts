import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  DoctorService,
  UpdateDoctorDto,
} from '../../../../../core/services/doctor-service';

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
    name: ['', Validators.required],

    gender: [0, Validators.required],

    dateOfBirth: ['', Validators.required],

    nationalId: [null as number | null, Validators.required],

    specialization: ['', Validators.required],

    departmentId: [null as number | null, Validators.required],

    contact: ['', Validators.required],

    mobileNumber: [null as number | null, Validators.required],

    email: ['', [Validators.required, Validators.email]],

    address: [''],
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
          contact: doctor.contact,
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

    const dto: UpdateDoctorDto = {
      name: this.form.value.name!,
      specialization: this.form.value.specialization!,
      contact: this.form.value.contact!,
      dateOfBirth: this.form.value.dateOfBirth!,
      email: this.form.value.email!,
      mobileNumber: Number(this.form.value.mobileNumber),
      address: this.form.value.address ?? '',
      gender: Number(this.form.value.gender),
      nationalId: Number(this.form.value.nationalId),
      departmentId: Number(this.form.value.departmentId),
    };

    this.doctorService.updateDoctor(this.doctorId, dto).subscribe({
      next: (res) => {
        console.log(res);

        alert('Doctor updated successfully');

        this.router.navigate(['/admin/doctors']);
      },

      error: (err) => {
        console.error(err);

        alert(err.error?.message ?? 'Failed to update doctor');
      },
    });
  }
}
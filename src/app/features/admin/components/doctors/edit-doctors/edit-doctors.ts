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
import { UpdateDoctorDto } from '../../../../../shared/interfaces/Doctor/update-doctor.interface';
import {
  DoctorService
} from '../../../../../core/services/doctor-service.service';
import { AlertService } from '../../../../../core/services/alert-service.service';

// Matches Guard.ValidatePhone in the backend: 010/011/012/015 + 8 digits
const EGYPT_PHONE_PATTERN = /^(010|011|012|015)\d{8}$/;

function notInFutureValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const inputDate = new Date(control.value);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // allow today's date itself

  return inputDate > today ? { futureDate: true } : null;
}

// Backend returns gender as a string ("Male" / "Female"), but the form
// (and the DTOs) use numeric codes: 0 = Female, 1 = Male.
function mapGenderToNumber(gender: string | number): number | null {
  if (typeof gender === 'number') return gender;

  switch (gender?.toLowerCase()) {
    case 'female':
      return 0;
    case 'male':
      return 1;
    default:
      return null;
  }
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
  private alertService = inject(AlertService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  doctorId = 0;
  submitted = signal(false);

  // The backend never exposes the plaintext National ID — only an encrypted
  // value. We can't display or let the user edit it, but the backend's
  // UpdateDoctorDto still requires the field to be present. So we stash
  // whatever value the GET response gave us and echo it back unchanged on
  // save, without ever showing it in the form.
  private originalNationalId = '';

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

  // Personal Information fields (name, gender, dateOfBirth, nationalId) are
  // no longer editable from the UI — that section was removed from
  // edit-doctors.html entirely. These controls are kept here with NO
  // validators (the user can never touch them, so there's nothing to
  // validate) purely so the values loaded in loadDoctor() get echoed back
  // unchanged inside the UpdateDoctorDto on save. The backend still requires
  // them to be present on the request.
  form = this.fb.group({
    name: [''],
    gender: [null as number | null],
    dateOfBirth: [''],
    nationalId: [{ value: '', disabled: true }],

    specialization: ['', [Validators.required, Validators.maxLength(100)]],
    departmentId: [null as number | null, Validators.required],
    mobileNumber: ['', [Validators.required, Validators.pattern(EGYPT_PHONE_PATTERN)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    address: ['', Validators.maxLength(250)],
    city: ['', Validators.required],
    country: ['', Validators.required],
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

        // The API returns this under different names depending on the
        // endpoint/version (encryptedNationalId vs nationalId). Grab
        // whichever is present so we have something to send back on save.
        this.originalNationalId =
          (doctor as any).encryptedNationalId ?? (doctor as any).nationalId ?? '';

        this.form.patchValue({
          name: doctor.name,
          gender: mapGenderToNumber(doctor.gender),
          dateOfBirth: doctor.dateOfBirth.substring(0, 10),
          specialization: doctor.specialization,
          departmentId: doctor.departmentId,
          mobileNumber: doctor.phoneNumber,
          email: doctor.email,
          address: doctor.address,
          city: (doctor as any).city ?? '',
          country: (doctor as any).country ?? '',
        });

        this.originalValue = this.form.getRawValue();
      },

      error: (err) => {
        console.error(err);
        this.alertService.error('Failed to load doctor');
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
      return `${label} is invalid`;
    }

    return '';
  }

  onCancel() {
    this.alertService
      .confirm('Discard all unsaved changes to this profile?', 'Cancel editing?')
      .then((result) => {
        if (!result.isConfirmed) return;

        this.form.reset(this.originalValue);
        this.submitted.set(false);
      });
  }

  onSaveChanges() {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.alertService
      .confirm('Save changes to this doctor profile?', 'Confirm save')
      .then((result) => {
        if (!result.isConfirmed) return;

        const raw = this.form.getRawValue();

        const dto: UpdateDoctorDto = {
          name: raw.name!,
          specialization: raw.specialization!,
          dateOfBirth: raw.dateOfBirth!,
          email: raw.email!,
          mobileNumber: raw.mobileNumber!,
          address: raw.address ?? '',
          city: raw.city!,
          country: raw.country!,
          gender: Number(raw.gender),
          departmentId: Number(raw.departmentId),
          // Echo back the exact value the backend gave us on load — the user
          // never sees or edits it, this just satisfies the required field.
          nationalId: this.originalNationalId,
        };

        this.doctorService.updateDoctorY(this.doctorId, dto).subscribe({
          next: () => {
            this.alertService.success('Doctor updated successfully');
            this.router.navigate(['/admin/dashboard/doctors/all-doctors']);
          },

          error: (err) => {
            console.error(err);
            const backendMsg =
              err.error?.errors?.[0]?.message ?? err.error?.Message ?? err.error?.message ?? 'Failed to update doctor';
            this.alertService.error(backendMsg);
          },
        });
      });
  }
}
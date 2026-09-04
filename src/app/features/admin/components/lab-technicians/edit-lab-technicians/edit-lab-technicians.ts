import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { CommonModule } from '@angular/common';

import { AdminService } from '../../../../../core/services/admin-service.service';
// NOTE: adjust this import path to wherever ILabTechnician actually lives in your project.
import { ILabTechnician } from '../../../../../shared/interfaces/Admin/ILabTechnician';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-lab-technicians',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './edit-lab-technicians.html',
  styleUrl: './edit-lab-technicians.css'
})
export class EditLabTechnicians implements OnInit {

  // =========================
  // Inject Services
  // =========================

  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // =========================
  // API Base URL
  // =========================

  private readonly apiBaseUrl = 'https://smartmedicalsystem.runasp.net';

  // =========================
  // Technician National ID
  // =========================

  technicianNationalId = '';
  laboratoryName = '';
  // =========================
  // Image
  // =========================

  selectedImage: File | null = null;
  imagePreview: string | null = null;

  // =========================
  // Form
  // =========================
  // NOTE: ILabTechnician types gender / employmentStatus / workShift /
  // assignedLaboratory as `string`, so every form control below matches
  // that (all defaults and option values are strings, not numbers).
  // The literal codes used here ('0'/'1', '1'-'4', etc.) mirror what the
  // original component used — double check them against your actual
  // backend enum values (they may instead be words like "Male"/"Female").

  // =========================
// Form
// =========================

form = this.fb.group({
  firstName: ['', Validators.required],
  lastName: ['', Validators.required],

  gender: ['1', Validators.required],

  dateOfBirth: ['', Validators.required],
  nationality: ['', Validators.required],
  nationalId: ['', Validators.required],

  laboratoryId: [null as number | null, Validators.required],
  jobTitle: ['', Validators.required],

  employmentStatus: ['1', Validators.required],
  workShift: ['1', Validators.required],

  joiningDate: ['', Validators.required],
  yearsOfExperience: [0, [Validators.required, Validators.min(0)]],

  phoneNumber: ['', Validators.required],
  alternativePhone: [''],
  email: ['', [Validators.required, Validators.email]],
  address: ['', Validators.required],
  city: ['', Validators.required],
  country: ['', Validators.required],
  postalCode: [''],

  username: ['', Validators.required],
  allowLogin: [true],
  accountActive: [true],
  receiveNotifications: [true],
  sendWelcomeEmail: [true],
  sendLoginCredentials: [true]
});
  // =========================
  // On Init
  // =========================

  ngOnInit(): void {

    const nationalId =
      this.route.snapshot.paramMap.get('nationalId')
      ?? this.route.parent?.snapshot.paramMap.get('nationalId');

    if (!nationalId) {
      console.error('National ID was not found in route');
      alert('Technician National ID Not Found');
      return;
    }

    this.technicianNationalId = nationalId;

    this.loadTechnician();
  }

  // =========================
  // Load Technician
  // =========================

  loadTechnician(): void {

  this.adminService
    .getLabTechnicianById(this.technicianNationalId)
    .subscribe({

      next: (res: ILabTechnician) => {

        this.form.patchValue({

          firstName: res.firstName ?? '',
          lastName: res.lastName ?? '',

          gender: String(res.gender ?? 1),

          dateOfBirth: this.formatDate(res.dateOfBirth),
          nationality: res.nationality ?? '',
          nationalId: res.nationalId ?? '',
          
          // IMPORTANT
          laboratoryId: res.laboratoryId ?? null,
          
          jobTitle: res.jobTitle ?? '',

          employmentStatus: String(res.employmentStatus ?? 1),
          workShift: String(res.workShift ?? 1),

          joiningDate: this.formatDate(res.joiningDate),
          yearsOfExperience: res.yearsOfExperience ?? 0,

          phoneNumber: res.phoneNumber ?? '',
          alternativePhone: res.alternativePhone ?? '',
          email: res.email ?? '',
          address: res.address ?? '',
          city: res.city ?? '',
          country: res.country ?? '',
          postalCode: res.postalCode ?? '',

          username: res.username ?? '',
          allowLogin: res.allowLogin ?? false,
          accountActive: res.accountActive ?? false,
          receiveNotifications: res.receiveNotifications ?? false,
          sendWelcomeEmail: res.sendWelcomeEmail ?? false,
          sendLoginCredentials: res.sendLoginCredentials ?? false

        });

        this.disableReadOnlyFields();

        this.imagePreview = res.photoUrl
          ? this.getImageUrl(res.photoUrl)
          : '/images/blank-profile.png';
      },

      error: (err) => {
        console.error('Get Technician Error:', err);
        alert('Failed to load laboratory technician data.');
      }

    });
}
  private disableReadOnlyFields(): void {

    this.form.get('firstName')?.disable();

    this.form.get('lastName')?.disable();

    this.form.get('gender')?.disable();

    this.form.get('dateOfBirth')?.disable();

    this.form.get('nationality')?.disable();

    this.form.get('nationalId')?.disable();

    this.form.get('username')?.disable();

    this.form.get('joiningDate')?.disable();

  }

  // =========================
  // Format Date
  // =========================

  private formatDate(date: string | null | undefined): string {
    if (!date) {
      return '';
    }
    return date.substring(0, 10);
  }

  // =========================
  // Build Image URL
  // =========================

  getImageUrl(photoUrl: string | null | undefined): string {

    if (!photoUrl) {
      return '/images/blank-profile.png';
    }

    // If API already returns full URL
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }

    // Remove duplicated slash
    const cleanPhotoUrl = photoUrl.startsWith('/') ? photoUrl : `/${photoUrl}`;

    return `${this.apiBaseUrl}${cleanPhotoUrl}`;
  }

  // =========================
  // Select Image
  // =========================

  onImageSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must not exceed 5 MB.');
      input.value = '';
      return;
    }

    // Allowed types
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      alert('Only PNG, JPG and JPEG images are allowed.');
      input.value = '';
      return;
    }

    this.selectedImage = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);

  }

  // =========================
  // Submit Update
  // =========================

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const v = this.form.getRawValue();

    // =========================
    // Personal Information
    // =========================

    formData.append('firstName', v.firstName ?? '');
    formData.append('lastName', v.lastName ?? '');
    formData.append('gender', v.gender ?? '0');
    formData.append('dateOfBirth', v.dateOfBirth ?? '');
    formData.append('nationality', v.nationality ?? '');
    formData.append('nationalId', v.nationalId ?? '');

    // =========================
// Employment Information
// =========================

formData.append(
  'laboratoryId',
  v.laboratoryId?.toString() ?? ''
);

formData.append('jobTitle', v.jobTitle ?? '');
formData.append('employmentStatus', v.employmentStatus ?? '1');
formData.append('workShift', v.workShift ?? '1');
formData.append('joiningDate', v.joiningDate ?? '');
formData.append(
  'yearsOfExperience',
  String(v.yearsOfExperience ?? 0)
);

    // =========================
    // Contact Information
    // =========================

    formData.append('phoneNumber', v.phoneNumber ?? '');
    formData.append('alternativePhone', v.alternativePhone ?? '');
    formData.append('email', v.email ?? '');
    formData.append('address', v.address ?? '');
    formData.append('city', v.city ?? '');
    formData.append('country', v.country ?? '');
    formData.append('postalCode', v.postalCode ?? '');

    // =========================
    // Account Information
    // =========================

    formData.append('username', v.username ?? '');
    formData.append('allowLogin', String(v.allowLogin ?? false));
    formData.append('accountActive', String(v.accountActive ?? false));
    formData.append('receiveNotifications', String(v.receiveNotifications ?? false));
    formData.append('sendWelcomeEmail', String(v.sendWelcomeEmail ?? false));
    formData.append('sendLoginCredentials', String(v.sendLoginCredentials ?? false));

    // =========================
    // New Photo
    // =========================

    if (this.selectedImage) {
      formData.append('photoUrl', this.selectedImage, this.selectedImage.name);
    }

    // =========================
    // Update API
    // =========================

    this.adminService
      .updateLabTechnician(this.technicianNationalId, formData)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            text: 'Laboratory Technician Updated Successfully',
            showConfirmButton: true
          });
          this.router.navigate(['/admin/dashboard/labtechnicians/all-lab-technicians']);
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Something went wrong.',
            text: err?.error?.message ?? 'Please try again later.',
            showConfirmButton: true
          });
        }
      });
  }

}
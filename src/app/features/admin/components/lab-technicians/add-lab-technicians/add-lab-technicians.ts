import {
  Component,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { AdminService } from '../../../../../core/services/admin-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-lab-technicians',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './add-lab-technicians.html',
  styleUrl: './add-lab-technicians.css'
})
export class AddLabTechnicians {

  private fb = inject(FormBuilder);

  private adminService = inject(AdminService);

  private router = inject(Router);


  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;


  selectedImage: File | null = null;

  imagePreview: string | null = null;


  form = this.fb.group({

    // =========================
    // Personal Information
    // =========================

    firstName: [
      '',
      Validators.required
    ],

    lastName: [
      '',
      Validators.required
    ],

    gender: [
      1,
      Validators.required
    ],

    dateOfBirth: [
      '',
      Validators.required
    ],

    nationality: [
      '',
      Validators.required
    ],

    nationalId: [
      '',
      [
        Validators.required,
        Validators.maxLength(14)
      ]
    ],


    // =========================
    // Employment Information
    // =========================

    laboratoryId: [
      null,
      Validators.required
    ],

    jobTitle: [
      '',
      Validators.required
    ],

    employmentStatus: [
      1,
      Validators.required
    ],

    workShift: [
      1,
      Validators.required
    ],

    joiningDate: [
      '',
      Validators.required
    ],

    yearsOfExperience: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],


    // =========================
    // Contact Information
    // =========================

    phoneNumber: [
      '',
      Validators.required
    ],

    alternativePhone: [
      ''
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    address: [
      '',
      Validators.required
    ],

    city: [
      '',
      Validators.required
    ],

    country: [
      '',
      Validators.required
    ],

    postalCode: [
      ''
    ],


    // =========================
    // Account Information
    // =========================

    username: [
      '',
      Validators.required
    ],

    password: [
      '',
      Validators.required
    ],


    // =========================
    // System Settings
    // =========================

    allowLogin: [
      true
    ],

    accountActive: [
      true
    ],

    receiveNotifications: [
      true
    ],

    sendWelcomeEmail: [
      true
    ],

    sendLoginCredentials: [
      true
    ]

  });


  // =========================
  // Image Selection
  // =========================

  onImageSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;


    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;

    }


    const file =
      input.files[0];


    // =========================
    // Maximum File Size: 5 MB
    // =========================

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        'Image size must not exceed 5 MB.'
      );

      input.value = '';

      return;

    }


    // =========================
    // Allowed File Types
    // =========================

    const allowedTypes = [

      'image/png',

      'image/jpeg',

      'image/jpg'

    ];


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      alert(
        'Only PNG, JPG and JPEG images are allowed.'
      );

      input.value = '';

      return;

    }


    this.selectedImage =
      file;


    // =========================
    // Image Preview
    // =========================

    const reader =
      new FileReader();


    reader.onload = () => {

      this.imagePreview =
        reader.result as string;

    };


    reader.readAsDataURL(
      file
    );

  }


  // =========================
  // Submit
  // =========================

  submit(): void {


    // =========================
    // Validate Form
    // =========================

    if (
      this.form.invalid
    ) {

      this.form.markAllAsTouched();

      return;

    }


    const formData =
      new FormData();


    // =========================
    // Personal Information
    // =========================

    formData.append(
      'firstName',

      this.form.value.firstName ?? ''
    );


    formData.append(
      'lastName',

      this.form.value.lastName ?? ''
    );


    formData.append(
      'gender',

      String(
        this.form.value.gender ?? 0
      )
    );


    formData.append(
      'dateOfBirth',

      this.form.value.dateOfBirth ?? ''
    );


    formData.append(
      'nationality',

      this.form.value.nationality ?? ''
    );


    formData.append(
      'nationalId',

      this.form.value.nationalId ?? ''
    );


    // =========================
    // Employment Information
    // =========================

    formData.append(
      'laboratoryId',

      String(
        this.form.value.laboratoryId ?? ''
      )
    );


    formData.append(
      'jobTitle',

      this.form.value.jobTitle ?? ''
    );


    formData.append(
      'employmentStatus',

      String(
        this.form.value.employmentStatus ?? 1
      )
    );


    formData.append(
      'workShift',

      String(
        this.form.value.workShift ?? 1
      )
    );


    formData.append(
      'joiningDate',

      this.form.value.joiningDate ?? ''
    );


    formData.append(
      'yearsOfExperience',

      String(
        this.form.value.yearsOfExperience ?? 0
      )
    );


    // =========================
    // Contact Information
    // =========================

    formData.append(
      'phoneNumber',

      this.form.value.phoneNumber ?? ''
    );


    formData.append(
      'alternativePhone',

      this.form.value.alternativePhone ?? ''
    );


    formData.append(
      'email',

      this.form.value.email ?? ''
    );


    formData.append(
      'address',

      this.form.value.address ?? ''
    );


    formData.append(
      'city',

      this.form.value.city ?? ''
    );


    formData.append(
      'country',

      this.form.value.country ?? ''
    );


    formData.append(
      'postalCode',

      this.form.value.postalCode ?? ''
    );


    // =========================
    // Account Information
    // =========================

    formData.append(
      'username',

      this.form.value.username ?? ''
    );


    formData.append(
      'password',

      this.form.value.password ?? ''
    );


    // =========================
    // System Settings
    // =========================

    formData.append(
      'allowLogin',

      String(
        this.form.value.allowLogin ?? false
      )
    );


    formData.append(
      'accountActive',

      String(
        this.form.value.accountActive ?? false
      )
    );


    formData.append(
      'receiveNotifications',

      String(
        this.form.value.receiveNotifications ?? false
      )
    );


    formData.append(
      'sendWelcomeEmail',

      String(
        this.form.value.sendWelcomeEmail ?? false
      )
    );


    formData.append(
      'sendLoginCredentials',

      String(
        this.form.value.sendLoginCredentials ?? false
      )
    );


    // =========================
    // Profile Photo
    // =========================

    if (
      this.selectedImage
    ) {

      formData.append(

        'photoUrl',

        this.selectedImage,

        this.selectedImage.name

      );

    }


    // =========================
    // Debug FormData
    // =========================

    for (
      const pair of formData.entries()
    ) {

      console.log(
        pair[0],
        pair[1]
      );

    }


    // =========================
    // Call API
    // =========================

    this.adminService
      .addLabTechnician(
        formData
      )
      .subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            text: 'Lab Technician added successfully',
            showConfirmButton: true
          }).then(() => {
            this.router.navigate([
              '/admin/dashboard/labtechnicians/all-lab-technicians'
            ]);
          })
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            text: err.error.message,
            showConfirmButton: true
          })
        }
      });
  }
}
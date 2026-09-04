import {
  Component,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';

import {
  AbstractControl,
  ValidationErrors,
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterLink
} from '@angular/router';

import { AdminService } from '../../../../../core/services/admin-service.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-lab-technicians',
  standalone: true,
  imports: [
    CommonModule,
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


  // =========================================================
  // Image
  // =========================================================

  selectedImage: File | null = null;
  imagePreview: string | null = null;
  imageError = '';


  // =========================================================
  // Custom Validators
  // =========================================================

  private egyptianPhoneValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const value = control.value;

    // Optional field
    if (!value) {
      return null;
    }

    const phone = String(value).replace(/\s+/g, '');

    const pattern =
      /^(01[0125]\d{8}|\+201[0125]\d{8})$/;

    return pattern.test(phone)
      ? null
      : { invalidEgyptianPhone: true };
  }


  private dateOfBirthValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    if (!control.value) {
      return null;
    }

    const birthDate = new Date(control.value);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
      return { invalidDate: true };
    }

    if (birthDate > today) {
      return { futureDate: true };
    }

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        today.getDate() < birthDate.getDate()
      )
    ) {
      age--;
    }

    if (age < 18) {
      return { underAge: true };
    }

    if (age > 100) {
      return { invalidAge: true };
    }

    return null;
  }


  private joiningDateValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    if (!control.value) {
      return null;
    }

    const joiningDate = new Date(control.value);
    const today = new Date();

    today.setHours(
      23,
      59,
      59,
      999
    );

    if (joiningDate > today) {
      return { futureJoiningDate: true };
    }

    return null;
  }


  // =========================================================
  // Form
  // =========================================================

  form = this.fb.group({

    // -------------------------------------------------------
    // Personal Information
    // -------------------------------------------------------

    firstName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(
          /^[A-Za-z\u0600-\u06FF\s]+$/
        )
      ]
    ],

    lastName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(
          /^[A-Za-z\u0600-\u06FF\s]+$/
        )
      ]
    ],

    gender: [
      0,
      Validators.required
    ],

    dateOfBirth: [
      '',
      [
        Validators.required,
        this.dateOfBirthValidator.bind(this)
      ]
    ],

    nationality: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(
          /^[A-Za-z\u0600-\u06FF\s]+$/
        )
      ]
    ],

    nationalId: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{14}$/)
      ]
    ],


    // -------------------------------------------------------
    // Employment Information
    // -------------------------------------------------------

    laboratoryId: [
      null,
      Validators.required
    ],

    jobTitle: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]
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
      [
        Validators.required,
        this.joiningDateValidator.bind(this)
      ]
    ],

    yearsOfExperience: [
      0,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(50),
        Validators.pattern(/^\d+$/)
      ]
    ],


    // -------------------------------------------------------
    // Contact Information
    // -------------------------------------------------------

    phoneNumber: [
      '',
      [
        Validators.required,
        this.egyptianPhoneValidator.bind(this)
      ]
    ],

    alternativePhone: [
      '',
      [
        this.egyptianPhoneValidator.bind(this)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(150)
      ]
    ],

    address: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(250)
      ]
    ],

    city: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(
          /^[A-Za-z\u0600-\u06FF\s]+$/
        )
      ]
    ],

    country: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(
          /^[A-Za-z\u0600-\u06FF\s]+$/
        )
      ]
    ],

    postalCode: [
      '',
      [
        Validators.pattern(/^\d{4,10}$/)
      ]
    ],


    // -------------------------------------------------------
    // Account Information
    // -------------------------------------------------------

    username: [
      '',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
        Validators.pattern(
          /^[a-zA-Z0-9_.-]+$/
        )
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/
        )
      ]
    ],


    // -------------------------------------------------------
    // Settings
    // -------------------------------------------------------

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


  // =========================================================
  // Image Selection
  // =========================================================

  onFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.imageError = '';

    if (
      !input.files ||
      input.files.length === 0
    ) {
      return;
    }

    const file = input.files[0];

    // -------------------------------------------------------
    // File Type
    // -------------------------------------------------------

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg'
    ];

    if (!allowedTypes.includes(file.type)) {

      this.imageError =
        'Only PNG, JPG and JPEG images are allowed.';

      input.value = '';
      this.selectedImage = null;
      this.imagePreview = null;

      return;
    }


    // -------------------------------------------------------
    // File Size - 5 MB
    // -------------------------------------------------------

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {

      this.imageError =
        'Image size must not exceed 5MB.';

      input.value = '';
      this.selectedImage = null;
      this.imagePreview = null;

      return;
    }


    // -------------------------------------------------------
    // Save File
    // -------------------------------------------------------

    this.selectedImage = file;


    // -------------------------------------------------------
    // Preview
    // -------------------------------------------------------

    const reader =
      new FileReader();

    reader.onload = () => {

      this.imagePreview =
        reader.result as string;

    };

    reader.readAsDataURL(file);
  }


  // =========================================================
  // Submit
  // =========================================================

  submit(): void {

    // -------------------------------------------------------
    // Validate Form
    // -------------------------------------------------------

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Invalid Information',
        text: 'Please check the form and correct the highlighted fields.'
      });

      return;
    }


    // -------------------------------------------------------
    // Validate Image
    // -------------------------------------------------------

    if (this.imageError) {

      Swal.fire({
        icon: 'warning',
        title: 'Invalid Image',
        text: this.imageError
      });

      return;
    }


    // -------------------------------------------------------
    // Get Form Values
    // -------------------------------------------------------

    const value =
      this.form.getRawValue();


    // -------------------------------------------------------
    // FormData
    // -------------------------------------------------------

    const formData =
      new FormData();


    // -------------------------------------------------------
    // Personal Information
    // -------------------------------------------------------

    formData.append(
      'FirstName',
      value.firstName?.trim() ?? ''
    );

    formData.append(
      'LastName',
      value.lastName?.trim() ?? ''
    );

    formData.append(
      'Gender',
      String(value.gender ?? '')
    );

    formData.append(
      'DateOfBirth',
      value.dateOfBirth ?? ''
    );

    formData.append(
      'Nationality',
      value.nationality?.trim() ?? ''
    );

    formData.append(
      'NationalId',
      value.nationalId?.trim() ?? ''
    );


    // -------------------------------------------------------
    // Employment Information
    // -------------------------------------------------------

    formData.append(
      'LaboratoryId',
      String(value.laboratoryId ?? '')
    );

    formData.append(
      'JobTitle',
      value.jobTitle?.trim() ?? ''
    );

    formData.append(
      'EmploymentStatus',
      String(value.employmentStatus ?? '')
    );

    formData.append(
      'WorkShift',
      String(value.workShift ?? '')
    );

    formData.append(
      'JoiningDate',
      value.joiningDate ?? ''
    );

    formData.append(
      'YearsOfExperience',
      String(value.yearsOfExperience ?? 0)
    );


    // -------------------------------------------------------
    // Contact Information
    // -------------------------------------------------------

    formData.append(
      'PhoneNumber',
      value.phoneNumber?.trim() ?? ''
    );

    formData.append(
      'AlternativePhone',
      value.alternativePhone?.trim() ?? ''
    );

    formData.append(
      'Email',
      value.email?.trim() ?? ''
    );

    formData.append(
      'Address',
      value.address?.trim() ?? ''
    );

    formData.append(
      'City',
      value.city?.trim() ?? ''
    );

    formData.append(
      'Country',
      value.country?.trim() ?? ''
    );

    formData.append(
      'PostalCode',
      value.postalCode?.trim() ?? ''
    );


    // -------------------------------------------------------
    // Account Information
    // -------------------------------------------------------

    formData.append(
      'Username',
      value.username?.trim() ?? ''
    );

    formData.append(
      'Password',
      value.password ?? ''
    );


    // -------------------------------------------------------
    // Settings
    // -------------------------------------------------------

    formData.append(
      'AllowLogin',
      String(value.allowLogin ?? false)
    );

    formData.append(
      'AccountActive',
      String(value.accountActive ?? false)
    );

    formData.append(
      'ReceiveNotifications',
      String(value.receiveNotifications ?? false)
    );

    formData.append(
      'SendWelcomeEmail',
      String(value.sendWelcomeEmail ?? false)
    );

    formData.append(
      'SendLoginCredentials',
      String(value.sendLoginCredentials ?? false)
    );


    // -------------------------------------------------------
    // Image
    // -------------------------------------------------------

    if (this.selectedImage) {

      formData.append(
        'PhotoUrl',
        this.selectedImage
      );
    }


    // -------------------------------------------------------
    // API Call
    // -------------------------------------------------------

    this.adminService
      .addLabTechnician(formData)
      .subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Laboratory technician added successfully.',
            confirmButtonText: 'OK'
          }).then(() => {

            this.router.navigate([
              '/admin/laboratory-technicians'
            ]);

          });

        },


        error: (err: any) => {

          console.error(
            'Add Laboratory Technician Error:',
            err
          );

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              err?.error?.message ??
              'Failed to add laboratory technician. Please try again later.'
          });

        }

      });

  }


  // =========================================================
  // Cancel
  // =========================================================

  cancel(): void {

    this.router.navigate([
      '/admin/laboratory-technicians'
    ]);

  }

}
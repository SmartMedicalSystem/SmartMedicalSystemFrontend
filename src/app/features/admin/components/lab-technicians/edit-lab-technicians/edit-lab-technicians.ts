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

import { AdminService } from '../../../../../core/services/admin-service';

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

  private readonly apiBaseUrl =
    'https://smartmedicalsystem.runasp.net';


  // =========================
  // Technician National ID
  // =========================

  technicianNationalId = '';


  // =========================
  // Image
  // =========================

  selectedImage: File | null = null;

  imagePreview: string | null = null;


  // =========================
  // Form
  // =========================

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
      0,
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
      Validators.required
    ],


    // =========================
    // Employment Information
    // =========================

    laboratoryId: [
      0,
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
  // On Init
  // =========================

  ngOnInit(): void {

    const nationalId =
      this.route.snapshot.paramMap.get('nationalId')
      ??
      this.route.parent?.snapshot.paramMap.get('nationalId');


    if (!nationalId) {

      console.error(
        'National ID was not found in route'
      );

      alert(
        'Technician National ID Not Found'
      );

      return;

    }


    this.technicianNationalId =
      nationalId;


    console.log(
      'National ID from URL:',
      this.technicianNationalId
    );


    this.loadTechnician();

  }


  // =========================
  // Load Technician
  // =========================

  loadTechnician(): void {

    this.adminService
      .getLabTechnicianById(
        this.technicianNationalId
      )
      .subscribe({

        next: (res) => {

          console.log(
            'Technician data received:',
            res
          );


          // =========================
          // Patch Form
          // =========================

          this.form.patchValue({

            // Personal

            firstName:
              res.firstName ?? '',

            lastName:
              res.lastName ?? '',

            gender:
              res.gender ?? 0,

            dateOfBirth:
              this.formatDate(
                res.dateOfBirth
              ),

            nationality:
              res.nationality ?? '',

            nationalId:
              res.nationalId ?? '',


            // Employment

            laboratoryId:
              res.laboratoryId ?? 0,

            jobTitle:
              res.jobTitle ?? '',

            employmentStatus:
              res.employmentStatus ?? 1,

            workShift:
              res.workShift ?? 1,

            joiningDate:
              this.formatDate(
                res.joiningDate
              ),

            yearsOfExperience:
              res.yearsOfExperience ?? 0,


            // Contact

            phoneNumber:
              res.phoneNumber ?? '',

            alternativePhone:
              res.alternativePhone ?? '',

            email:
              res.email ?? '',

            address:
              res.address ?? '',

            city:
              res.city ?? '',

            country:
              res.country ?? '',

            postalCode:
              res.postalCode ?? '',


            // Account

            username:
              res.username ?? '',

            allowLogin:
              res.allowLogin ?? false,

            accountActive:
              res.accountActive ?? false,

            receiveNotifications:
              res.receiveNotifications ?? false,

            sendWelcomeEmail:
              res.sendWelcomeEmail ?? false,

            sendLoginCredentials:
              res.sendLoginCredentials ?? false

          });


          // =========================
          // Existing Photo
          // =========================

          if (res.photoUrl) {

            this.imagePreview =
              this.getImageUrl(
                res.photoUrl
              );

          }

          else {

            this.imagePreview =
              '/images/blank-profile.png';

          }


          console.log(
            'Image URL:',
            this.imagePreview
          );

        },


        error: (err) => {

          console.error(
            'Get Technician Error:',
            err
          );

          alert(
            'Failed to load laboratory technician data.'
          );

        }

      });

  }


  // =========================
  // Format Date
  // =========================

  private formatDate(
    date: string | null | undefined
  ): string {

    if (!date) {

      return '';

    }


    return date.substring(
      0,
      10
    );

  }


  // =========================
  // Build Image URL
  // =========================

  getImageUrl(
    photoUrl: string | null | undefined
  ): string {

    if (!photoUrl) {

      return '/images/blank-profile.png';

    }


    // If API already returns full URL

    if (
      photoUrl.startsWith('http://')
      ||
      photoUrl.startsWith('https://')
    ) {

      return photoUrl;

    }


    // Remove duplicated slash

    const cleanPhotoUrl =
      photoUrl.startsWith('/')
        ? photoUrl
        : `/${photoUrl}`;


    return `${this.apiBaseUrl}${cleanPhotoUrl}`;

  }


  // =========================
  // Select Image
  // =========================

  onImageSelected(
    event: Event
  ): void {

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


    // Maximum 5 MB

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


    // Allowed types

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
  // Submit Update
  // =========================

  submit(): void {

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
        this.form.value.laboratoryId ?? 0
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
    // New Photo
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
    // Update API
    // =========================

    this.adminService
      .updateLabTechnician(

        this.technicianNationalId,

        formData

      )
      .subscribe({

        next: () => {

          alert(
            'Laboratory Technician Updated Successfully'
          );


          this.router.navigate([

            '/admin/dashboard/labtechnicians/all-lab-technicians'

          ]);

        },


        error: (err) => {

          console.error(
            'Update Technician Error:',
            err
          );


          console.error(
            'Status:',
            err.status
          );


          console.error(
            'Error Body:',
            err.error
          );


          alert(

            err.error?.message
            ??
            err.error?.title
            ??
            'Something went wrong.'

          );

        }

      });

  }

}
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { DoctorService } from '../../../../core/services/doctor-service.service';
import {
  DoctorReadDto,
  DoctorUpdateDto,
} from '../../../../shared/interfaces/Doctor/doctor.interface';
import {
  ProfileUpdateDto,
  ChangePasswordRequestDto,
} from '../../../../shared/interfaces/Doctor/profile.interface';
import { AuthenticationService } from '../../../../core/services/authenticationService.service';
import { getCurrentDoctorIdFromToken } from '../../../../core/utils/jwt-utils';

// الحقول المتاحة فعليًا مجمّعة من مصدرين:
// - firstName/lastName/email/phoneNumber/address -> ProfileController (self-service)
// - specialization/contact/gender/dateOfBirth/departmentId/city/country/postalCode -> DoctorsController
interface ProfileForm {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  specialization: string;
  contact: string;
  email: string;
  phoneNumber: string;
  address: string;
  departmentId: number;
  departmentName: string;
  city: string;
  country: string;
  postalCode: string;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  constructor(
    private doctorService: DoctorService,
    private authService: AuthenticationService
  ) { }

  // id الدكتور الحالي بيتجاب من claims التوكن (nameidentifier/sub) مش من الـ URL.
  private doctorId!: number;

  // NationalId مطلوب في DoctorUpdateDto لكنه مش قابل للتعديل من اليوزر — بنحفظه
  // من أول تحميل ونرجّعه زي ما هو في أي Update عشان الباك مايمسحوش.
  private nationalId = '';

  loading = signal(true);
  loadError = signal<string | null>(null);
  saving = signal(false);
  saveError = signal<string | null>(null);
  saveSuccess = signal(false);

  // ---------- Photo ----------
  private readonly photoBaseUrl = 'https://smartmedicalsystem.runasp.net/';

  private resolvePhotoUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    return `${this.photoBaseUrl}${path.replace(/^\/+/, '')}`;
  }

  currentPhotoUrl = signal<string | null>(null);
  selectedImage: File | null = null;
  photoPreviewUrl = signal<string | null>(null);

  // toggles
  receiveNotifications = signal(true);
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  // ---------- Change Password ----------
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  changingPassword = signal(false);
  passwordError = signal<string | null>(null);
  passwordSuccess = signal(false);

  form: ProfileForm = {
    firstName: '',
    lastName: '',
    gender: 'Male',
    dateOfBirth: '',
    specialization: '',
    contact: '',
    email: '',
    phoneNumber: '',
    address: '',
    departmentId: 0,
    departmentName: '',
    city: '',
    country: '',
    postalCode: '',
  };

  profileExtra = {
    nationality: '',
    licenseNumber: '',
    yearsOfExperience: '',
    registrationId: '',
    city: '',
    country: '',
    username: '',
  };

  // ========== AI Chat ==========
  chatOpen = signal(false);
  chatLoading = signal(false);
  chatInput = signal('');

  chatMessages = signal<
    {
      role: 'user' | 'ai';
      content: string;
    }[]
  >([
    {
      role: 'ai',
      content: 'Hello, I am your AI medical assistant. Ask me anything.',
    },
  ]);

  ngOnInit(): void {
    const token = this.authService.getAccessToken();
    const id = getCurrentDoctorIdFromToken(token);
    const tokenPhotoUrl = this.authService.userImage() || null;

    if (!id) {
      this.loadError.set('Could not determine the current doctor from the session, please sign in again.');
      this.loading.set(false);
      return;
    }

    this.doctorId = id;
    this.loading.set(true);
    this.loadError.set(null);

    forkJoin({
      doctor: this.doctorService.getDoctorById(id),
      profile: this.doctorService.getMyProfile(id),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ doctor, profile }) => {
          this.nationalId = doctor.encryptedNationalId ?? '';
          this.form = {
            firstName: profile.firstName ?? '',
            lastName: profile.lastName ?? '',
            gender: doctor.gender,
            dateOfBirth: doctor.dateOfBirth ? doctor.dateOfBirth.slice(0, 10) : '',
            specialization: doctor.specialization,
            contact: doctor.contact,
            email: profile.email ?? doctor.email,
            phoneNumber: profile.phoneNumber ?? doctor.phoneNumber ?? '',
            address: profile.address ?? doctor.address,
            departmentId: doctor.departmentId,
            departmentName: doctor.departmentName ?? '',
            // ⚠️ دلوقتي DoctorsController.GetById فعلاً بيرجع city/country/postalCode
            // (الباك اتعدل)، فبنقراهم من doctor.* مباشرة بدل ما نسيبهم زي ما هما.
            city: doctor.city ?? '',
            country: doctor.country ?? '',
            postalCode: doctor.postalCode ?? '',
          };
          this.currentPhotoUrl.set(
            this.resolvePhotoUrl(profile.photoUrl) ?? this.resolvePhotoUrl(doctor.photoUrl) ?? tokenPhotoUrl
          );
        },
        error: () => this.loadError.set('Failed to load profile data.'),
      });
  }

  // ---------- Photo ----------
  ChangePicture(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.selectedImage = file;
    this.photoPreviewUrl.set(URL.createObjectURL(file));
  }

  toggleNotifications(): void {
    this.receiveNotifications.update((v) => !v);
  }

  toggleCurrentPassword(): void {
    this.showCurrentPassword.update((v) => !v);
  }

  toggleNewPassword(): void {
    this.showNewPassword.update((v) => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  onReset(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  onSaveChanges(): void {
    if (!this.doctorId) {
      this.saveError.set('Cannot save without a valid doctor ID.');
      return;
    }

    if (!this.form.city.trim() || !this.form.country.trim()) {
      this.saveError.set('City and Country are required.');
      return;
    }

    const profileDto: ProfileUpdateDto = {
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      email: this.form.email,
      phoneNumber: this.form.phoneNumber,
      address: this.form.address,
      photo: this.selectedImage ?? undefined,
    };

    const doctorDto: DoctorUpdateDto = {
      name: `${this.form.firstName} ${this.form.lastName}`.trim(),
      specialization: this.form.specialization,
      contact: this.form.contact,
      dateOfBirth: this.form.dateOfBirth,
      email: this.form.email,
      mobileNumber: this.form.phoneNumber,
      address: this.form.address,
      gender: this.form.gender,
      nationalId: this.nationalId,
      departmentId: this.form.departmentId,
      city: this.form.city,
      country: this.form.country,
      postalCode: this.form.postalCode || undefined,
    };

    this.saving.set(true);
    this.saveError.set(null);
    this.saveSuccess.set(false);

    forkJoin({
      profile: this.doctorService.updateMyProfile(this.doctorId, profileDto),
      doctor: this.doctorService.updateDoctor(this.doctorId, doctorDto),
    })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: ({ profile, doctor }) => {
          this.form = {
            firstName: profile.firstName ?? this.form.firstName,
            lastName: profile.lastName ?? this.form.lastName,
            gender: doctor.gender,
            dateOfBirth: doctor.dateOfBirth ? doctor.dateOfBirth.slice(0, 10) : '',
            specialization: doctor.specialization,
            contact: doctor.contact,
            email: profile.email ?? doctor.email,
            phoneNumber: profile.phoneNumber ?? doctor.phoneNumber ?? '',
            address: profile.address ?? doctor.address,
            departmentId: doctor.departmentId,
            departmentName: doctor.departmentName ?? '',
            // ⚠️ بعد الحفظ برضو بنقرا city/country/postalCode من رد الـ Update
            // مباشرة (بدل ما نسيب اللي بعتناه)، بما إن الباك بقى بيرجّعهم فعلاً.
            city: doctor.city ?? this.form.city,
            country: doctor.country ?? this.form.country,
            postalCode: doctor.postalCode ?? this.form.postalCode,
          };
          this.nationalId = doctor.encryptedNationalId ?? this.nationalId;
          const newPhoto = this.resolvePhotoUrl(profile.photoUrl) ?? this.resolvePhotoUrl(doctor.photoUrl) ?? this.currentPhotoUrl();
          this.currentPhotoUrl.set(newPhoto);
          this.selectedImage = null;
          this.photoPreviewUrl.set(null);
          this.saveSuccess.set(true);
          this.authService.setUserImage(newPhoto);
        },
        error: (err) => {
          console.error('Save changes failed - full error body:', err?.error);
          const body = err?.error;
          const backendMessage =
            body?.Message ||
            body?.title ||
            body?.detail ||
            (Array.isArray(body) ? body.map((e: any) => e.message ?? JSON.stringify(e)).join(' | ') : null) ||
            (body?.errors ? JSON.stringify(body.errors) : null) ||
            (typeof body === 'string' ? body : null);
          this.saveError.set(backendMessage ?? 'Failed to save changes, please try again.');
        },
      });
  }

  // ---------- Change Password ----------
  onChangePassword(): void {
    this.passwordError.set(null);
    this.passwordSuccess.set(false);

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError.set('Please fill in all password fields.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError.set('New password and confirmation do not match.');
      return;
    }

    const dto: ChangePasswordRequestDto = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    };

    this.changingPassword.set(true);

    this.doctorService
      .changePassword(this.doctorId, dto)
      .pipe(finalize(() => this.changingPassword.set(false)))
      .subscribe({
        next: () => {
          this.passwordSuccess.set(true);
          this.onReset();
        },
        error: () => this.passwordError.set('Failed to change password, check your current password and try again.'),
      });
  }

  // ========== AI Chat Methods ==========

  toggleChat(): void {
    this.chatOpen.update((value) => !value);
  }

  sendChatMessage(): void {
    const question = this.chatInput().trim();

    if (!question || this.chatLoading()) {
      return;
    }

    this.chatMessages.update((messages) => [
      ...messages,
      { role: 'user', content: question },
    ]);

    this.chatInput.set('');
    this.chatLoading.set(true);

    this.doctorService
      .askPatientAI({
        patientId: null,
        question: question,
        groupByPatient: true,
      })
      .pipe(finalize(() => this.chatLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.chatMessages.update((messages) => [
            ...messages,
            { role: 'ai', content: response.answer },
          ]);
        },
        error: () => {
          this.chatMessages.update((messages) => [
            ...messages,
            { role: 'ai', content: 'Sorry, something went wrong while contacting AI.' },
          ]);
        },
      });
  }
}
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
// - specialization/contact/gender/dateOfBirth/departmentId -> DoctorsController
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
  ) {}

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
  // photoUrl الراجعة من GetMyProfile مسار نسبي (زي "/uploads/xyz.jpg") محتاج
  // نحط قدامه base URL السيرفر - نفس المنطق المستخدم في
  // AuthenticationService.setToken() عشان الصورة تفضل متسقة في كل الصفحة.
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
  };

  // TODO: الحقول دي مش موجودة في أي DTO حاليًا — placeholder لحد ما الباك يضيفها
  profileExtra = {
    nationality: '',
    licenseNumber: '',
    yearsOfExperience: '',
    registrationId: '',
    city: '',
    country: '',
    username: '',
  };

  ngOnInit(): void {
    const token = this.authService.getAccessToken();
    const id = getCurrentDoctorIdFromToken(token);
    // fallback أول تحميل لحد ما رد GetMyProfile يوصل (وده المصدر الأساسي فعليًا)
    const tokenPhotoUrl = this.authService.userImageSignal() || null;

    if (!id) {
      this.loadError.set('Could not determine the current doctor from the session, please sign in again.');
      this.loading.set(false);
      return;
    }

    this.doctorId = id;
    this.loading.set(true);
    this.loadError.set(null);

    // بيانات Professional من DoctorsController + بيانات Personal/Contact/الصورة
    // من ProfileController (self-service) - بنجيبهم مع بعض ونجمّعهم في فورم واحد.
    forkJoin({
      doctor: this.doctorService.getDoctorById(id),
      profile: this.doctorService.getMyProfile(id),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ doctor, profile }) => {
          this.nationalId = doctor.nationalId ?? '';
          this.form = {
            firstName: profile.firstName ?? '',
            lastName: profile.lastName ?? '',
            gender: doctor.gender,
            dateOfBirth: doctor.dateOfBirth ? doctor.dateOfBirth.slice(0, 10) : '',
            specialization: doctor.specialization,
            contact: doctor.contact,
            email: profile.email ?? doctor.email,
            phoneNumber: profile.phoneNumber ?? String(doctor.mobileNumber ?? ''),
            address: profile.address ?? doctor.address,
            departmentId: doctor.departmentId,
            departmentName: doctor.departmentName ?? '',
          };
          // profile.photoUrl (من الداتابيز، عن طريق GetMyProfile) هو المصدر الأساسي
          // للصورة لأنه الأحدث دايمًا. لو رجع فاضي (مثلاً استجابة ناقصة)، بنرجع
          // لقيمة التوكن كـ fallback بس - التوكن ممكن يكون فيه صورة قديمة لو
          // الدكتور غيّرها من غير ما يعمل login/refresh-token جديد.
          this.currentPhotoUrl.set(this.resolvePhotoUrl(profile.photoUrl) ?? tokenPhotoUrl);
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

    // معاينة فورية قبل الرفع
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
      mobileNumber: Number(this.form.phoneNumber) || 0,
      address: this.form.address,
      gender: this.form.gender,
      nationalId: this.nationalId,
      departmentId: this.form.departmentId,
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
            phoneNumber: profile.phoneNumber ?? String(doctor.mobileNumber ?? ''),
            address: profile.address ?? doctor.address,
            departmentId: doctor.departmentId,
            departmentName: doctor.departmentName ?? '',
          };
          this.nationalId = doctor.nationalId ?? this.nationalId;
          // بعد الحفظ بنعتمد على رد الـ API مباشرة (فيه الصورة الجديدة لو
          // اتغيّرت)، مش على التوكن، لأن التوكن نفسه لسه شايل القيمة القديمة
          // لحد ما يتعمل refresh-token/login جديد.
          this.currentPhotoUrl.set(this.resolvePhotoUrl(profile.photoUrl) ?? this.currentPhotoUrl());
          this.selectedImage = null;
          this.photoPreviewUrl.set(null);
          this.saveSuccess.set(true);
        },
        error: () => this.saveError.set('Failed to save changes, please try again.'),
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
}

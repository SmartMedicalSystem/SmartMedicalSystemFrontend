import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
interface ProfileForm {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  medicalSpecialty: string;
  department: string;
  licenseNumber: string;
  yearsOfExperience: string;
  registrationId: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  country: string;
  username: string;
}
@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  // toggles
  receiveNotifications = signal(true);
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  // password fields (kept separate from main profile form)
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  form: ProfileForm = {
    firstName: 'Ahmed',
    lastName: 'Hassan',
    gender: 'Male',
    dateOfBirth: '1985-03-15',
    nationality: 'Egyptian',
    medicalSpecialty: 'Cardiology',
    department: 'Cardiology',
    licenseNumber: 'MED-4562-84',
    yearsOfExperience: '18',
    registrationId: '2022-4587-856',
    email: 'a.hassan@stmarys-health.org',
    phone: '+20 123 456 7890',
    city: 'Cairo',
    address: 'Street 45, Heliopolis District',
    country: 'Egypt',
    username: 'ahmed_doc',
  };

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
    console.log('Saving profile', this.form);
  }
}

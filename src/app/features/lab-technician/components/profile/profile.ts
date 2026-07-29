import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabTechService } from '../../../../core/services/lab-tech-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {

  isEditing = false;

  profile = {
    id: 0,
    userId: 0,
    firstName: '',
    lastName: '',
    fullName: '',
    gender: 'Male',
    dateOfBirth: '',
    nationality: '',
    nationalId: '',
    profilePictureUrl: '',
    employeeId: '',
    assignedLaboratory: '',
    jobTitle: '',
    yearsOfExperience: 0,
    status: '',
    joiningDate: '',
    email: '',
    phoneNumber: '',
    address: ''
  };

  // مؤقتاً لحين ربط الـ Login
  profileId = 1;

  constructor(
    private labTechProfileService: LabTechService
  ) {
    this.LoadLabTechProfile();
  }

  LoadLabTechProfile(): void {
    this.labTechProfileService.ProfileOpen(this.profileId).subscribe({
      next: (res) => {
        console.log('Profile Loaded:', res);

        this.profile = res;

        // حفظ الـ id الحقيقي بعد أول GET
        this.profileId = res.id;
      },
      error: (err) => {
        console.error('Failed to load profile', err);

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err?.error?.message || err?.error?.Message || 'Failed to Load Profile',
        });
      }
    });
  }

  editProfile(): void {
    this.isEditing = true;
  }

  saveProfile(): void {
    this.labTechProfileService
      .ProfileSaveChanges(this.profileId, this.profile)
      .subscribe({
        next: (res) => {

          console.log('Profile Updated:', res);

          this.profile = res;

          this.isEditing = false;

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Profile Updated Successfully'
          });
        },
        error: (err) => {

          console.error('Update Failed', err);

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err?.error?.message || err?.error?.Message || 'Failed to Save Profile',
          });
        }
      });
  }

  cancel(): void {
    this.isEditing = false;
    this.LoadLabTechProfile();
  }

  ChangePassword(): void {

    // هنكملها لما نعمل شاشة Change Password
    // لأن الـ Endpoint بيستقبل بيانات الباسورد
    // وليس صورة.

  }

}

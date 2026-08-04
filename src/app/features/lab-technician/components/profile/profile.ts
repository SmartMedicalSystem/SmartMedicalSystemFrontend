import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { LabTechService } from '../../../../core/services/lab-tech-service.service';
import { AuthenticationService } from '../../../../core/services/authenticationService.service';

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

  profileId = 0;

  constructor(
    private labTechProfileService: LabTechService,
    private authService: AuthenticationService,

  ) {
    this.LoadLabTechProfile();
  }

  LoadLabTechProfile(): void {
    this.labTechProfileService.ProfileOpen(this.authService.getUserId()).subscribe({
      next: (res) => {
        this.profile = res;
        this.profileId = this.authService.getUserId();
        this.profile.profilePictureUrl = `https://smartmedicalsystem.runasp.net/${res.photoUrl}`;
        this.profile.dateOfBirth = res.dateOfBirth
          ? res.dateOfBirth.split('T')[0]
          : '';
      },
      error: (err) => {
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
    const formData = new FormData();
    formData.append('FirstName', this.profile.firstName);
    formData.append('LastName', this.profile.lastName);
    formData.append('Email', this.profile.email);
    formData.append('PhoneNumber', this.profile.phoneNumber);
    formData.append('Address', this.profile.address);

    if (this.selectedImage) {
      formData.append('PhotoUrl', this.selectedImage);
    }
    this.labTechProfileService
      .ProfileSaveChanges(this.profileId, formData)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.profile = res;
          this.isEditing = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Profile Updated Successfully'
          }).then(() => {
            const imageUrl =
              `https://smartmedicalsystem.runasp.net/${res.photoUrl}`;
            this.authService.setUserImage(imageUrl);
            this.LoadLabTechProfile();
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

  selectedImage: File | null = null;
  ChangePicture(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    this.selectedImage = file;
    this.profile.profilePictureUrl = URL.createObjectURL(file);
  }

}

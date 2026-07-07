import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {

  profile = {

    firstName: 'Alex',

    lastName: 'Rivera',

    gender: 'Male',

    birthDate: '1992-08-24',

    nationality: 'American',

    nationalId: 'ID-98234-AX',

    employeeId: 'LAB-2024-0512',

    lab: 'Central Hematology Lab',

    jobTitle: 'Senior Laboratory Technician',

    experience: 8,

    email: 'alex.rivera@labnexuspro.com',

    phone: '+1 (555) 123-4567',

    address: '125 Medical Street, New York, USA'

  };

  saveProfile() {

    console.log('Profile Saved');

    console.log(this.profile);

    alert('Profile Saved Successfully');

  }

  cancel() {

    alert('Changes Cancelled');

  }

}

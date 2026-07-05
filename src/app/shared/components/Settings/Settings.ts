import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface UserProfile {
  fullName: string;
  employeeId: string;
  email: string;
  phone: string;
  department: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  profile = signal<UserProfile>({
    fullName: 'Julian Vance',
    employeeId: 'RA-890-21-8',
    email: 'j.vance@medial.com',
    phone: '+1 (555) 012-3456',
    department: 'Radiology & Imaging',
    avatarUrl: 'https://i.pravatar.cc/150?img=12'
  });

  labs = ['Main Wing Lab-04', 'East Wing Lab-01', 'West Wing Lab-02'];
  printers = ['HP LaserJet - Lab 4 (North)', 'Canon ImageClass - Lab 2', 'Brother HL - Lab 1'];

  defaultLab = signal(this.labs[0]);
  defaultPrinter = signal(this.printers[0]);

  barcodeScanner = signal(true);
  autoPrintLabels = signal(false);

  emailNotifications = signal(true);
  newTestRequests = signal(true);
  urgentCriticalAlerts = signal(true);

  passwordLastUpdated = signal('3 months ago');

  toggleBarcodeScanner() {
    this.barcodeScanner.update(v => !v);
  }

  toggleAutoPrintLabels() {
    this.autoPrintLabels.update(v => !v);
  }

  toggleEmailNotifications() {
    this.emailNotifications.update(v => !v);
  }

  toggleNewTestRequests() {
    this.newTestRequests.update(v => !v);
  }

  toggleUrgentCriticalAlerts() {
    this.urgentCriticalAlerts.update(v => !v);
  }

  onEditProfile() {
    console.log('Edit profile');
  }

  onChangePassword() {
    console.log('Change password');
  }

  onCancel() {
    console.log('Cancel changes');
  }

  onSaveChanges() {
    console.log('Save changes', {
      defaultLab: this.defaultLab(),
      defaultPrinter: this.defaultPrinter(),
      barcodeScanner: this.barcodeScanner(),
      autoPrintLabels: this.autoPrintLabels(),
      emailNotifications: this.emailNotifications(),
      newTestRequests: this.newTestRequests(),
      urgentCriticalAlerts: this.urgentCriticalAlerts()
    });
  }
}
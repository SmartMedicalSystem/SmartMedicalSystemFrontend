import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private colors = {
    primary: '#0d5ebb',
    secondary: '#0da39b',
    tertiary: '#a14400',
    neutral: '#f8f9fa',
  };

  success(message: string, title = 'Success') {
    return Swal.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonColor: this.colors.primary,
      background: '#fff',
      customClass: { popup: 'rounded-xl' },
    });
  }

  error(message: string, title = 'Error') {
    return Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonColor: this.colors.tertiary,
      background: '#fff',
      customClass: { popup: 'rounded-xl' },
    });
  }

  warning(message: string, title = 'Warning') {
    return Swal.fire({
      icon: 'warning',
      title,
      text: message,
      confirmButtonColor: this.colors.tertiary,
      background: '#fff',
      customClass: { popup: 'rounded-xl' },
    });
  }

  confirm(
    message: string,
    title = 'Are you sure?',
    confirmText = 'Yes, confirm'
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'question',
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancel',
      confirmButtonColor: this.colors.primary,
      cancelButtonColor: this.colors.secondary,
      background: '#fff',
      customClass: { popup: 'rounded-xl' },
    });
  }
}
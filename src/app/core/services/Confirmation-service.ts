// core/services/confirmation.service.ts
import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ConfirmOptions } from '../../shared/interfaces/Confirmation/confirm-options';



@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  confirmDelete(itemName: string = 'this item'): Promise<boolean> {
    return this.confirm({
      title: 'Are you sure?',
      text: `You are about to delete ${itemName}. This action cannot be undone.`,
      icon: 'warning',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
    });
  }

  confirm(options: ConfirmOptions): Promise<boolean> {
    return Swal.fire({
      title: options.title ?? 'Are you sure?',
      text: options.text ?? '',
      icon: options.icon ?? 'warning',
      showCancelButton: true,
      confirmButtonColor: options.confirmButtonColor ?? '#3085d6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: options.confirmButtonText ?? 'Yes',
      cancelButtonText: options.cancelButtonText ?? 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl',
      },
    }).then((result) => result.isConfirmed);
  }

  showSuccess(title: string, text?: string): void {
    Swal.fire({
      title,
      text,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });
  }

  showError(title: string = 'Error!', text?: string): void {
    Swal.fire({
      title,
      text: text ?? 'Something went wrong. Please try again.',
      icon: 'error',
    });
  }
}

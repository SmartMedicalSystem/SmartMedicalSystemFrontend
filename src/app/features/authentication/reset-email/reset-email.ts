import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthenticationService } from '../../../core/services/authenticationService.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-email',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-email.html',
  styleUrl: './reset-email.css',
})
export class ResetEmail {
  isLoading = signal(false);
  authService = inject(AuthenticationService);
  router = inject(Router);
  resetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  //getters
  get emailRequired() {
    return this.resetForm.get('email')?.touched && this.resetForm.get('email')?.hasError('required');
  }

  get emailInvalid() {
    return this.resetForm.get('email')?.touched && this.resetForm.get('email')?.hasError('email');
  }

  reset() {
    this.isLoading.set(true);
    const email = this.resetForm.get('email')?.value || '';
    this.authService.resetEmail(email).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Email sent successfully',
          text: res.message,
          showConfirmButton: true,
        }).then(() => {
          this.router.navigate(['/auth/reset-success'], { state: { email } });
          this.isLoading.set(false);
        })
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          text: err.message,
          showConfirmButton: true,
        }).then(() => {
          this.isLoading.set(false);
        })
      }
    })
  }
}

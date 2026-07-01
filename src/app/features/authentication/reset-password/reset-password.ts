import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthenticationService } from '../../../core/services/authenticationService';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
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
    this.authService.resetPassword(email).subscribe({
      next: (res) => {
        this.router.navigate(['/auth/reset-success'], {
          state: { email }
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
      }
    })
  }

}

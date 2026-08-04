import { NgClass } from '@angular/common';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../../../shared/Validators/password.validator';
import { AuthenticationService } from '../../../core/services/authenticationService.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-password',
  imports: [ReactiveFormsModule, NgClass,],
  templateUrl: './new-password.html',
  styleUrl: './new-password.css',
})
export class NewPassword {
  email = signal<string>('');
  authService = inject(AuthenticationService);
  isLoading = signal(false)

  constructor(private router: Router) {
    this.email.set(router.url.split('=')[1]);
  }
  newPasswordForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      passwordValidator(),
    ]),
    confirmPassword: new FormControl('', Validators.required),
  });

  //================ Password =================

  get password() {
    return this.newPasswordForm.get('password');
  }

  get passwordInteracted() {
    return this.password?.dirty ?? false;
  }

  get requiredError() {
    return this.password?.hasError('required');
  }

  get minLengthError() {
    return this.password?.hasError('minLength');
  }

  get upperLowerError() {
    return this.password?.hasError('upperLower');
  }

  get numberError() {
    return this.password?.hasError('number');
  }

  get specialError() {
    return this.password?.hasError('special');
  }

  //================ Confirm Password =================
  get confirmPassword() {
    return this.newPasswordForm.get('confirmPassword');
  }

  get confirmRequired() {
    return !!this.confirmPassword?.value;
  }

  get passwordsMatch() {
    return (
      !!this.password?.value &&
      !!this.confirmPassword?.value &&
      this.password?.value === this.confirmPassword?.value
    );
  }


  update() {
    this.isLoading.set(true);
    this.authService.resetPassword({ email: this.email() || '', newPassword: this.password?.value || '' }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        Swal.fire({
          icon: 'success',
          title: 'Password updated successfully',
          text: res.message + '\nPlease login again',
          showConfirmButton: true,
        }).then(() => {
          this.router.navigate(['/auth/login']);
        })
      },
      error: (err) => {
        this.isLoading.set(false);
        Swal.fire({
          icon: 'error',
          text: err.message,
          showConfirmButton: true,
        })
      }
    })

  }

  @ViewChild('inp_P') inp_P: ElementRef | null = null;
  @ViewChild('eye_P') eye_P: ElementRef | null = null;
  toggle_P = signal(true);
  togglePassword() {
    if (this.toggle_P()) {
      this.eye_P?.nativeElement.classList.remove('fa-eye-slash');
      this.eye_P?.nativeElement.classList.add('fa-eye');
      this.inp_P!.nativeElement.type = 'text';
      this.toggle_P.set(false);
    } else {
      this.eye_P?.nativeElement.classList.add('fa-eye-slash');
      this.eye_P?.nativeElement.classList.remove('fa-eye');
      this.inp_P!.nativeElement.type = 'password';
      this.toggle_P.set(true);
    }
  }

  @ViewChild('inp_C') inp_C: ElementRef | null = null;
  @ViewChild('eye_C') eye_C: ElementRef | null = null;
  toggle_C = signal(true);
  toggleConfirmPassword() {
    if (this.toggle_C()) {
      this.eye_C?.nativeElement.classList.remove('fa-eye-slash');
      this.eye_C?.nativeElement.classList.add('fa-eye');
      this.inp_C!.nativeElement.type = 'text';
      this.toggle_C.set(false);
    } else {
      this.eye_C?.nativeElement.classList.add('fa-eye-slash');
      this.eye_C?.nativeElement.classList.remove('fa-eye');
      this.inp_C!.nativeElement.type = 'password';
      this.toggle_C.set(true);
    }
  }

}

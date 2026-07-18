import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authenticationService';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Loader } from "../../../shared/components/loader/loader";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, Loader],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  isLoading = signal(false);

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  // ================= Getters =================

  get emailRequired() {
    return this.loginForm.get('email')?.touched &&
      this.loginForm.get('email')?.hasError('required');
  }

  get emailInvalid() {
    return this.loginForm.get('email')?.touched &&
      this.loginForm.get('email')?.hasError('email');
  }

  get passwordRequired() {
    return this.loginForm.get('password')?.touched &&
      this.loginForm.get('password')?.hasError('required');
  }

  get passwordInvalid() {
    return this.loginForm.get('password')?.touched &&
      this.loginForm.get('password')?.hasError('minlength');
  }

  // ================= Login =================

  login(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginObj = {
      userNameOrEmail: this.loginForm.get('email')?.value || '',
      password: this.loginForm.get('password')?.value || ''
    };

    this.isLoading.set(true);

    this.authService.login(loginObj).subscribe({
      next: () => {

        const role = this.authService.getUserRole();

        switch (role) {

          case 'Doctor':
            void this.router.navigate(['doctor']);
            break;

          case 'Admin':
            void this.router.navigate(['admin']);
            break;

          case 'LabTechnician':
            void this.router.navigate(['labtechnician']);
            break;

          default:
            void this.router.navigate(['403']);
            break;
        }

        this.isLoading.set(false);
      },

      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      }
    });
  }

  // ================= Password =================

  @ViewChild('inp') inp!: ElementRef<HTMLInputElement>;
  @ViewChild('eye') eye!: ElementRef<HTMLElement>;

  toggle = signal(true);

  togglePassword(): void {

    if (this.toggle()) {

      this.eye.nativeElement.classList.remove('fa-eye-slash');
      this.eye.nativeElement.classList.add('fa-eye');

      this.inp.nativeElement.type = 'text';

    } else {

      this.eye.nativeElement.classList.add('fa-eye-slash');
      this.eye.nativeElement.classList.remove('fa-eye');

      this.inp.nativeElement.type = 'password';
    }

    this.toggle.update(value => !value);
  }
}
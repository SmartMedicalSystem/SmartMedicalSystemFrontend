import { Component, ElementRef, Signal, signal, viewChild, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authenticationService';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {


  isLoading = signal(false);
  constructor(private authService: AuthenticationService, private router: Router) {
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  // getters
  get emailRequired() {
    return this.loginForm.get('email')?.touched && this.loginForm.get('email')?.hasError('required');
  }

  get emailInvalid() {
    return this.loginForm.get('email')?.touched && this.loginForm.get('email')?.hasError('email');
  }

  get passwordRequired() {
    return this.loginForm.get('password')?.touched && this.loginForm.get('password')?.hasError('required');
  }

  get passwordInvalid() {
    return this.loginForm.get('password')?.touched && this.loginForm.get('password')?.hasError('minlength');
  }

  // end getters
  login() {
    let loginObj = {
      email: this.loginForm.get('email')?.value || '',
      password: this.loginForm.get('password')?.value || ''
    }
    this.isLoading.set(true);
    this.authService.login(loginObj).subscribe({
      next: (res) => {
        this.authService.setToken('// token here //');
        const decoded = jwtDecode(res.token) as any;
        const role = decoded.role;
        switch (role) {
          case 'Doctor':
            this.router.navigate(['doctor']);
            break;
          case 'Admin':
            this.router.navigate(['admin']);
            break;
          case 'LabTechnician':
            this.router.navigate(['laboratory']);
            break;
          default:
            this.router.navigate(['403']);
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

  @ViewChild('inp') inp: ElementRef | null = null;
  @ViewChild('eye') eye: ElementRef | null = null;
  toggle = signal(true);
  togglePassword() {
    if (this.toggle()) {
      this.eye?.nativeElement.classList.remove('fa-eye-slash');
      this.eye?.nativeElement.classList.add('fa-eye');
      this.inp!.nativeElement.type = 'text';
      this.toggle.set(false);
    } else {
      this.eye?.nativeElement.classList.add('fa-eye-slash');
      this.eye?.nativeElement.classList.remove('fa-eye');
      this.inp!.nativeElement.type = 'password';
      this.toggle.set(true);
    }
  }
}

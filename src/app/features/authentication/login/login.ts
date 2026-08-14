import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authenticationService.service';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Loader } from "../../../shared/components/loader/loader";
import Swal from 'sweetalert2';
import { NotificationHubService } from '../../../core/services/notification-hub.service';
import { NotificationStoreService } from '../../../core/services/notification-store.service';

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
    private router: Router,
    private notificationHub: NotificationHubService,
    private notificationStore: NotificationStoreService
  ) { }

  loginForm = new FormGroup({
    userNameOrEmail: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  // ================= Getters =================

  get userNameOrEmailRequired() {
    return this.loginForm.get('userNameOrEmail')?.touched &&
      this.loginForm.get('userNameOrEmail')?.hasError('required');
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
      userNameOrEmail: this.loginForm.get('userNameOrEmail')?.value ?? '',
      password: this.loginForm.get('password')?.value ?? ''
    };

    this.isLoading.set(true);

    this.authService.login(loginObj).subscribe({

      next: async (res) => {

        Swal.fire({
          icon: 'success',
          text: res.message,
          showConfirmButton: true
        });

        const role = this.authService.getUserRole();

        switch (role) {

          case 'Doctor':
            await this.router.navigate(['doctor']);
            break;

          case 'Admin':
            await this.router.navigate(['admin']);
            break;

          case 'LabTechnician':
            await this.router.navigate(['labtechnician']);
            break;

          default:
            await this.router.navigate(['403']);
            break;

        }

        // try {

        //   await this.notificationHub.startConnection();

        //   this.notificationStore.loadInitialData();

        // } catch (error) {

        //   console.error('SignalR failed to connect', error);

        // }

        this.isLoading.set(false);

      },

      error: (err) => {

        Swal.fire({
          icon: 'error',
          text: err.error.Message,
          showConfirmButton: true
        });

        this.isLoading.set(false);

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
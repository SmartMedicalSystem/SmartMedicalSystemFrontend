import { Component, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthenticationService } from '../../../core/services/authenticationService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  isLoading = signal(false);
  constructor(private authService: AuthenticationService, private router: Router) {
  }
  login() {
    this.isLoading.set(true);
    this.authService.login('', '').subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['']);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}

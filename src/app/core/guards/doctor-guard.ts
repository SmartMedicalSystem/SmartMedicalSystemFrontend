import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../services/authenticationService';
import { jwtDecode } from 'jwt-decode';

export const doctorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const token = authService.getAccessToken();
  if (!token) {
    return false;
  }
  const decoded = jwtDecode(token) as any;
  return decoded.role === 'Doctor';
};

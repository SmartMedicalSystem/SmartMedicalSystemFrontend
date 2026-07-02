import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthenticationService } from '../services/authenticationService';

export const laboratoryGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const token = authService.getAccessToken();
  if (!token) {
    return false;
  }
  const decoded = jwtDecode(token) as any;
  return decoded.role === 'LabTechnician';
};

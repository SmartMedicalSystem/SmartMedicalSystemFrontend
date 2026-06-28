import { inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authenticationService';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (!authService.getCurrentUser().role.includes('Admin')) {
    router.navigate(['/403']);
    return false;
  }
  return true; //authService.isAuthenticated() ? true : router.navigate(['/auth']);
};

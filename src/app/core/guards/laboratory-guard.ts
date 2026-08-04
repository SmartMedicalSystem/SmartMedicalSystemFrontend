import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authenticationService.service';
import { catchError, map, of } from 'rxjs';

export const laboratoryGuard: CanActivateFn = () => {

  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const checkRole = () => {
    return authService.getUserRole() === 'LabTechnician'
      ? true
      : router.createUrlTree(['/403']);
  };

  if (authService.isAuthenticated()) {
    return checkRole();
  }

  if (authService.getRefreshToken()) {
    return authService.restoreSession().pipe(
      map(() => checkRole()),
      catchError(() => {
        authService.clearToken();
        return of(router.createUrlTree(['/auth']));
      })
    );
  }

  return router.createUrlTree(['/auth']);
};
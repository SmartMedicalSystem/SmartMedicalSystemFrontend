import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authenticationService.service';
import { catchError, map, of } from 'rxjs';

export const guestGuard: CanActivateFn = () => {

  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const redirectByRole = () => {

    switch (authService.getUserRole()) {

      case 'Admin':
        return router.createUrlTree(['/admin/dashboard/home']);

      case 'Doctor':
        return router.createUrlTree(['/doctor/dashboard/home']);

      case 'LabTechnician':
        return router.createUrlTree(['/labtechnician/dashboard/home']);

      default:
        return true;
    }

  };

  // المستخدم بالفعل مسجل دخول
  if (authService.isAuthenticated()) {
    return redirectByRole();
  }

  // عنده Refresh Token، نجرب نسترجع الـ Session
  if (authService.getRefreshToken()) {

    return authService.restoreSession().pipe(

      map(() => redirectByRole()),

      catchError(() => {
        authService.clearToken();
        return of(true); // اسمح له يدخل صفحة Login
      })

    );

  }

  // لا Access ولا Refresh
  return true;
};
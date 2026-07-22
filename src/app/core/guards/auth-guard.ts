import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authenticationService';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    return true;
  }
  // if (authService.getRefreshToken()) {
  //   return authService.restoreSession().pipe(
  //     map(() => true),
  //     catchError(() => {
  //       authService.clearToken();
  //       return of(router.createUrlTree(['/auth']));
  //     })
  //   );
  // }
  return router.createUrlTree(['/auth']);
};
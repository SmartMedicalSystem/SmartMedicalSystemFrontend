import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authenticationService';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  const token = authService.getToken();
  if (!token) {
    return next(req);
  }

  return next(req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  }));
};

import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';

import {
  catchError,
  switchMap,
  throwError
} from 'rxjs';

import { AuthenticationService } from '../services/authenticationService';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  const token = authService.getAccessToken();

  const authReq = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Access Token Expired
      if (
        error.status === 401 &&
        authService.getRefreshToken() &&
        !authReq.url.endsWith('/refresh')
      ) {
        return authService.refreshToken().pipe(
          switchMap((refreshResponse) => {
            authService.setToken(
              refreshResponse.accessToken,
              refreshResponse.refreshToken
            );
            const newRequest = authReq.clone({
              setHeaders: {
                Authorization: `Bearer ${refreshResponse.accessToken}`
              }
            });
            return next(newRequest);
          }),
          catchError(err => {
            authService.logout();
            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
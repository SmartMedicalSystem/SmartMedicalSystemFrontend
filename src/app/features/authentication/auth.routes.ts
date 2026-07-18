import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/guest-guard';

export const authRoutes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login')
            .then(m => m.Login)
      },
      {
        path: 'reset',
        loadComponent: () =>
          import('./reset-email/reset-email').then(m => m.ResetEmail)
      },
      {
        path: 'reset-success',
        loadComponent: () =>
          import('./reset-success/reset-success').then(m => m.ResetSuccess)
      },
      {
        path: 'new-password',
        loadComponent: () =>
          import('./new-password/new-password').then(m => m.NewPassword)
      }
    ]
  }
];
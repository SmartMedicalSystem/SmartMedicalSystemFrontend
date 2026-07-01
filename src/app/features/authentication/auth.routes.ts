import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'auth',
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
          import('./reset-password/reset-password').then(m => m.ResetPassword)
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
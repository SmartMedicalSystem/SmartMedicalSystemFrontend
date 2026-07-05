import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { adminGuard } from '../../core/guards/admin-guard';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    // canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard')
            .then(m => m.Dashboard),
        children: [
          {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full'
          },
          {
            path: 'home',
            loadComponent: () =>
              import('./components/home/home')
                .then(m => m.Home)
          },
          {
            path: 'diagnostics',
            loadComponent: () =>
              import('./components/diagnostics/diagnostics')
                .then(m => m.Diagnostics)
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('../../shared/components/Settings/Settings')
                .then(m => m.Settings)
          },
          {
            path: 'patient-managment',
            loadComponent: () =>
              import('../Patient/patient-managment/patient-managment').then(
                (m) => m.PatientManagment,
              ),
          },
        ]
      }
    ]
  }
];
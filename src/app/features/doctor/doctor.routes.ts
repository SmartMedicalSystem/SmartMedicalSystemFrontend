import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { doctorGuard } from '../../core/guards/doctor-guard';
export const doctorRoutes: Routes = [
  {
    path: 'doctor',
    // canActivate: [authGuard, doctorGuard],
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
        ]
      }
    ]
  }
];
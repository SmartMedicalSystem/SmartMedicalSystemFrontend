import { Routes } from '@angular/router';
import { authRoutes } from './features/authentication/auth.routes';
import { adminRoutes } from './features/admin/admin.routes';
import { doctorRoutes } from './features/doctor/doctor.routes';
import { laboratoryRoutes } from './features/laboratory/lab.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },

  ...authRoutes,
  ...adminRoutes,
  ...doctorRoutes,
  ...laboratoryRoutes,

  {
    path: '**',
    loadComponent: () =>
      import('./errors/not-found/not-found')
        .then(m => m.NotFound)
  }
];

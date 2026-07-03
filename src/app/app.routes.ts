import { Routes } from '@angular/router';
import { authRoutes } from './features/authentication/auth.routes';
import { mainRoutes } from './features/main/main.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },

  ...authRoutes,
  ...mainRoutes,

  {
    path: '403',
    loadComponent: () =>
      import('./errors/unauthorized/unauthorized')
        .then(m => m.Unauthorized)
  },

  {
    path: '404',
    loadComponent: () =>
      import('./errors/not-found/not-found')
        .then(m => m.NotFound)
  },

  {
    path: '**',
    loadComponent: () =>
      import('./errors/not-found/not-found')
        .then(m => m.NotFound)
  }
];

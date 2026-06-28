import { Routes } from '@angular/router';
import { authRoutes } from './features/authentication/auth.routes';
import { mainRoutes } from './features/main/main.routes';
import { Unauthorized } from './errors/unauthorized/unauthorized';
import { NotFound } from './errors/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },

  ...authRoutes,
  ...mainRoutes,
  { path: '403', component: Unauthorized },
  { path: '404', component: NotFound },

  {
    path: '**',
    loadComponent: () => import('./errors/not-found/not-found').then((m) => m.NotFound),
  },
];

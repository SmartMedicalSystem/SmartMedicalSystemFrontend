import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { adminGuard } from '../../core/guards/admin-guard';
import { Laboratory } from './laboratory/laboratory';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    // canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'laboratory',
        component: Laboratory
      }
    ]
  }
];
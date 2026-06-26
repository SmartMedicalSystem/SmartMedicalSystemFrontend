import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { adminGuard } from '../../core/guards/admin-guard';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
    ]
  }
];
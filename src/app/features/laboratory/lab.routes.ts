import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { laboratoryGuard } from '../../core/guards/laboratory-guard';

export const laboratoryRoutes: Routes = [
  {
    path: 'laboratory',
    canActivate: [authGuard, laboratoryGuard],
    children: [
    ]
  }
];
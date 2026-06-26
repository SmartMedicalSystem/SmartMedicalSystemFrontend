import { Routes } from '@angular/router';
import { Main } from './main';
import { adminRoutes } from '../admin/admin.routes';
import { doctorRoutes } from '../doctor/doctor.routes';
import { laboratoryRoutes } from '../laboratory/lab.routes';
import { authGuard } from '../../core/guards/auth-guard';

export const mainRoutes: Routes = [
  {
    path: '',
    component: Main,
    canActivate: [authGuard],
    children: [
      ...adminRoutes,
      ...doctorRoutes,
      ...laboratoryRoutes
    ]
  }
];
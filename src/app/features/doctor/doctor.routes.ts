import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { doctorGuard } from '../../core/guards/doctor-guard';
export const doctorRoutes: Routes = [
  {
    path: 'doctor',
    // canActivate: [authGuard, doctorGuard],
    children: [
    ]
  }
];
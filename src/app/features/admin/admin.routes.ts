import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { adminGuard } from '../../core/guards/admin-guard';
import { Laboratory } from './laboratory/laboratory';

export const adminRoutes: Routes = [
  {
    path: 'admin',
<<<<<<< HEAD
    //canActivate: [authGuard, adminGuard],
=======
    // canActivate: [authGuard, adminGuard],
>>>>>>> 793a6e55b709d79a5315fb8e2ebed92e281e77e4
    children: [
      {
        path: 'laboratory',
        component: Laboratory
      }
    ]
  }
];
import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { laboratoryGuard } from '../../core/guards/laboratory-guard';
import { LabDashboard } from './lab-dashboard/lab-dashboard';
import { TestRequests } from './test-requests/test-requests';
import { Results } from './results/results';
import { Patients } from './patients/patients';
import { Notifications } from './notifications/notifications';

export const laboratoryRoutes: Routes = [
  {
    path: 'laboratory',
    canActivate: [authGuard, laboratoryGuard],
    children: [
      { path: '', component: LabDashboard },
      { path: 'requests', component: TestRequests },
      { path: 'results', component: Results },
      { path: 'patients', component: Patients },
      { path: 'notifications', component: Notifications },
    ],
  },
];

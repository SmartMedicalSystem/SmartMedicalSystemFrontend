import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { adminGuard } from '../../core/guards/admin-guard';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { Doctors } from './doctors/doctors';
import { Patients } from './patients/patients';
import { Laboratories } from './laboratories/laboratories';
import { Tests } from './tests/tests';
import { AiReports } from './ai-reports/ai-reports';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', component: AdminDashboard },
      { path: 'doctors', component: Doctors },
      { path: 'patients', component: Patients },
      { path: 'laboratories', component: Laboratories },
      { path: 'tests', component: Tests },
      { path: 'ai-reports', component: AiReports },
    ],
  },
];

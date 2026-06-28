import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { doctorGuard } from '../../core/guards/doctor-guard';
import { DoctorDashboard } from './doctor-dashboard/doctor-dashboard';
import { Patients } from './patients/patients';
import { Sessions } from './sessions/sessions';
import { LabTests } from './lab-tests/lab-tests';
import { AiReports } from './ai-reports/ai-reports';
import { Notifications } from './notifications/notifications';
export const doctorRoutes: Routes = [
  {
    path: 'doctor',
    canActivate: [authGuard, doctorGuard],
    children: [
      { path: '', component: DoctorDashboard },
      { path: 'patients', component: Patients },
      { path: 'sessions', component: Sessions },
      { path: 'lab-tests', component: LabTests },
      { path: 'ai-reports', component: AiReports },
      { path: 'notifications', component: Notifications },
    ],
  },
];

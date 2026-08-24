import { Routes } from '@angular/router';
import { doctorGuard } from '../../core/guards/doctor-guard';
import { NotificationPage } from '../../shared/components/notification-page/notification-page';
export const doctorRoutes: Routes = [
  {
    path: 'doctor',
    canActivate: [doctorGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard')
            .then(m => m.Dashboard),
        children: [
          {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full'
          },
          {
            path: 'home',
            loadComponent: () =>
              import('./components/home/home')
                .then(m => m.Home)
          },
          {
            path: 'notification',
            loadComponent: () =>
              import('../../shared/components/notification-page/notification-page')
                .then(m => m.NotificationPage)
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./components/profile/profile')
                .then(m => m.Profile)
          },
          {
            path: 'patient-result/:id',
            loadComponent: () =>
              import('./components/patient-result-detail/patient-result-detail')
                .then(m => m.PatientResultDetail)
          },
          {
            path: 'patients',
            loadComponent: () =>
              import('../patient/patients')
                .then(m => m.Patients),
            children: [
              {
                path: '',
                redirectTo: 'all-patients',
                pathMatch: 'full'
              },
              {
                path: 'all-patients',
                loadComponent: () =>
                  import('../patient/all-patients/all-patients')
                    .then(m => m.AllPatients)
              },
              {
                path: 'patient-details/:id',
                loadComponent: () =>
                  import('../patient/patient-details/patient-details')
                    .then(m => m.PatientDetails)
              },
              {
                path: 'new-lab-test/:id',
                loadComponent: () =>
                  import('./components/lab-test/lab-test')
                    .then(m => m.LabTest)
              },
              {
                path: 'create-session/:patientId',
                loadComponent: () =>
                  import('./components/create-session/create-session')
                    .then(m => m.CreateSession)
              }
            ]
          }
        ]
      }
    ]
  }
];

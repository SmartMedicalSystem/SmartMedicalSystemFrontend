import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { doctorGuard } from '../../core/guards/doctor-guard';
export const doctorRoutes: Routes = [
  {
    path: 'doctor',
    canActivate: [authGuard, doctorGuard],
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
            path: 'profile',
            loadComponent: () =>
              import('./components/profile/profile')
                .then(m => m.Profile)
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
                path: 'patient-details', //:id
                loadComponent: () =>
                  import('../patient/patient-details/patient-details')
                    .then(m => m.PatientDetails)
              },
              {
                path: 'new-lab-test',
                loadComponent: () =>
                  import('./components/lab-test/lab-test')
                    .then(m => m.LabTest)
              }
            ]
          }
        ]
      }
    ]
  }
];
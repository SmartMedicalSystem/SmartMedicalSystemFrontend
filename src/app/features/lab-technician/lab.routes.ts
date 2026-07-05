import { Routes } from '@angular/router';

export const laboratoryRoutes: Routes = [
  {
    path: 'labtechnician',
    //canActivate: [authGuard, laboratoryGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
        children: [
          {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full',
          },
          {
            path: 'home',
            loadComponent: () => import('./components/home/home').then((m) => m.Home),
          },
          {
            path: 'laboratory',
            loadComponent: () =>
              import('./components/laboratory/laboratory').then((m) => m.Laboratory),
          },
          {
            path: 'patient-managment',
            loadComponent: () =>
              import('../Patient/patient-managment/patient-managment').then(
                (m) => m.PatientManagment,
              ),
          },
          {
            path: 'LabTechSettings',
            loadComponent: () =>
              import('./components/lab-tech-settings/lab-tech-settings')
                .then(m => m.LabTechSettings)
          },
          {
            path: 'diagnostics',
            loadComponent: () =>
              import('./components/diagnostics/diagnostics')
                .then(m => m.Diagnostics)
          },
          {
            path: 'admin',
            loadComponent: () =>
              import('./components/admin-console/admin-console')
                .then((a) => a.AdminConsole),
          },
        ],
      },
    ],
  },
];

import { Routes } from '@angular/router';
import { laboratoryGuard } from '../../core/guards/laboratory-guard';
import { NotificationPage } from '../../shared/components/notification-page/notification-page';

export const laboratoryRoutes: Routes = [
  {
    path: 'labtechnician',
    canActivate: [laboratoryGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard')
            .then((m) => m.Dashboard),

        children: [

          {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full',
          },
          {
            path: 'home',
            loadComponent: () =>
              import('./components/home/home')
                .then((m) => m.Home),
          },

          {
            path: 'profile',
            loadComponent: () =>
              import('./components/profile/profile')
                .then((m) => m.Profile),
          },

          {
            path: 'requests',
            loadComponent: () =>
              import('./components/requests/requests')
                .then((m) => m.Requests),

            children: [

              {
                path: '',
                redirectTo: 'all-requests',
                pathMatch: 'full',
              },

              {
                path: 'all-requests',
                loadComponent: () =>
                  import('./components/requests/all-requests/all-requests')
                    .then((m) => m.AllRequests),
              },

              {
                path: 'test-results/:id',
                loadComponent: () =>
                  import('./components/requests/test-results/test-results')
                    .then((m) => m.TestResults),
              },
            ],
          },
          {
            path: 'PatientFullReport/:id',
            loadComponent: () =>
              import('./components/patient-full-report/patient-full-report')
                .then((m) => m.PatientFullReport),
          },
          {
            path: 'notification',
            component: NotificationPage
          },
        ],
      },
    ],
  },
];
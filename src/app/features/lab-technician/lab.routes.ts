import { Routes } from '@angular/router';

export const laboratoryRoutes: Routes = [
  {
    path: 'labtechnician',
    //canActivate: [authGuard, laboratoryGuard],
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
            path: 'laboratory',
            loadComponent: () =>
              import('./components/laboratory/laboratory')
                .then(m => m.Laboratory)
          }
        ]
      },
    ]
  }
];
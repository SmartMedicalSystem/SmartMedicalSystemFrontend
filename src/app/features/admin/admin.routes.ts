import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin-guard';
import { NotificationPage } from '../../shared/components/notification-page/notification-page';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    canActivate: [adminGuard],
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
            path: 'patients',
            loadComponent: () => import('../patient/patients').then((m) => m.Patients),
            children: [
              {
                path: '',
                redirectTo: 'all-patients',
                pathMatch: 'full',
              },
              {
                path: 'all-patients',
                loadComponent: () =>
                  import('../patient/all-patients/all-patients').then((m) => m.AllPatients),
              },
              {
                path: 'edit-patients/:id', // :id
                loadComponent: () =>
                  import('../patient/edit-patient/edit-patient').then((m) => m.EditPatient),
              },
              {
                path: 'add-patients',
                loadComponent: () =>
                  import('../patient/add-patients/add-patients').then((m) => m.AddPatients),
              },
            ],
          },
          {
            path: 'doctors',
            loadComponent: () => import('./components/doctors/doctors').then((m) => m.Doctors),
            children: [
              {
                path: '',
                redirectTo: 'all-doctors',
                pathMatch: 'full',
              },
              {
                path: 'all-doctors',
                loadComponent: () =>
                  import('./components/doctors/all-doctors/all-doctors').then((m) => m.AllDoctors),
              },
              {
                path: 'edit-doctors/:id', // :id
                loadComponent: () =>
                  import('./components/doctors/edit-doctors/edit-doctors').then(
                    (m) => m.EditDoctors,
                  ),
              },
              {
                path: 'add-doctors',
                loadComponent: () =>
                  import('./components/doctors/add-doctors/add-doctors').then((m) => m.AddDoctors),
              },
            ],
          },
          {
            path: 'departments',
            loadComponent: () =>
              import('./components/departments/departments').then((m) => m.Departments),
            children: [
              {
                path: '',
                redirectTo: 'all-departments',
                pathMatch: 'full',
              },
              {
                path: 'all-departments',
                loadComponent: () =>
                  import('./components/departments/all-departments/all-departments').then(
                    (m) => m.AllDepartments,
                  ),
              },
              {
                path: 'edit-departments/:id', // :id
                loadComponent: () =>
                  import('./components/departments/edit-departments/edit-departments').then(
                    (m) => m.EditDepartments,
                  ),
              },
              {
                path: 'add-departments',
                loadComponent: () =>
                  import('./components/departments/add-departments/add-departments').then(
                    (m) => m.AddDepartments,
                  ),
              },
              {
                path: 'department-details/:id',
                loadComponent: () =>
                  import('./components/departments/department-details/department-details').then(
                    (d) => d.DepartmentDetails,
                  ),
              },
            ],
          },
          {
            path: 'laboratories',
            loadComponent: () =>
              import('./components/laboratories/laboratories').then((m) => m.Laboratories),
            children: [
              {
                path: '',
                redirectTo: 'all-laboratories',
                pathMatch: 'full',
              },
              {
                path: 'all-laboratories',
                loadComponent: () =>
                  import('./components/laboratories/all-laboratories/all-laboratories').then(
                    (m) => m.AllLaboratories,
                  ),
              },

              {
                path: 'add-laboratories',
                loadComponent: () =>
                  import('./components/laboratories/add-laboratories/add-laboratory').then(
                    (m) => m.AddLaboratory,
                  ),
              },
              {
                path: 'laboratory-details/:id',
                loadComponent: () =>
                  import('./components/laboratories/laboratory-details/laboratory-details').then(
                    (l) => l.LaboratoryDetails,
                  ),
              },
              {
                path: 'edit-laboratories/:id',
                loadComponent: () =>
                  import('./components/laboratories/edit-laboratories/edit-laboratories').then(
                    (l) => l.EditLaboratory,
                  ),
              },
            ],
          },
          {
            path: 'labtechnicians',
            loadComponent: () =>
              import('./components/lab-technicians/lab-technicians').then((m) => m.LabTechnicians),
            children: [
              {
                path: '',
                redirectTo: 'all-lab-technicians',
                pathMatch: 'full',
              },
              {
                path: 'all-lab-technicians',
                loadComponent: () =>
                  import('./components/lab-technicians/all-lab-technicians/all-lab-technicians').then(
                    (m) => m.AllLabTechnicians,
                  ),
              },
              {
                path: 'edit-lab-technicians/:nationalId', // :id
                loadComponent: () =>
                  import('./components/lab-technicians/edit-lab-technicians/edit-lab-technicians').then(
                    (m) => m.EditLabTechnicians,
                  ),
              },
              {
                path: 'add-lab-technicians',
                loadComponent: () =>
                  import('./components/lab-technicians/add-lab-technicians/add-lab-technicians').then(
                    (m) => m.AddLabTechnicians,
                  ),
              },
            ],
          },
          {
            path: 'settings',
            loadComponent: () => import('./components/settings/settings').then((m) => m.Settings),
          },
          {
            path: 'notification',
            component: NotificationPage
          }
        ],
      },
    ],
  },
];

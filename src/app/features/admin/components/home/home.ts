import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faArrowRight,
  faBuilding,
  faFileCircleExclamation,
  faFlask,
  faFolderOpen,
  faPlus,
  faUserDoctor,
  faUsersGear
} from '@fortawesome/free-solid-svg-icons';

import { Router } from '@angular/router';

import { AdminService } from '../../../../core/services/admin-service.service';

@Component({
  selector: 'app-home',

  standalone: true,

  imports: [
    DecimalPipe,
    FontAwesomeModule
  ],

  templateUrl: './home.html',

  styleUrl: './home.css'
})
export class Home implements OnInit {

  // =========================
  // Icons
  // =========================

  patients = faFolderOpen;
  doctors = faUserDoctor;
  departments = faBuilding;
  laboratories = faFlask;
  labTech = faUsersGear;
  reports = faFileCircleExclamation;

  plus = faPlus;
  arrowRight = faArrowRight;


  // =========================
  // Dashboard Statistics
  // =========================

  totalPatients = 0;

  activeDoctors = 0;

  totalDepartments = 0;

  totalLaboratories = 0;

  totalLabTechnicians = 0;


  // =========================
  // Loading & Error
  // =========================

  isLoading = false;

  errorMessage = '';


  // =========================
  // Constructor
  // =========================

  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }


  // =========================
  // On Init
  // =========================

  ngOnInit(): void {

    this.loadDashboardStats();

  }


  // =========================
  // Load Dashboard Statistics
  // =========================

  loadDashboardStats(): void {

    this.isLoading = true;

    this.errorMessage = '';


    this.adminService
      .getDashboardStats()
      .subscribe({

        next: (response) => {

          console.log(
            'Dashboard Statistics:',
            response
          );


          this.totalPatients =
            response.totalPatients;


          this.activeDoctors =
            response.activeDoctors;


          this.totalDepartments =
            response.departments;


          this.totalLaboratories =
            response.laboratories;


          this.totalLabTechnicians =
            response.labTechnicians;


          this.isLoading = false;

        },


        error: (error) => {

          console.error(
            'Failed to load dashboard statistics:',
            error
          );


          this.errorMessage =
            'Failed to load dashboard statistics.';


          this.isLoading = false;

        }

      });

  }


  // =========================
  // Quick Management Navigation
  // =========================

  addPatient(): void {

    this.router.navigate([
      '/admin/dashboard/patients/add-patients'
    ]);

  }


  addDoctor(): void {

    this.router.navigate([
      '/admin/dashboard/doctors/add-doctors'
    ]);

  }


  addDepartment(): void {

    this.router.navigate([
      '/admin/dashboard/departments/add-departments'
    ]);

  }


  addLaboratory(): void {

    this.router.navigate([
      '/admin/dashboard/laboratories/add-laboratories'
    ]);

  }


  addLabTechnician(): void {

    this.router.navigate([
      '/admin/dashboard/labtechnicians/add-lab-technicians'
    ]);

  }


  addLabTest(): void {

    console.log(
      'Add Lab Test clicked'
    );

  }

}
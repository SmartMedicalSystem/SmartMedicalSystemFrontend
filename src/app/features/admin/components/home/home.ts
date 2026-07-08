import { Component, Input } from '@angular/core';
import { faArrowRight, faBuilding, faFileCircleExclamation, faFlask, faFolderOpen, faHouse, faPlus, faUserDoctor, faUsersGear } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FontAwesomeModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  patients = faFolderOpen;
  doctors = faUserDoctor;
  departments = faBuilding;
  laboratories = faFlask;
  labTech = faUsersGear;
  reports = faFileCircleExclamation;

  plus = faPlus;
  arrowRight = faArrowRight;
  
  constructor(private router: Router) {
  }
  editPatient(patient: any): void {

    console.log('Opening patient', patient.id);
    this.router.navigate(['/admin/dashboard/patients/edit-patients']);
  }
}

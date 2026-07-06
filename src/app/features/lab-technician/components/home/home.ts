import { Component, Input } from '@angular/core';
import { faArrowRight, faBuilding, faFileCircleExclamation, faFlask, faFolderOpen, faHouse, faPlus, faUserDoctor, faUsersGear } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FontAwesomeModule],
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
}

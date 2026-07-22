import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css'
})
export class PageHeader {

  faChevronRight = faChevronRight;
  faPlus = faPlus;

}
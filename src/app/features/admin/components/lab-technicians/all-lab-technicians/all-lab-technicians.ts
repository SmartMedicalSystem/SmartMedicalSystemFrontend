import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TechniciansTable } from './components/technicians-table/technicians-table';
import { FilterToolbar } from './components/filter-toolbar/filter-toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-technicians',
  standalone: true,
  imports: [
    CommonModule,
    TechniciansTable,
    FilterToolbar,
    RouterLink
  ],
  templateUrl: './all-lab-technicians.html',
  styleUrl: './all-lab-technicians.css'
})
export class AllLabTechnicians {

  filters: any = {};

  onFilterChanged(filters: any): void {
    this.filters = filters;
  }

}
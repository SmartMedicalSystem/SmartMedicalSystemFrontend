import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faPlus,
  faUpload,
  faDownload,
  faMagnifyingGlass,
  faFilter,
  faCalendarDays,
  faRotateRight
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-filter-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    RouterOutlet,
    RouterLink

  ],
  templateUrl: './filter-toolbar.html',
  styleUrl: './filter-toolbar.css'
})
export class FilterToolbar {

  faPlus = faPlus;
  faUpload = faUpload;
  faDownload = faDownload;
  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;
  faCalendarDays = faCalendarDays;
  faRotateRight = faRotateRight;

  searchText = '';

  selectedLaboratory = '';
  selectedStatus = '';
  selectedShift = '';
  joiningDate = '';

  laboratories = [
    'All Laboratories',
    'Central Laboratory',
    'Blood Bank',
    'Microbiology',
    'Pathology'
  ];

  statuses = [
    'All Statuses',
    'Active',
    'Inactive',
    'Vacation'
  ];

  shifts = [
    'All Shifts',
    'Morning',
    'Evening',
    'Night'
  ];

  addTechnician() {
    console.log('Add Technician');
  }

  importTechnicians() {
    console.log('Import');
  }

  exportTechnicians() {
    console.log('Export');
  }

  applyFilters() {
    console.log('Apply Filters');
  }

  clearFilters() {

    this.searchText = '';

    this.selectedLaboratory = '';

    this.selectedStatus = '';

    this.selectedShift = '';

    this.joiningDate = '';

  }

}
import {
  CommonModule
} from '@angular/common';

import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  FontAwesomeModule
} from '@fortawesome/angular-fontawesome';

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
    FontAwesomeModule
  ],

  templateUrl: './filter-toolbar.html',

  styleUrl: './filter-toolbar.css'
})
export class FilterToolbar {

  @Output()
  filterChanged =
    new EventEmitter<any>();

  // =========================
  // Icons
  // =========================

  faPlus =
    faPlus;

  faUpload =
    faUpload;

  faDownload =
    faDownload;

  faMagnifyingGlass =
    faMagnifyingGlass;

  faFilter =
    faFilter;

  faCalendarDays =
    faCalendarDays;

  faRotateRight =
    faRotateRight;

  // =========================
  // Filter Values
  // =========================

  searchText =
    '';

  selectedLaboratory =
    '';

  selectedStatus:
    number | undefined;

  selectedShift:
    number | undefined;

  joiningDate =
    '';

  // =========================
  // Laboratories
  // =========================

  laboratories = [

    {
      value: '',
      name: 'All Laboratories'
    },

    {
      value:
        'Central Chemistry Laboratory',

      name:
        'Central Chemistry Laboratory'
    },

    {
      value:
        'Hematology Laboratory',

      name:
        'Hematology Laboratory'
    },

    {
      value:
        'Microbiology Laboratory',

      name:
        'Microbiology Laboratory'
    },

    {
      value:
        'Pathology Laboratory',

      name:
        'Pathology Laboratory'
    }

  ];

  // =========================
  // Statuses
  // =========================

  statuses = [

    {
      id: undefined,
      name: 'All Statuses'
    },

    {
      id: 1,
      name: 'Active'
    },

    {
      id: 2,
      name: 'Inactive'
    }

  ];

  // =========================
  // Shifts
  // =========================

  shifts = [

    {
      id: undefined,
      name: 'All Shifts'
    },

    {
      id: 1,
      name: 'Morning'
    },

    {
      id: 2,
      name: 'Evening'
    },

    {
      id: 3,
      name: 'Night'
    }

  ];

  // =========================
  // Apply Filters
  // =========================

  applyFilters(): void {

    this.filterChanged.emit({

      search:
        this.searchText.trim(),

      laboratory:
        this.selectedLaboratory,

      employmentStatus:
        this.selectedStatus,

      workShift:
        this.selectedShift,

      joiningDate:
        this.joiningDate

    });

  }

  // =========================
  // Search On Enter
  // =========================

  onSearchEnter(): void {

    this.applyFilters();

  }

  // =========================
  // Clear Filters
  // =========================

  clearFilters(): void {

    this.searchText =
      '';

    this.selectedLaboratory =
      '';

    this.selectedStatus =
      undefined;

    this.selectedShift =
      undefined;

    this.joiningDate =
      '';

    this.applyFilters();

  }

  // =========================
  // Buttons
  // =========================

  addTechnician(): void {

    console.log(
      'Add Technician'
    );

  }

  importTechnicians(): void {

    console.log(
      'Import'
    );

  }

  exportTechnicians(): void {

    console.log(
      'Export'
    );

  }

}
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

// Shape of the filter payload emitted to the parent/list component.
// NOTE: employmentStatus / workShift / assignedLaboratory are typed as
// `string` to match ILabTechnician (the backend model) — an empty
// string means "no filter applied" for that field.
export interface ILabTechnicianFilters {
  search: string;
  assignedLaboratory: string;
  employmentStatus: string;
  workShift: string;
  joiningDate: string;
}

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
  filterChanged = new EventEmitter<ILabTechnicianFilters>();

  // =========================
  // Icons
  // =========================

  faPlus = faPlus;
  faUpload = faUpload;
  faDownload = faDownload;
  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;
  faCalendarDays = faCalendarDays;
  faRotateRight = faRotateRight;

  // =========================
  // Filter Values
  // =========================
  // All fields are strings (including status/shift) so they line up
  // with ILabTechnician and can be sent straight to the API as query
  // params without extra conversion. '' means "no filter" / "All".

  searchText = '';
  selectedLaboratory = '';
  selectedStatus = '';
  selectedShift = '';
  joiningDate = '';

  // =========================
  // Laboratories
  // =========================
  // NOTE: these are the real assignedLaboratory string values the
  // backend expects. Keep this list as the single source of truth —
  // the "Assigned Laboratory" dropdown in the edit-technician form
  // should use these same options (minus "All Laboratories").

  laboratories = [
    { value: '', name: 'All Laboratories' },
    { value: 'Central Chemistry Laboratory', name: 'Central Chemistry Laboratory' },
    { value: 'Hematology Laboratory', name: 'Hematology Laboratory' },
    { value: 'Microbiology Laboratory', name: 'Microbiology Laboratory' },
    { value: 'Pathology Laboratory', name: 'Pathology Laboratory' }
  ];

  // =========================
  // Statuses
  // =========================
  // Verify these codes against the actual backend enum values.

  statuses = [
    { id: '', name: 'All Statuses' },
    { id: '1', name: 'FullTime' },
    { id: '2', name: 'PartTime' },
    { id: '3', name: 'Contract' }
  ];

  // =========================
  // Shifts
  // =========================

  shifts = [
    { id: '', name: 'All Shifts' },
    { id: '1', name: 'Morning' },
    { id: '2', name: 'Evening' },
    { id: '3', name: 'Night' }
  ];

  // =========================
  // Apply Filters
  // =========================

  applyFilters(): void {
    this.filterChanged.emit({
      search: this.searchText.trim(),
      assignedLaboratory: this.selectedLaboratory,
      employmentStatus: this.selectedStatus,
      workShift: this.selectedShift,
      joiningDate: this.joiningDate
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
    this.searchText = '';
    this.selectedLaboratory = '';
    this.selectedStatus = '';
    this.selectedShift = '';
    this.joiningDate = '';
    this.applyFilters();
  }

  // =========================
  // Buttons
  // =========================

  addTechnician(): void {
    console.log('Add Technician');
  }

  importTechnicians(): void {
    console.log('Import');
  }

  exportTechnicians(): void {
    console.log('Export');
  }

}
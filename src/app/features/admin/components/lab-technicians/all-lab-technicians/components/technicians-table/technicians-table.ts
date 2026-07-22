import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faPhone,
  faEnvelope,
  faPenToSquare,
  faPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

import { Pagination } from '../pagination/pagination';

import { AdminService } from '../../../../../../../core/services/admin-service';

import { ILabTechnician } from '../../../../../../../shared/interfaces/Admin/ILabTechnician';

import { IGetLabTechnicians } from '../../../../../../../shared/interfaces/Admin/IGetLabTechnicians';

@Component({
  selector: 'app-technicians-table',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    Pagination,
    RouterLink
  ],
  templateUrl: './technicians-table.html',
  styleUrl: './technicians-table.css'
})
export class TechniciansTable
  implements OnChanges {

  private readonly adminService =
    inject(AdminService);

  @Input()
  filters: any = {};

  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;

  technicians:
    ILabTechnician[] = [];

  currentPage = 1;

  totalPages = 1;

  totalCount = 0;

  firstItemIndex = 0;

  lastItemIndex = 0;

  request:
    IGetLabTechnicians = {

      search: '',

      laboratory: '',

      employmentStatus:
        undefined,

      workShift:
        undefined,

      joiningDate: '',

      pageNumber: 1,

      pageSize: 10

    };

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['filters']
    ) {

      this.request = {

        ...this.request,

        search:
          this.filters?.search ?? '',

        laboratory:
          this.filters?.laboratory ?? '',

        employmentStatus:
          this.filters?.employmentStatus,

        workShift:
          this.filters?.workShift,

        joiningDate:
          this.filters?.joiningDate ?? '',

        pageNumber: 1

      };

      this.loadTechnicians();
    }
  }

  loadTechnicians(): void {

    this.adminService
      .getAllLabTechnicians(
        this.request
      )
      .subscribe({

        next: (
          response
        ) => {

          this.technicians =
            response.items ?? [];

          this.currentPage =
            response.pageNumber;

          this.totalPages =
            response.totalPages;

          this.totalCount =
            response.totalCount;

          this.firstItemIndex =
            response.firstItemIndex;

          this.lastItemIndex =
            response.lastItemIndex;

          console.log(
            'Lab Technicians:',
            response
          );
        },

        error: (
          error
        ) => {

          console.error(
            'Failed to load laboratory technician data:',
            error
          );
        }

      });
  }

  onPageChange(
    page: number
  ): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.request = {

      ...this.request,

      pageNumber: page

    };

    this.loadTechnicians();
  }

  getStatusClass(
    status: number | undefined
  ): string {

    switch (status) {

      case 1:
        return 'active';

      case 2:
        return 'inactive';

      default:
        return 'vacation';
    }
  }

  getStatusName(
    status: number | undefined
  ): string {

    switch (status) {

      case 1:
        return 'Active';

      case 2:
        return 'Inactive';

      default:
        return 'Unknown';
    }
  }

  getShiftName(
    shift: number | undefined
  ): string {

    switch (shift) {

      case 1:
        return 'Morning';

      case 2:
        return 'Evening';

      case 3:
        return 'Night';

      default:
        return '-';
    }
  }

  getFullName(
    technician: ILabTechnician
  ): string {

    return [

      technician.firstName,

      technician.lastName

    ]

      .filter(
        name => !!name
      )

      .join(' ');
  }

  getImageUrl(
    photoUrl:
      string |
      null |
      undefined
  ): string {

    if (
      !photoUrl
    ) {

      return '/images/blank-profile.png';
    }

    if (
      photoUrl.startsWith(
        'http'
      )
    ) {

      return photoUrl;
    }

    return `https://smartmedicalsystem.runasp.net${photoUrl}`;
  }
}
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

import { AdminService } from '../../../../../../../core/services/admin-service.service';

import { ILabTechnician } from '../../../../../../../shared/interfaces/Admin/ILabTechnician';

import { IGetLabTechnicians } from '../../../../../../../shared/interfaces/Admin/IGetLabTechnicians';
import Swal from 'sweetalert2';

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
          this.filters?.assignedLaboratory ?? '',

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

  deleteLabTechnician(nationalId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this technician!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deletLabTechnician(nationalId).subscribe({
          next: (res) => {
            Swal.fire('Deleted!', 'The technician has been deleted.', 'success').then(() => {
              this.loadTechnicians();
            });

          },
          error: (error) => {
            Swal.fire('Error!', 'Failed to delete the technician.', 'error').then(() => { });
          }
        });
      } else {
        Swal.fire('Cancelled', 'The technician is safe :)', 'info');
      }
    })
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


  getStatusClass(status: string | undefined): string {

    switch (status) {

      case 'FullTime':
        return 'active';

      case 'PartTime':
        return 'inactive';

      case 'Contract':
        return 'vacation';

      default:
        return '';
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
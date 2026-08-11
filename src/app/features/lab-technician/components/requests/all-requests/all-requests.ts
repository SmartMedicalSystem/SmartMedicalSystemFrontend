import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { RequestLabsService } from '../../../../../core/services/request-labs-service.service';

@Component({
  selector: 'app-all-requests',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './all-requests.html',
  styleUrls: ['./all-requests.css']
})
export class AllRequests {

  // ==============================
  // Requests
  // ==============================

  requests: any[] = [];

  pendingRequests: any[] = [];

  completedRequests: any[] = [];

  // ==============================
  // Used by HTML
  // ==============================

  totalCount = 0;

  stats = {
    pending: 0,
    completedToday: 0
  };

  searchTerm = '';

  filterStatus = 'All';

  // ==============================
  // Notification Navigation
  // ==============================

  /**
   * Request ID received from a Notification.
   *
   * When the Lab Technician clicks:
   *
   * Notification
   *      ↓
   * All Requests
   *      ↓
   * Highlight specific request
   */
  highlightedRequestId: number | null = null;

  // ==============================
  // Constructor
  // ==============================

  constructor(
    private requestLabsService: RequestLabsService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.route.queryParams.subscribe(params => {

      const requestLabsId = Number(
        params['requestLabsId']
      );

      this.highlightedRequestId =
        requestLabsId > 0
          ? requestLabsId
          : null;

      this.LoadRequestLabs();

    });

  }

  // ==============================
  // Load Requests
  // ==============================

  LoadRequestLabs(): void {

    this.requestLabsService.RequestLabsTable().subscribe({

      next: (res: any) => {

        this.requests = res.items ?? [];

        this.totalCount =
          res.totalCount ??
          this.requests.length;

        // ==========================
        // Pending Requests
        // ==========================

        this.pendingRequests =
          this.requests.filter(
            (request: any) =>
              request.requestLabTests?.some(
                (test: any) =>
                  test.status === 'Pending'
              )
          );

        // ==========================
        // Completed Requests
        // ==========================

        this.completedRequests =
          this.requests.filter(
            (request: any) =>
              request.requestLabTests?.length > 0 &&
              request.requestLabTests.every(
                (test: any) =>
                  test.status === 'Completed'
              )
          );

        // ==========================
        // Statistics
        // ==========================

        this.calculateStats();

      },

      error: (err: any) => {

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text:
            err?.error?.message ||
            err?.error?.Message ||
            'Failed to Load Requests'
        });

      }

    });

  }

  // ==============================
  // Statistics
  // ==============================

  private calculateStats(): void {

    const today =
      new Date().toDateString();

    this.stats.pending =
      this.pendingRequests.length;

    this.stats.completedToday =
      this.completedRequests.filter(
        (item: any) =>
          item.completedAt &&
          new Date(
            item.completedAt
          ).toDateString() === today
      ).length;

  }

  // ==============================
  // Filtered Requests
  // ==============================

  get filteredRequests(): any[] {

    return this.requests.filter(
      (item: any) => {

        /*
         * =====================================
         * Notification Navigation
         * =====================================
         *
         * If the page was opened from a
         * LabTestRequested notification,
         * show only the requested laboratory
         * request.
         */

        if (
          this.highlightedRequestId !== null
        ) {

          return (
            item.id ===
            this.highlightedRequestId
          );

        }

        // ==============================
        // Normal Search
        // ==============================

        const search =
          this.searchTerm
            .trim()
            .toLowerCase();

        const matchesSearch =
          search === '' ||

          item.patientName
            ?.toLowerCase()
            .includes(search) ||

          item.patientSSN
            ?.toLowerCase()
            .includes(search) ||

          item.doctorName
            ?.toLowerCase()
            .includes(search);

        // ==============================
        // Status Filter
        // ==============================

        const matchesStatus =
          this.filterStatus === 'All' ||
          item.status === this.filterStatus;

        return (
          matchesSearch &&
          matchesStatus
        );

      }
    );

  }

  // ==============================
  // Clear Notification Filter
  // ==============================

  showAllRequests(): void {

    this.highlightedRequestId = null;

    this.router.navigate([], {

      relativeTo: this.route,

      queryParams: {
        requestLabsId: null
      },

      queryParamsHandling: 'merge'

    });

  }

  // ==============================
  // Get Tests
  // ==============================

  getTests(item: any): string {

    if (
      !item.labTests ||
      item.labTests.length === 0
    ) {

      return '-';

    }

    return item.labTests
      .map(
        (test: any) =>
          test.testName
      )
      .join(', ');

  }

  // ==============================
  // Request Details
  // ==============================

  goToRequestDetails(
    requestId: number,
    labTestsId: number
  ): void {

    localStorage.setItem(
      'labTestsId',
      labTestsId.toString()
    );

    this.router.navigate([
      'labtechnician/dashboard/requests/test-results',
      requestId
    ]);

  }

}
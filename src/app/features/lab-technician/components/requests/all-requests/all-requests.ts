import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RequestLabsService } from '../../../../../core/services/request-labs-service.service';

@Component({
  selector: 'app-all-requests',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './all-requests.html',
  styleUrls: ['./all-requests.css']
})
export class AllRequests {

  requests: any[] = [];

  pendingRequests: any[] = [];
  completedRequests: any[] = [];

  // ================= Used by HTML =================

  totalCount = 0;

  stats = {
    pending: 0,
    completedToday: 0
  };

  searchTerm = '';

  filterStatus = 'All';

  // ================================================

  constructor(
    private requestLabsService: RequestLabsService,
    private router: Router
  ) {
    this.LoadRequestLabs();
  }

  LoadRequestLabs(): void {
    this.requestLabsService.RequestLabsTable().subscribe({
      next: (res: any) => {
        this.requests = res.items ?? [];
        this.totalCount = res.totalCount ?? this.requests.length;
        this.pendingRequests = this.requests.filter((request: any) =>
          request.requestLabTests?.some((test: any) => test.status === 'Pending')
        );
        this.completedRequests = this.requests.filter((request: any) =>
          request.requestLabTests?.length > 0 &&
          request.requestLabTests.every((test: any) => test.status === 'Completed')
        );
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

  private calculateStats(): void {
    const today = new Date().toDateString();
    this.stats.pending = this.pendingRequests.length;
    this.stats.completedToday = this.completedRequests.filter(
      (item: any) =>
        item.completedAt &&
        new Date(item.completedAt).toDateString() === today
    ).length;
  }

  get filteredRequests(): any[] {
    return this.requests.filter((item: any) => {

      const search = this.searchTerm.trim().toLowerCase();

      const matchesSearch =
        search === '' ||
        item.patientName?.toLowerCase().includes(search) ||
        item.patientSSN?.toLowerCase().includes(search) ||
        item.doctorName?.toLowerCase().includes(search);

      const matchesStatus =
        this.filterStatus === 'All' ||
        item.status === this.filterStatus;

      return matchesSearch && matchesStatus;
    });
  }

  getTests(item: any): string {
    if (!item.labTests || item.labTests.length === 0) {
      return '-';
    }

    return item.labTests
      .map((test: any) => test.testName)
      .join(', ');
  }

  goToRequestDetails(requestId: number, labTestsId: number): void {
    localStorage.setItem('labTestsId', labTestsId.toString());
    this.router.navigate([
      'labtechnician/dashboard/requests/test-results',
      requestId
    ]);
  }
}
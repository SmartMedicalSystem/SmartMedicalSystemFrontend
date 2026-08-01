import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RequestLabsService } from '../../../../../core/services/request-labs-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './all-requests.html',
  styleUrls: ['./all-requests.css']
})
export class AllRequests {

  requests: any[] = [];

  // ================= Used by HTML =================

  totalCount = 0;

  stats = {
    pending: 0,
    completedToday: 0
  };

  searchTerm = '';

  filterStatus = 'All';

  // ================================================

  constructor(private requestLabsService: RequestLabsService) {
    this.LoadRequestLabs();
  }

  LoadRequestLabs(): void {

    this.requestLabsService.RequestLabsTable().subscribe({

      next: (res: any) => {

        console.log('Request Labs:', res);

        this.requests = res.items ?? res ?? [];

        this.totalCount = this.requests.length;

        this.stats.pending = this.requests.filter(
          (x: any) => x.status === 'Pending'
        ).length;

        this.stats.completedToday = this.requests.filter(
          (x: any) => x.status === 'Completed'
        ).length;
      },

      error: (err: any) => {

        console.error(err);

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

}

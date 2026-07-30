import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { LabTechService } from '../../../../core/services/lab-tech-service';
import Swal from 'sweetalert2';

import { Footer } from '../../../shared/components/footer/footer';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Navbar,
    Sidebar,
    Footer,
    RouterOutlet
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  constructor(private labTechService: LabTechService) {}

  // ================= Sidebar =================

  sidebarOpen = signal(false);

  openSidebar(): void {
    this.sidebarOpen.set(true);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(value => !value);
  }

  // ================= Dashboard Statistics =================

  statistics = {
    totalRequests: 0,
    pendingRequests: 0,
    completedToday: 0
  };

  // ================= Notifications =================

  unreadNotifications = 0;

  // ================= Pending Requests =================

  pendingRequests: any[] = [];

  ngOnInit(): void {
    this.loadStatistics();
    this.loadPendingRequests();
    this.loadUnreadNotifications();
  }

  // ================= Load Statistics =================

  loadStatistics(): void {
    this.labTechService.getLabRequestStatistics().subscribe({
      next: (res) => {
        this.statistics = res;
      },
      error: (err) => {
        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load dashboard statistics.'
        });
      }
    });
  }

  // ================= Load Notifications =================

  loadUnreadNotifications(): void {
    this.labTechService.getUnreadNotificationsCount().subscribe({
      next: (res: any) => {

        if (typeof res === 'number') {
          this.unreadNotifications = res;
        } else if (res.unreadCount !== undefined) {
          this.unreadNotifications = res.unreadCount;
        } else if (res.count !== undefined) {
          this.unreadNotifications = res.count;
        } else {
          this.unreadNotifications = 0;
        }

      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // ================= Load Pending Requests =================

  loadPendingRequests(): void {
    this.labTechService.getLabRequests().subscribe({
      next: (res) => {
        this.pendingRequests = res.items;
      },
      error: (err) => {
        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load pending requests.'
        });
      }
    });
  }

  // ================= Start Test =================

  startTest(requestId: number): void {

    const body = {
      status: 'Processing'
    };

    this.labTechService.updateRequestStatus(requestId, body).subscribe({
      next: () => {

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Test started successfully.'
        });

        this.loadStatistics();
        this.loadPendingRequests();
      },
      error: (err) => {
        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to start test.'
        });
      }
    });
  }

}

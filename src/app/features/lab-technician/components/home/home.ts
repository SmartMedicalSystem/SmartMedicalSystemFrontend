import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabTechService } from '../../../../core/services/lab-tech-service';
import Swal from 'sweetalert2';

import { Footer } from '../../../../shared/components/footer/footer';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { Sidebar } from '../../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Navbar,
    Sidebar,
    Footer
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

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

  // ================= Statistics =================

  loadStatistics(): void {
    this.labTechService.getLabRequestStatistics().subscribe({
      next: (res: any) => {
        this.statistics = res;
      },
      error: (err: any) => {
        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load dashboard statistics.'
        });
      }
    });
  }

  // ================= Notifications =================

  loadUnreadNotifications(): void {
    this.labTechService.getUnreadNotificationsCount().subscribe({
      next: (res: any) => {

        if (typeof res === 'number') {
          this.unreadNotifications = res;
        } else if (res?.unreadCount !== undefined) {
          this.unreadNotifications = res.unreadCount;
        } else if (res?.count !== undefined) {
          this.unreadNotifications = res.count;
        } else {
          this.unreadNotifications = 0;
        }

      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  // ================= Pending Requests =================

  loadPendingRequests(): void {
    this.labTechService.getLabRequests().subscribe({
      next: (res: any) => {
        this.pendingRequests = res.items ?? [];
      },
      error: (err: any) => {
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
        this.loadUnreadNotifications();
      },
      error: (err: any) => {
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

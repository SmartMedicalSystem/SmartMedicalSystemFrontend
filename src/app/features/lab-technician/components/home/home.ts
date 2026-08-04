import { Component, Input } from '@angular/core';
import { faArrowRight, faBuilding, faFileCircleExclamation, faFlask, faFolderOpen, faHouse, faPlus, faUserDoctor, faUsersGear } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterLink } from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';
import { LabTechService } from '../../../../core/services/lab-tech-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private labTechService: LabTechService, private router: Router) { }
  patients = faFolderOpen;
  doctors = faUserDoctor;
  departments = faBuilding;
  laboratories = faFlask;
  labTech = faUsersGear;
  reports = faFileCircleExclamation;

  plus = faPlus;
  arrowRight = faArrowRight;
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
        console.log(res);
        this.pendingRequests = res.items.slice(0, 4) ?? [];
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

  goToRequestDetails(requestId: number, labTestsId: number): void {
    localStorage.setItem('labTestsId', labTestsId.toString());
    this.router.navigate(['labtechnician/dashboard/requests/test-results/', requestId]);
  }
}

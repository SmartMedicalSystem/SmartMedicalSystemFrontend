import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
//import { NotificationService } from '@core/services/notification.service';
import { AuthenticationService } from '../../../core/services/authenticationService';
import { NavItem } from '../../../core/Models/NavItems';
import { ThemeService } from '../../../core/services/theme.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [RouterLink, MatDividerModule, MatMenuModule, MatIconModule, CommonModule],
  styleUrls: ['./header.css'],
})
export class Header implements OnInit, OnDestroy {
  user: any = null;
  isDarkMode = false;
  isMobileMenuOpen = false;
  notificationCount = 5;
  private destroy$ = new Subject<void>();
  navItems: NavItem[] = [];

  constructor(
    private authService: AuthenticationService,
    private themeService: ThemeService,
    // private notificationService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.themeService.isDarkMode$.pipe(takeUntil(this.destroy$)).subscribe((isDark) => {
      this.isDarkMode = isDark;
      console.log('Dark mode updated in component:', isDark);
    });
    this.loadNavigation();
  }

  loadNavigation() {
    const role = this.user?.role;

    if (role === 'Admin') {
      this.navItems = [
        { label: 'Dashboard', icon: 'dashboard', route: '/admin' },
        { label: 'Doctors', icon: 'medical_services', route: '/admin/doctors' },
        { label: 'Patients', icon: 'people', route: '/admin/patients' },
        { label: 'Laboratories', icon: 'science', route: '/admin/laboratories' },
        { label: 'Tests', icon: 'biotech', route: '/admin/tests' },
        { label: 'AI Reports', icon: 'auto_awesome', route: '/admin/ai-reports' },
      ];
    } else if (role === 'Doctor') {
      this.navItems = [
        { label: 'Dashboard', icon: 'dashboard', route: '/doctor' },
        { label: 'Patients', icon: 'people', route: '/doctor/patients' },
        { label: 'Sessions', icon: 'event_note', route: '/doctor/sessions' },
        { label: 'Lab Tests', icon: 'biotech', route: '/doctor/lab-tests' },
        { label: 'AI Reports', icon: 'auto_awesome', route: '/doctor/ai-reports' },
        { label: 'Notifications', icon: 'notifications', route: '/doctor/notifications' },
      ];
    } else if (role === 'LabTechnician') {
      this.navItems = [
        { label: 'Dashboard', icon: 'dashboard', route: '/lab-technician' },
        { label: 'Test Requests', icon: 'assignment', route: '/lab-technician/requests' },
        { label: 'Results', icon: 'result', route: '/lab-technician/results' },
        { label: 'Patients', icon: 'people', route: '/lab-technician/patients' },
        { label: 'Notifications', icon: 'notifications', route: '/lab-technician/notifications' },
      ];
    } else if (role === 'DepartmentManager') {
      this.navItems = [
        { label: 'Dashboard', icon: 'dashboard', route: '/department-manager' },
        { label: 'Doctors', icon: 'medical_services', route: '/department-manager/doctors' },
        { label: 'Patients', icon: 'people', route: '/department-manager/patients' },
        { label: 'Reports', icon: 'assessment', route: '/department-manager/reports' },
        { label: 'Analytics', icon: 'analytics', route: '/department-manager/analytics' },
      ];
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  openSearch() {
    // Open search dialog
  }

  openNotifications() {
    this.router.navigate(['/notifications']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

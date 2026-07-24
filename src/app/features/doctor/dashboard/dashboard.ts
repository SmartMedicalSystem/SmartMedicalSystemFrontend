import { Component, signal } from '@angular/core';
import { Footer } from "../../../shared/components/footer/footer";
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, Footer, RouterOutlet, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

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
}

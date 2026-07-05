import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Navbar } from './components/navbar/navbar';
import { SidebarComponent } from './components/sidebar/sidebar';

import { LaboratoryHeader } from './components/laboratory-header/laboratory-header';
import { LaboratoryStats } from './components/laboratory-stats/laboratory-stats';
import { LaboratoryTable } from './components/laboratory-table/laboratory-table';
import { LaboratorySummary } from './components/laboratory-summary/laboratory-summary';
import { LaboratoryAiCard } from './components/laboratory-ai-card/laboratory-ai-card';

import { Footer } from '../../../shared/components/footer/footer';

@Component({
  selector: 'app-laboratory',
  standalone: true,
  imports: [
    CommonModule,

    Navbar,
    SidebarComponent,

    LaboratoryHeader,
    LaboratoryStats,
    LaboratoryTable,
    LaboratorySummary,
    LaboratoryAiCard,

    Footer
  ],
  templateUrl: './laboratory.html',
  styleUrl: './laboratory.css'
})
export class Laboratory {

  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

}
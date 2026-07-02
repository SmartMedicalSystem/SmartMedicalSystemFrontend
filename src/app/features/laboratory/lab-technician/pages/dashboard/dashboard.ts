import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { DashboardHeader } from '../../components/dashboard-header/dashboard-header';
import { StatisticsCards } from '../../components/statistics-cards/statistics-cards';
import { ProcessingQueue } from '../../components/processing-queue/processing-queue';
import { Alerts } from '../../components/alerts/alerts';
import { RecentSubmissions } from '../../components/recent-submissions/recent-submissions';
import { AiBanner } from '../../components/ai-banner/ai-banner';
import { Footer } from '../../../../../shared/components/footer/footer';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    Navbar,
    DashboardHeader,
    StatisticsCards,
    ProcessingQueue,
    Alerts,
    RecentSubmissions,
    AiBanner,
    Footer
    
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
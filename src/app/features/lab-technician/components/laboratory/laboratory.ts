import { Component } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Alerts } from './Components/alerts/alerts';
import { RecentSubmissions } from './Components/recent-submissions/recent-submissions';
import { AiBanner } from './Components/ai-banner/ai-banner';
import { DashboardHeader } from './Components/dashboard-header/dashboard-header';
import { StatisticsCards } from './Components/statistics-cards/statistics-cards';
import { ProcessingQueue } from './Components/processing-queue/processing-queue';

@Component({
  selector: 'app-laboratory',
  imports: [FaIconComponent, Alerts, RecentSubmissions, AiBanner, DashboardHeader, StatisticsCards, ProcessingQueue],
  templateUrl: './laboratory.html',
  styleUrl: './laboratory.css',
})
export class Laboratory { }

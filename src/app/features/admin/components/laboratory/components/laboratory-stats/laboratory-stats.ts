import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  subtitle: string;
  icon: string;
}

@Component({
  selector: 'app-laboratory-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './laboratory-stats.html',
  styleUrl: './laboratory-stats.css'
})
export class LaboratoryStats {
  cards: StatCard[] = [
    {
      title: 'Total Facilities',
      value: '24',
      change: '+12%',
      changeType: 'up',
      subtitle: 'Compared to last month',
      icon: 'M4 6h16M4 12h16M4 18h16'
    },
    {
      title: 'Active Laboratories',
      value: '19',
      change: '+5%',
      changeType: 'up',
      subtitle: 'Currently operating',
      icon: 'M12 2l3 7h7l-5.5 4.2L18 20l-6-4-6 4 1.5-6.8L2 9h7z'
    },
    {
      title: 'Pending Reviews',
      value: '8',
      change: '-2%',
      changeType: 'down',
      subtitle: 'Awaiting approval',
      icon: 'M12 8v4m0 4h.01M4 4h16v16H4z'
    },
    {
      title: 'Monthly Tests',
      value: '15.8K',
      change: '+18%',
      changeType: 'up',
      subtitle: 'Tests processed',
      icon: 'M5 12h14M12 5v14'
    }
  ];
}
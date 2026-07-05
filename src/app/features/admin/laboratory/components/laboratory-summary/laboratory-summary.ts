import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-laboratory-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './laboratory-summary.html',
  styleUrl: './laboratory-summary.css'
})
export class LaboratorySummary {

  tests = [
    {
      name: 'CBC with Differential',
      department: 'Hematology',
      count: '2,450 / wk'
    },
    {
      name: 'Lipid Panel',
      department: 'Chemistry',
      count: '1,820 / wk'
    },
    {
      name: 'SARS-CoV-2 (PCR)',
      department: 'Virology',
      count: '1,210 / wk'
    }
  ];

}
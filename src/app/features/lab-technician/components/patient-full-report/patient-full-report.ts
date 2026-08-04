import { Component } from '@angular/core';
import { TestResultService } from '../../../../core/services/test-result-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-full-report',
  imports: [CommonModule],
  templateUrl: './patient-full-report.html',
  styleUrl: './patient-full-report.css',
})
export class PatientFullReport {

  constructor(private testResultService: TestResultService, private router: Router) {
    const id = Number(this.router.url.split('/').pop());
    this.getUserFullReport(id);
  }

  report: any;

  getUserFullReport(patientId: number) {
    this.testResultService.getUserFullReport(patientId).subscribe({
      next: (response) => {
        this.report = response;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}

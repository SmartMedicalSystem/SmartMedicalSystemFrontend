import { Component } from '@angular/core';
import { TestResultService } from '../../../../core/services/test-result-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-full-report',
  imports: [],
  templateUrl: './patient-full-report.html',
  styleUrl: './patient-full-report.css',
})
export class PatientFullReport {

  constructor(private testResultService: TestResultService, private router: Router) {
    const id = Number(this.router.url.split('/').pop());
    this.getUserFullReport(id);
  }

  getUserFullReport(patientId: number) {
    this.testResultService.getUserFullReport(patientId).subscribe(
      (response) => {
        console.log('Full report:', response);
      },
      (error) => {
        console.error('Error fetching full report:', error);
      }
    );
  }
}

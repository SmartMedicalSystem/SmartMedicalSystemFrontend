import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { forkJoin, switchMap } from 'rxjs';
import { TestResultService } from '../../../../../core/services/test-result-service';
import { PatientResult } from '../../../../../shared/interfaces/LabTechnician/PatientResult';
import { PatientResultElement } from '../../../../../shared/interfaces/LabTechnician/PatientResultElement';
import { PatientAIReport } from '../../../../../shared/interfaces/LabTechnician/PatientAIReport';
import { Router } from '@angular/router';


@Component({
  selector: 'app-test-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-results.html',
  styleUrls: ['./test-results.css']
})
export class TestResults {

  patientResult!: PatientResult;

  analytes: PatientResultElement[] = [];

  aiReport?: PatientAIReport;

  loadingAI = false;

  patientResultId = 1;
  labTestId = 0;
  constructor(private testResultService: TestResultService, private router: Router) {
    this.labTestId = Number(localStorage.getItem('labTestsId'));
  }

  ngOnInit(): void {

    this.loadPatientInfo();
  }

  requestInfo = {
    patientId: 0,
    doctorId: 0,
    patientName: '',
    patientSSN: '',
    patientAge: 0,
    doctorName: '',
    doctorDepartment: '',
    labTestName: '',
    labTestpriority: '',
    status: '',
    RequestDate: '',
    sessionId: 0
  };
  testElements: any[] = [];

  loadPatientInfo(): void {
    const id = Number(this.router.url.split('/').pop());
    this.testResultService.getRequestInfo(id).subscribe({
      next: (res) => {
        this.requestInfo = {
          patientId: res.patientId,
          doctorId: res.doctorId,
          patientName: res.patientName,
          patientSSN: res.patientSSN,
          patientAge: res.patientAge,
          doctorName: res.doctorName,
          doctorDepartment: res.doctorDepartment,
          labTestName:
            res.labTests?.find((test: any) => test.id === this.labTestId)?.testName ?? '',
          labTestpriority: res.priority,
          status: res.status,
          RequestDate: res.requestedAt,
          sessionId: res.sessionId
        };
        console.log(res);
        console.log(this.requestInfo);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load patient info.'
        });
      }
    });

    this.testResultService.getLabTestElements(this.labTestId).pipe(
      switchMap((relations: any[]) => {
        const requests = relations.map(item =>
          this.testResultService.getTestElementById(item.testElementId)
        );
        return forkJoin(requests);

      })
    ).subscribe({
      next: (elements) => {
        console.log(elements);
        this.testElements = elements;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load test elements.'
        });
      }
    });
  }

  submitResults(): void {
    const resultyObj = {
      patientId: this.requestInfo.patientId,
      sessionId: this.requestInfo.sessionId,
      labTestId: this.labTestId,
      summary: '',
      aiClassifiedReport: '',
      aiSuggestion: ''
    }
    this.testResultService.submitPatientResults(resultyObj).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Test Results Submitted',
          text: 'The test results have been submitted successfully.'
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to submit test results.'
        });
      }
    });
  }



  verifyWithAI(): void {
    this.loadingAI = true;

    this.testResultService.generateAIReport(this.patientResultId).subscribe({

      next: (res) => {

        this.aiReport = res;

        // تحديث البيانات الظاهرة فى الصفحة
        this.patientResult.summary = res.summary;
        this.patientResult.aiClassifiedReport = res.aiClassifiedReport;
        this.patientResult.aiSuggestion = res.aiSuggestion;

        this.loadingAI = false;

        Swal.fire({
          icon: 'success',
          title: 'AI Analysis Completed',
          text: 'The AI report has been generated successfully.'
        });

      },

      error: () => {

        this.loadingAI = false;

        Swal.fire({
          icon: 'error',
          title: 'AI Verification Failed',
          text: 'Unable to generate AI report.'
        });

      }

    });

  }

  getPriorityClasses(priority: string): string {

    switch (priority) {

      case 'Emergency':
        return 'border-red-200 bg-red-50 text-red-700';

      case 'Urgent':
        return 'border-yellow-200 bg-yellow-50 text-yellow-700';

      default:
        return 'border-blue-200 bg-blue-50 text-blue-700';
    }
  }

  getStatusClasses(status: string): string {

    switch (status) {

      case 'Completed':
        return 'bg-green-100 text-green-700';

      case 'InProgress':
        return 'bg-blue-100 text-blue-700';

      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';

      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getElementStatusClasses(status: string): string {

    switch (status) {

      case 'Normal':
        return 'bg-green-100 text-green-700';


      case 'Abnormal':
        return 'bg-red-100 text-red-700';


      case 'Critical':
        return 'bg-red-200 text-red-900';


      default:
        return 'bg-gray-100 text-gray-600';
    }

  }

}




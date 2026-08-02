import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestResultService } from '../../../../../core/services/test-result-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-results.html',
  styleUrls: ['./test-results.css']
})
export class TestResults {

  analytes: any[] = [];

  constructor(private testResultService: TestResultService) { }

  ngOnInit(): void {
    this.loadResultElements();
  }

  loadResultElements(): void {
    this.testResultService.getElements(1).subscribe({
      next: (res: any) => {
        console.log(res);
        this.analytes = res.items ?? res.data ?? res;
      },
      error: (err: any) => {
        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load test results.'
        });
      }
    });
  }
}

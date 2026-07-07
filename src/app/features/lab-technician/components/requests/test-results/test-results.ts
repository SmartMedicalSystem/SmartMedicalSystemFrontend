import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-results.html',
  styleUrls: ['./test-results.css']
})
export class TestResults {

  analytes = [

    {
      name: 'Hemoglobin (Hb)',
      value: '12.1',
      unit: 'g/dL',
      reference: '13.5 - 17.5',
      status: 'Low'
    },

    {
      name: 'White Blood Cells (WBC)',
      value: '7.2',
      unit: 'x10³/µL',
      reference: '4.0 - 11.0',
      status: 'Normal'
    },

    {
      name: 'Platelets',
      value: '122',
      unit: 'x10³/µL',
      reference: '150 - 450',
      status: 'Critical Low'
    },

    {
      name: 'Glucose (Fasting)',
      value: '105',
      unit: 'mg/dL',
      reference: '70 - 110',
      status: 'Normal'
    }

  ];

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Technician {
  technicianId: number;
  name: string;
}

interface Department {
  departmentId: number;
  name: string;
}

@Component({
  selector: 'app-add-laboratories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './add-laboratories.html',
  styleUrls: ['./add-laboratories.css'],
})
export class AddLaboratories {
  // Mock Technicians
  technicians: Technician[] = [
    { technicianId: 1, name: 'Sarah Johnson' },
    { technicianId: 2, name: 'Michael Chen' },
    { technicianId: 3, name: 'Patricia Williams' },
    { technicianId: 4, name: 'David Rodriguez' },
    { technicianId: 5, name: 'Emily Carter' },
  ];

  // Mock Departments
  departments: Department[] = [
    { departmentId: 1, name: 'Hematology' },
    { departmentId: 2, name: 'Genetics' },
    { departmentId: 3, name: 'Biochemistry' },
    { departmentId: 4, name: 'Microbiology' },
    { departmentId: 5, name: 'Pathology' },
  ];

  // Status options
  statuses: string[] = ['Active', 'Inactive', 'Maintenance'];

  lab = {
    name: '',
    departmentId: null as number | null,
    headTechnicianId: null as number | null,
    status: 'Active',
  };

  onSubmit() {
    console.log('Laboratory Created:', this.lab);
    // TODO: Call API
    // POST /api/laboratories
    // {
    //   name: this.lab.name,
    //   departmentId: this.lab.departmentId,
    //   headTechnicianId: this.lab.headTechnicianId,
    //   status: this.lab.status
    // }
  }

  onReset() {
    this.lab = {
      name: '',
      departmentId: null,
      headTechnicianId: null,
      status: 'Active',
    };
  }
}

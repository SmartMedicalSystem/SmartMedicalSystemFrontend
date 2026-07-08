import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
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

interface Laboratory {
  labId: number;
  name: string;
  departmentId: number | null;
  headTechnicianId: number | null;
  status: string;
  createdAt: Date;
  totalTests: number;
  staffCount: number;
}

@Component({
  selector: 'app-edit-laboratories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './edit-laboratories.html',
  styleUrls: ['./edit-laboratories.css'],
})
export class EditLaboratories implements OnInit {
  labId: string | null = null;

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

  statuses: string[] = ['Active', 'Inactive', 'Maintenance'];

  // Mock Laboratory Data
  lab: Laboratory = {
    labId: 1,
    name: 'North Wing Pathology',
    departmentId: 1,
    headTechnicianId: 1,
    status: 'Active',
    createdAt: new Date('2021-06-15'),
    totalTests: 1420,
    staffCount: 12,
  };

  originalLab!: Laboratory;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.labId = this.route.snapshot.paramMap.get('id');
    console.log('Editing laboratory ID:', this.labId);
    this.originalLab = { ...this.lab };
  }

  getDepartmentName(): string {
    const dept = this.departments.find((d) => d.departmentId === this.lab.departmentId);
    return dept ? dept.name : 'Not Assigned';
  }

  getHeadTechnicianName(): string {
    const tech = this.technicians.find((t) => t.technicianId === this.lab.headTechnicianId);
    return tech ? tech.name : 'Not Assigned';
  }

  onSubmit() {
    console.log('Laboratory Updated:', this.lab);
  }

  onReset() {
    this.lab = { ...this.originalLab };
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faPhone,
  faEnvelope,
  faEllipsisVertical,
  faPenToSquare,
  faPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { Pagination } from '../pagination/pagination';
import { RouterLink } from '@angular/router';

interface Technician {
  id: number;
  employeeId: string;
  image: string;
  fullName: string;
  laboratory: string;
  location: string;
  phone: string;
  email: string;
  shift: string;
  status: 'Active' | 'Inactive' | 'Vacation';
}

@Component({
  selector: 'app-technicians-table',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    Pagination,
    RouterLink
  ],
  templateUrl: './technicians-table.html',
  styleUrl: './technicians-table.css'
})
export class TechniciansTable {

  faPhone = faPhone;
faEnvelope = faEnvelope;

faPlus = faPlus;
faPenToSquare = faPenToSquare;
faTrash = faTrash;

  technicians: Technician[] = [

    {
      id: 1,
      employeeId: 'EMP-1001',
      image: 'https://i.pravatar.cc/100?img=12',
      fullName: 'Ahmed Mohamed',
      laboratory: 'Central Laboratory',
      location: 'Building A',
      phone: '+20 100 123 4567',
      email: 'ahmed@hospital.com',
      shift: 'Morning',
      status: 'Active'
    },

    {
      id: 2,
      employeeId: 'EMP-1002',
      image: 'https://i.pravatar.cc/100?img=32',
      fullName: 'Sara Ali',
      laboratory: 'Blood Bank',
      location: 'Building B',
      phone: '+20 101 987 6543',
      email: 'sara@hospital.com',
      shift: 'Evening',
      status: 'Active'
    },

    {
      id: 3,
      employeeId: 'EMP-1003',
      image: 'https://i.pravatar.cc/100?img=24',
      fullName: 'Omar Hassan',
      laboratory: 'Microbiology',
      location: 'Building C',
      phone: '+20 102 333 2222',
      email: 'omar@hospital.com',
      shift: 'Night',
      status: 'Inactive'
    },

    {
      id: 4,
      employeeId: 'EMP-1004',
      image: 'https://i.pravatar.cc/100?img=44',
      fullName: 'Mona Samir',
      laboratory: 'Pathology',
      location: 'Building A',
      phone: '+20 103 777 8888',
      email: 'mona@hospital.com',
      shift: 'Morning',
      status: 'Vacation'
    },

    {
      id: 5,
      employeeId: 'EMP-1005',
      image: 'https://i.pravatar.cc/100?img=15',
      fullName: 'Mohamed Adel',
      laboratory: 'Clinical Chemistry',
      location: 'Building D',
      phone: '+20 105 222 3333',
      email: 'mohamed@hospital.com',
      shift: 'Morning',
      status: 'Active'
    }

  ];

  getStatusClass(status: string): string {

    switch (status) {

      case 'Active':
        return 'active';

      case 'Inactive':
        return 'inactive';

      case 'Vacation':
        return 'vacation';

      default:
        return '';

    }

  }

}
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TechniciansTable } from './components/technicians-table/technicians-table';
import { Pagination } from './components/pagination/pagination';
import { FilterToolbar } from './components/filter-toolbar/filter-toolbar';


@Component({
  selector: 'app-technicians',
  standalone: true,
  imports: [
    CommonModule,
    TechniciansTable,
    Pagination,
    FilterToolbar
  ],
  templateUrl: './all-lab-technicians.html',
  styleUrl: './all-lab-technicians.css'
})
export class AllLabTechnicians {


  currentPage: number = 1;

  totalPages: number = 5;



  changePage(page: number){

    this.currentPage = page;

    // هنا بعدين هننادي الـ API
    // getTechnicians(page)

  }



}
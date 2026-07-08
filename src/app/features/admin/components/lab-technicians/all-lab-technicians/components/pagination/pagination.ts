import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class Pagination {

  @Input() currentPage: number = 1;
  @Input() totalPages: number = 5;

  @Output() pageChange = new EventEmitter<number>();


  get pages(): number[] {

    return Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );

  }


  changePage(page: number) {

    if(page < 1 || page > this.totalPages)
      return;

    this.currentPage = page;

    this.pageChange.emit(page);

  }


  previous(){

    this.changePage(this.currentPage - 1);

  }


  next(){

    this.changePage(this.currentPage + 1);

  }

}
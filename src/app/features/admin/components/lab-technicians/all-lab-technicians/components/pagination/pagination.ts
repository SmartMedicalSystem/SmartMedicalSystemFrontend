import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class Pagination {

  @Input() currentPage = 1;

  @Input() totalPages = 1;

  @Input() totalCount = 0;

  @Input() pageSize = 10;

  @Output() pageChange = new EventEmitter<number>();


  get pages(): number[] {

    return Array.from(
      { length: this.totalPages },
      (_, index) => index + 1
    );

  }


  get firstItem(): number {

    if (this.totalCount === 0)
      return 0;

    return (this.currentPage - 1) * this.pageSize + 1;

  }


  get lastItem(): number {

    const last = this.currentPage * this.pageSize;

    return last > this.totalCount
      ? this.totalCount
      : last;

  }


  changePage(page: number): void {

    if (page < 1 || page > this.totalPages)
      return;

    this.pageChange.emit(page);

  }


  previous(): void {

    this.changePage(this.currentPage - 1);

  }


  next(): void {

    this.changePage(this.currentPage + 1);

  }

}
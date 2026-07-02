import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-not-found',
  imports: [MatIcon, RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  constructor(private location: Location) { }
  goBack(): void {
    this.location.back();
  }
}

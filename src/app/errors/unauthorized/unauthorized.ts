import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-unauthorized',
  imports: [MatIcon,RouterLink],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css',
})
export class Unauthorized {
  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }
}

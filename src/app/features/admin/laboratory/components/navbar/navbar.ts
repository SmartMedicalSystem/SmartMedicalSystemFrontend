import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faMagnifyingGlass,
  faBell,
  faClockRotateLeft,
  faComment,
  faBars
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  @Output()
  toggleSidebar = new EventEmitter<void>();

  menu = faBars;

  search = faMagnifyingGlass;

  bell = faBell;

  clock = faClockRotateLeft;

  message = faComment;

  user = {
    name: 'Sara Ahmed',
    role: 'Administrator',
    image: 'https://i.pravatar.cc/150?img=47'
  };

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

}
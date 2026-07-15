import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './requests.html',
  styleUrls: ['./requests.css']
})
export class Requests {}

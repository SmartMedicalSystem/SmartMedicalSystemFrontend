import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './core/services/loadingService';
import { Loader } from "./shared/components/loader/loader";
import { AuthenticationService } from './core/services/authenticationService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SmartMedicalSystem');
  loadingService = inject(LoadingService);
}

import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './core/services/loadingService.service';
import { Loader } from "./shared/components/loader/loader";
import { NotificationHubService } from './core/services/notification-hub.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SMS');
  loadingService = inject(LoadingService);
}

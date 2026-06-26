import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private requestsCount = signal(0);
  readonly isLoading = computed(
    () => this.requestsCount() > 0
  );
  show() {
    this.requestsCount.update(v => v + 1);
  }
  hide() {
    this.requestsCount.update(v => Math.max(0, v - 1));
  }
}

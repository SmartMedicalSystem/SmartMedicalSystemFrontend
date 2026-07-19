import { Component, signal } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-reset-success',
  imports: [RouterLink],
  templateUrl: './reset-success.html',
  styleUrl: './reset-success.css',
})
export class ResetSuccess {
  email = signal<string>('')
  constructor() {
    this.email.set(history.state.email)
  }
}

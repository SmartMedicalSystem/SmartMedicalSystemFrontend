import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private _httpClient: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this._httpClient.post('', { email, password });
  }
  getCurrentUser() {
    return { user: 'Ahmed', role: 'Admin' };
  }

  private accessToken = signal<string | null>(null);
  private isAuth = signal<boolean>(false);

  setToken(token: string) {
    this.accessToken.set(token);
    this.isAuth.set(true);
  }

  getToken(): string | null {
    return this.accessToken();
  }

  isAuthenticated() {
    return this.isAuth();
  }

  clearToken(): void {
    this.accessToken.set(null);
    this.isAuth.set(false);
  }

  logout(): void {
    this.clearToken();
  }
}

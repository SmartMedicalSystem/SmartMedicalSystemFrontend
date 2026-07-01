import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private _httpClient: HttpClient) {
  }

  login(loginObj: Object): Observable<any> {
    return this._httpClient.post('', loginObj);
  }

  resetPassword(email: string): Observable<any> {
    return this._httpClient.post('', email);
  }

  updatePassword(passwordObj: Object): Observable<any> {
    return this._httpClient.post('', passwordObj);
  }
  
  //refresh token required
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

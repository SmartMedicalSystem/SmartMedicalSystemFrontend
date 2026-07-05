import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly REFRESH_KEY = 'refresh_token';
  private readonly accessToken = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // APIs
  login(loginObj: Object): Observable<any> {
    return this.http.post<any>('YOUR_LOGIN_API', loginObj);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<any>(
      'YOUR_REFRESH_API',
      {
        refreshToken
      }
    );
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post('', email);
  }

  updatePassword(passwordObj: Object): Observable<any> {
    return this.http.post('', passwordObj);
  }

  // Access Token
  setToken(accessToken: string, refreshToken: string): void {
    this.accessToken.set(accessToken);
    localStorage.setItem(
      this.REFRESH_KEY,
      refreshToken
    );
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  // Refresh Token
  getRefreshToken(): string | null {
    return localStorage.getItem(
      this.REFRESH_KEY
    );
  }

  // Session Restore
  restoreSession(): Observable<any> {
    return this.refreshToken().pipe(
      tap((response) => {
        this.setToken(
          response.accessToken,
          response.refreshToken
        );
      })
    );
  }

  // Authentication
  isAuthenticated(): boolean {
    return this.accessToken() !== null;
  }

  // Logout
  clearToken(): void {
    this.accessToken.set(null);
    localStorage.removeItem(
      this.REFRESH_KEY
    );
  }

  logout(): void {
    this.clearToken();
    void this.router.navigate(['/auth']);
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestLabsService {

  private baseUrl = 'https://smartmedicalsystem.runasp.net/api/RequestLabs';

  constructor(private http: HttpClient) {}

  RequestLabsTable(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/laboratory?pageNumber=1&pageSize=10`
    );
  }

  Statistics(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/laboratory/statistics`
    );
  }

  RequestsDetails(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/${id}`
    );
  }

  SessionRequests(sessionId: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/by-session/${sessionId}`
    );
  }

  UpdateRequestStatus(id: number, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${id}/status`,
      data
    );
  }
}

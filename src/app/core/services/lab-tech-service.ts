import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root',
})
export class LabTechService {
  constructor(private http: HttpClient) {

  }
// ===============Profile=======================
   private apiUrl = 'https://smartmedicalsystem.runasp.net/api/Profile';
ProfileOpen(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/me/${id}`);
}

ProfileSaveChanges(id: number, data: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/me/${id}`, data);
}

ProfileChangePassword(id: number, data: any): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/me/change-password/${id}`,
    data
  );
}

}

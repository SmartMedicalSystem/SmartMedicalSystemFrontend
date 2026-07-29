import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestResultService {

private api = 'https://smartmedicalsystem.runasp.net/api';

  constructor(private http: HttpClient) {}

  getResult(id: number) {
    return this.http.get(`${this.api}/PatientResults/${id}`);
  }

  getElements(
    patientResultId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ) {
    return this.http.get(
      `${this.api}/PatientResultElements/by-patient-result/${patientResultId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  updateElement(id: number, body: any) {
    return this.http.put(
      `${this.api}/PatientResultElements/${id}`,
      body
    );
  }

  createElement(body: any) {
    return this.http.post(
      `${this.api}/PatientResultElements`,
      body
    );
  }

  updateResult(id: number, body: any) {
    return this.http.put(
      `${this.api}/PatientResults/${id}`,
      body
    );
  }

  createPatientResult(body: any) {
    return this.http.post(
      `${this.api}/PatientResults`,
      body
    );
  }
}

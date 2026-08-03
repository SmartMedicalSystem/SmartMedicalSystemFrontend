import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientResult } from '../../shared/interfaces/LabTechnician/PatientResult';
import { PatientResultElement } from '../../shared/interfaces/LabTechnician/PatientResultElement';
import { PaginatedResponse } from '../../shared/interfaces/LabTechnician/PaginatedResponse';
import { PatientAIReport } from '../../shared/interfaces/LabTechnician/PatientAIReport';
@Injectable({
  providedIn: 'root',
})
export class TestResultService {

  // Local API
  private api = 'https://localhost:7099/api';

  constructor(private http: HttpClient) {}

  getResult(id: number): Observable<PatientResult> {
    return this.http.get<PatientResult>(
      `${this.api}/PatientResults/${id}`
    );
  }

  getElements(
    patientResultId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<PaginatedResponse<PatientResultElement>> {

    return this.http.get<PaginatedResponse<PatientResultElement>>(
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

  generateAIReport(patientResultId: number): Observable<PatientAIReport> {
  return this.http.post<PatientAIReport>(
    `${this.api}/PatientAIReports/results/${patientResultId}/generate`,
    {}
  );
}
}


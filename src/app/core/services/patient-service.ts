import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Patient {
  id: number;
  nationalId: number;
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth: string;
  gender: number;
  mobileNumber: number;
  address: string;
  bloodType: number;
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  nationalId: string;
  dateOfBirth: string;
  gender: number;
  mobileNumber: number;
  address: string;
  bloodType: number;
}

export interface UpdatePatientDto {
  firstName: string;
  lastName: string;
  nationalId: number;
  dateOfBirth: string;
  gender: number;
  mobileNumber: number;
  address: string;
  bloodType: number;
}

@Injectable({
  providedIn: 'root',
})
export class PatientsService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7099/api/Patients';

  addPatient(dto: CreatePatientDto): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, dto);
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  updatePatient(id: number, dto: UpdatePatientDto): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, dto);
  }
}
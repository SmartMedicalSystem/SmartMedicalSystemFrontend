import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {Patient} from '../../shared/interfaces/Patient/patient.interface';
import{ CreatePatientDto} from '../../shared/interfaces/Patient/create-patient.dto';
import { UpdatePatientDto } from '../../shared/interfaces/Patient/update-patient.dto';
@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  private http = inject(HttpClient);

  private apiUrl = 'https://smartmedicalsystem.runasp.net/api/Patients';

  addPatient(dto: CreatePatientDto): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, dto);
  }

  getPatientBySSN(ssn: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${ssn}`);
  }

 
  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/by-id/${id}`);
  }

  updatePatient(ssn: string, dto: UpdatePatientDto): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${ssn}`, dto);
  }

  
  updatePatientById(id: number, dto: UpdatePatientDto): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/by-id/${id}`, dto);
  }

  deletePatient(ssn: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ssn}`);
  }
}
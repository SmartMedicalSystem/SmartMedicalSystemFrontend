import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../../shared/interfaces/Doctor/doctor.interface';
import { DoctorResponse } from '../../shared/interfaces/Doctor/doctor-response.interface';
import { CreateDoctorDto } from '../../shared/interfaces/Doctor/create-doctor.interface';
import { UpdateDoctorDto } from '../../shared/interfaces/Doctor/update-doctor.interface';
@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private apiUrl = 'https://smartmedicalsystem.runasp.net/api/Doctors';

  constructor(private http: HttpClient) { }

  // ================= GET ALL =================
  getAllDoctors(pageNumber: number = 1, pageSize: number = 10): Observable<DoctorResponse> {
    return this.http.get<DoctorResponse>(
      `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  // ================= GET BY DEPARTMENT =================
  getDoctorsByDepartment(
    departmentId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<DoctorResponse> {
    return this.http.get<DoctorResponse>(
      `${this.apiUrl}/by-department/${departmentId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  // ================= GET BY SSN (nationalId) =================
  getDoctorBySSN(ssn: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${ssn}`);
  }

  // ================= CREATE =================
  addDoctor(dto: CreateDoctorDto): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.apiUrl}/create`, dto);
  }

  // ================= GET BY ID =================
  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/by-id/${id}`);
  }

  // ================= UPDATE (بالـ id) =================
  updateDoctor(id: number, dto: UpdateDoctorDto): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/by-id/${id}`, dto);
  }

  // ================= DELETE (بالـ id) =================
  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/by-id/${id}`);
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: string;
  address: string;
  gender: number;
  nationalId: string;
  departmentId: number;
  departmentName: string;
}

export interface DoctorResponse {
  items: Doctor[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  firstItemIndex: number;
  lastItemIndex: number;
}

export interface CreateDoctorDto {
  name: string;
  specialization: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: string;
  password: string;
  address: string;
  gender: number;
  nationalId: string;
  departmentId: number;
}

export interface UpdateDoctorDto {
  name: string;
  specialization: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: string;
  address: string;
  gender: number;
  nationalId: string;
  departmentId: number;
}

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private apiUrl = 'https://localhost:7099/api/Doctors';

  constructor(private http: HttpClient) {}

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
  // مفيش GetById(int) في الباك، بس GetBySSN(string ssn)
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
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  contact: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: number;
  address: string;
  gender: number;
  nationalId: number;
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
  contact: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: number;
  address: string;
  gender: number;
  nationalId: number;
  departmentId: number;
}

export interface UpdateDoctorDto {
  name: string;
  specialization: string;
  contact: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: number;
  address: string;
  gender: number;
  nationalId: number;
  departmentId: number;
}

@Injectable({
  providedIn: 'root',
})
export class DoctorService {

  private apiUrl = 'https://localhost:7099/api/Doctors';

  constructor(private http: HttpClient) {}

  // ================= GET ALL =================

  getAllDoctors(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<DoctorResponse> {

    return this.http.get<DoctorResponse>(
      `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

  }

  // ================= GET BY ID =================

  getDoctorById(id: number): Observable<Doctor> {

    return this.http.get<Doctor>(
      `${this.apiUrl}/${id}`
    );

  }

  // ================= CREATE =================

  addDoctor(dto: CreateDoctorDto): Observable<Doctor> {

    return this.http.post<Doctor>(
      this.apiUrl,
      dto
    );

  }

  // ================= UPDATE =================

  updateDoctor(
    id: number,
    dto: UpdateDoctorDto
  ): Observable<Doctor> {

    return this.http.put<Doctor>(
      `${this.apiUrl}/${id}`,
      dto
    );

  }

  // ================= DELETE =================

  deleteDoctor(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

}
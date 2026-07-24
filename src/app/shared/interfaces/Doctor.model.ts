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
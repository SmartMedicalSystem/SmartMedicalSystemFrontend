export interface Patient {
  email: string | null | undefined;
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
    email: string;  

  dateOfBirth: string;
  gender: number;
  mobileNumber: number;
  address: string;
  bloodType: number;
}

export interface UpdatePatientDto {
  firstName: string;
  lastName: string;
  nationalId: string;
   email: string;  
  dateOfBirth: string;
  gender: number;
  mobileNumber: number;
  address: string;
  bloodType: number;
}
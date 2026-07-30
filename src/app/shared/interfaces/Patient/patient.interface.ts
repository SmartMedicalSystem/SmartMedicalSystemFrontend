export interface Patient {
  email: string | null | undefined;
  id: number;
  nationalId: string;
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth: string;
  gender: number;
  mobileNumber: string;
  address: string;
  bloodType: number;
}
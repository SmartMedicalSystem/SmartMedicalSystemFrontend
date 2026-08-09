export interface Patient {
  email: string | null | undefined;
  id: number;
  nationalId: string;
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  mobileNumber: string;
  address: string;
  bloodType: string;
  city: string;
    country: string;   

}
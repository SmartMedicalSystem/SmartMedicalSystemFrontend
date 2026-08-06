// مطابقة لـ Application.DTOs.Patient.PatientReadDto في الباك اند
export interface Patient {
  id: number;
  nationalId: number;
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth: string;
  gender: string; // "Male" | "Female" - الباك اند بيرجعها كـ string مش رقم
  mobileNumber: number;
  address: string;
  bloodType: string;

  // مؤقتًا لحد ما الباك يعمله
  hasPendingReports?: boolean;
}

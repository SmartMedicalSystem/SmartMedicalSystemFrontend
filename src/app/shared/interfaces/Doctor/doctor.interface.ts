export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: number;
  nationalId: string;
  departmentId: number;
  departmentName: string;
}

// ============ Doctor DTOs ============

export interface DoctorReadDto {
  id: number;
  name: string;
  specialization: string;
  contact: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: string; // "Male" | "Female"
  encryptedNationalId: string;
  departmentId: number;
  departmentName?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  photoUrl?: string;
}

// TODO: شكل الـ DTO ده تخمين برضو — تأكد من الحقول الفعلية في
// Application.DTOs.Doctor.DoctorCreateDto لو هتفعّل الـ create تاني.
export interface DoctorCreateDto {
  name: string;
  specialization: string;
  contact: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: string;
  address: string;
  gender: string;
  nationalId: string;
  departmentId: number;
  city: string;
  country: string;
  postalCode?: string;
}

// مطابقة تمامًا لـ Application.DTOs.Doctor.DoctorUpdateDto
export interface DoctorUpdateDto {
  name: string;
  specialization: string;
  contact: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: string;
  address: string;
  gender: string;
  nationalId: string;
  departmentId: number;
  city: string;
  country: string;
  postalCode?: string;
}
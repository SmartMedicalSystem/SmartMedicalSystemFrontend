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

// ⚠️ اتصححت بناءً على الـ Response الحقيقي من GetDoctorById (اللي وصلني):
// - الحقل اسمه phoneNumber مش mobileNumber في الـ Read
// - National ID بيرجع مشفّر باسم encryptedNationalId مش nationalId
// - GetById مبيرجعش City/Country خالص حاليًا، فمفيش مصدر نحمّل منه القيمة
//   القديمة زي ما بنعمل مع NationalId - الحقلين دول لازم ياخدهم الدكتور بنفسه
//   في الفورم (Update DTO الحقيقي بيطلبهم كـ required).
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

// مطابقة تمامًا لـ Application.DTOs.Doctor.DoctorUpdateDto (الكود الحقيقي اللي بعتهولي):
// Name, Specialization, Contact, DateOfBirth, Email, MobileNumber(string),
// Address, Gender, NationalId(string, required), DepartmentId,
// City(string, required), Country(string, required), PostalCode(string?, اختياري)
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

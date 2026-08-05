// ============ Doctor DTOs ============

// ⚠️ الحقول دي اتصححت لتطابق Application.DTOs.Doctor.DoctorUpdateDto الحقيقي
// (اللي وصلني كوده كامل)، مش النسخة اللي كانت هنا قبل كده (كانت مبنية على
// تخمين غلط إن الاسم phoneNumber/encryptedNationalId).
// DoctorReadDto مش عندنا الكود الحقيقي بتاعه بالكامل لسه، فبنفترض إنه بيتبع
// نفس تسمية Update (منطقي إن الـ Read/Update يشتركوا في نفس أسماء الحقول
// الأساسية). لو Swagger ورّاك اسم مختلف في GetById تحديدًا، قولّي وأصححها.
export interface DoctorReadDto {
  id: number;
  name: string;
  specialization: string;
  contact: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: number; // مطابق لـ MobileNumber:int في DoctorUpdateDto الحقيقي
  address: string;
  gender: string; // "Male" | "Female"
  nationalId: string; // مطابق لـ NationalId:string في DoctorUpdateDto الحقيقي
  departmentId: number;
  departmentName?: string;
}

// TODO: شكل الـ DTO ده تخمين برضو — تأكد من الحقول الفعلية في
// Application.DTOs.Doctor.DoctorCreateDto (افتراضيًا نفس Update + nationalId مطلوب)
export interface DoctorCreateDto {
  name: string;
  specialization: string;
  contact: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: number;
  address: string;
  gender: string;
  nationalId: string;
  departmentId: number;
}

// مطابقة تمامًا لـ Application.DTOs.Doctor.DoctorUpdateDto (الكود الحقيقي اللي بعتهولي):
// Name, Specialization, Contact, DateOfBirth, Email, MobileNumber(int),
// Address, Gender, NationalId(string, required), DepartmentId
export interface DoctorUpdateDto {
  name: string;
  specialization: string;
  contact: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: number;
  address: string;
  gender: string;
  nationalId: string;
  departmentId: number;
}

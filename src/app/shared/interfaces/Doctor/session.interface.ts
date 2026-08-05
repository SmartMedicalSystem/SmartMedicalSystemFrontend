// ============ Session DTOs ============
// مطابقة لـ Application.DTOs.Session في الباك اند (SessionsController)

// مطابقة تمامًا لـ Application.DTOs.Session.SessionCreateDto
export interface SessionCreateDto {
  patientId: number;
  doctorId: number;
  deptId: number;
  sessionDate: string; // ISO date string
  notes?: string;
}

// TODO: شكل الـ DTO ده تخمين — تأكد من الحقول الفعلية في Application.DTOs.Session.SessionUpdateDto
// افتراضيًا نفس شكل الـ Create لكن من غير patientId (مش المفروض يتغير بعد الإنشاء)
export interface SessionUpdateDto {
  doctorId: number;
  deptId: number;
  sessionDate: string;
  notes?: string;
}

// TODO: شكل الـ DTO ده تخمين — تأكد من الحقول الفعلية في Application.DTOs.Session.SessionReadDto
export interface SessionReadDto {
  id: number;
  patientId: number;
  doctorId: number;
  doctorName?: string;
  deptId: number;
  deptName?: string;
  sessionDate: string;
  notes?: string;
}

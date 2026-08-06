// ============ Patient Results DTOs ============
// مطابقة لـ Application.DTOs.PatientResult في الباك اند (PatientResultsController)

// مطابقة تمامًا لـ Application.DTOs.PatientResult.PatientResultReadDto
export interface PatientResultReadDto {
  id: number;
  patientId: number;
  sessionId: number;
  labTestId: number;
  summary: string;
  aiClassifiedReport: string;
  aiSuggestion: string;
}

// TODO: شكل الـ DTO ده تخمين — تأكد من الحقول الفعلية في Application.DTOs.PatientResult.PatientResultCreateDto
export interface PatientResultCreateDto {
  patientId: number;
  sessionId: number;
  labTestId: number;
  summary: string;
  aiClassifiedReport: string;
  aiSuggestion: string;
}

// TODO: شكل الـ DTO ده تخمين — تأكد من الحقول الفعلية في Application.DTOs.PatientResult.PatientResultUpdateDto
export interface PatientResultUpdateDto {
  summary: string;
  aiClassifiedReport: string;
  aiSuggestion: string;
}

// ============ Patient Results DTOs ============
// مطابقة لـ Application.DTOs.PatientResult في الباك اند (PatientResultsController)

export enum PatinetResultAIReportStatus {
  Pending = 1,
  Approved = 2,
}

// مطابقة تمامًا لـ Application.DTOs.PatientResult.PatientResultReadDto
export interface PatientResultReadDto {
  id: number;
  patientId: number;
  sessionId: number;
  labTestId: number;
  summary: string;
  aiClassifiedReport: string;
  aiSuggestion: string;
  aiReportStatus: PatinetResultAIReportStatus;
}

export interface PatientResultCreateDto {
  patientId: number;
  sessionId: number;
  labTestId: number;
  summary: string;
  aiClassifiedReport: string;
  aiSuggestion: string;
}

export interface PatientResultUpdateDto {
  summary: string;
  aiClassifiedReport: string;
  aiSuggestion: string;
}

export interface PatientResultStatusUpdateDto {
  status: PatinetResultAIReportStatus;
}


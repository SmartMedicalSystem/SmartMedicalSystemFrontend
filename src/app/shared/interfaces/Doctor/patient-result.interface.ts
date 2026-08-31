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
  /** Full name of the patient (FirstName + LastName) — populated by backend */
  patientName?: string;
  sessionId: number;
  /** The date the session/lab test was performed */
  sessionDate?: string;
  labTestId: number;
  /** Name of the lab test — populated by backend */
  labTestName?: string;
  summary: string;
  // ASP.NET camelCase serializes 'AIClassifiedReport' -> 'aIClassifiedReport'
  aIClassifiedReport?: string;
  aiClassifiedReport?: string;
  // ASP.NET camelCase serializes 'AISuggestion' -> 'aISuggestion'
  aISuggestion?: string;
  aiSuggestion?: string;
  aiReportStatus: PatinetResultAIReportStatus;
}

export interface PatientResultCreateDto {
  patientId: number;
  sessionId: number;
  labTestId: number;
  summary: string;
  aiClassifiedReport?: string;
  aIClassifiedReport?: string;
  aiSuggestion?: string;
  aISuggestion?: string;
}

export interface PatientResultUpdateDto {
  summary: string;
  aIClassifiedReport?: string;
  aiClassifiedReport?: string;
  aISuggestion?: string;
  aiSuggestion?: string;
  status?: PatinetResultAIReportStatus;
}

export interface PatientResultStatusUpdateDto {
  status: PatinetResultAIReportStatus;
}


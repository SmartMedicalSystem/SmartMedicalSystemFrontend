// TODO: شكل الـ DTO ده تخمين — تأكد من الحقول الفعلية في Application.DTOs.AI.PatientResultElementSummaryDto
export interface PatientResultElementSummaryDto {
  elementName: string;
  value: string;
  normalRange?: string;
  isAbnormal?: boolean;
}

// مطابقة تمامًا لـ Application.DTOs.AI.PatientResultAIAnalysisDto
export interface PatientResultAIAnalysisDto {
  patientResultId: number;
  patientId: number;
  sessionId: number;
  labTestId: number;
  labTestName: string;
  generatedAtUtc: string;
  testDate?: string;
  elements: PatientResultElementSummaryDto[];
  summary: string;
  aiClassifiedReport: string;
  aiSuggestion: string;
  disclaimer: string;
}

// مطابقة تمامًا لـ Application.DTOs.AI.PatientFullAIReportDto
export interface PatientFullAIReportDto {
  patientId: number;
  patientFullName: string;
  age: number;
  gender: string;
  bloodType: string;
  generatedAtUtc: string;
  results: PatientResultAIAnalysisDto[];
  overallAISummary: string;
  overallAISuggestion: string;
  disclaimer: string;
}

export interface StoredFullReportDto {
  content: string;
}


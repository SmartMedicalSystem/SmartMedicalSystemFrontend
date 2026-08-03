export interface PatientAIReport {
  patientResultId: number;
  patientId: number;
  sessionId: number;
  labTestId: number;
  labTestName: string;
  generatedAtUtc: string;
  elements: AIReportElement[];
  summary: string;
  aiClassifiedReport: string;
  aiSuggestion: string;
  disclaimer: string;
}

export interface AIReportElement {
  testElementId: number;
  elementName: string;
  unit: string;
  value: number;
  normalMin: number;
  normalMax: number;
  flag: string;
}
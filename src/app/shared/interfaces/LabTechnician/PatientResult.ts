export interface PatientResult {
  id: number;
  patientName: string;
  patientAge: number;
  gender: string;
  doctorName: string;
  departmentName: string;
  laboratoryName: string;
  labTestName: string;
  requestDate: string;
  status: string;
  priority: string;
  summary: string;
  aiClassifiedReport: string;
  aiSuggestion: string;
}
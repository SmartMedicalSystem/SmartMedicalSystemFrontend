export interface PatientResultElement {

  id: number;

  patientResultId: number;

  testElementName: string;

  value: number;

  unit: string;

  normalMin: number;

  normalMax: number;

  status: string;

  techId: number;
}
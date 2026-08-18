export interface PatientResultElementDto {
  testElementId: number;
  elementName: string;
  unit: string;
  value: number;
  normalMin: number;
  normalMax: number;
  flag: 'Low' | 'Normal' | 'High' | string;
}
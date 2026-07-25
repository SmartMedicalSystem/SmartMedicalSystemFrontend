import { LabTestDetails } from './LabTestDetails';
import { TechnicianDetails } from './TechnicianDetails';

export interface LaboratoryDetails {
  id: number;
  name: string;
  location: string;
  phone: string;
  code: string | null;
  specialty: string | null;
  status: 'Active' | 'Inactive' | 'Maintenance' | 'Closed';
  headTechnicianId: number | null;
  headTechnicianName: string | null;
  departmentId: number | null;
  departmentName: string | null;
  testCount: number;
  technicianCount: number;
  createdAt: Date;
}

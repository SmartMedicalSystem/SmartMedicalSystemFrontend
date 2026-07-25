import { DoctorAtDepartment } from './DoctorAtDepartment ';

export interface Department {
  id: number;
  name: string;
  floorNumber: number | null;
  headDoctor: string;
  headDoctorId: number | null;
  status: 'Active' | 'Inactive' | 'Maintenance';
  doctorCount: number;
  createdAt: Date;
  doctors: DoctorAtDepartment[];
}

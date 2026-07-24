export interface Laboratory {
  id: number;
  name: string;
  location: string;
  phone: string;
  code: string | null; // ← NEW
  specialty: string | null; // ← NEW
  status: 'Active' | 'Inactive' | 'Maintenance' | 'Closed';
  headTechnicianId: number | null;
  headTechnicianName: string | null;
  departmentId: number | null;
  departmentName: string | null;
  testCount: number;
  technicianCount: number;
  createdAt: Date;
}

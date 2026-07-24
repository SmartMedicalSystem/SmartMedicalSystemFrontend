export interface CreateLaboratoryDto {
  name: string;
  location: string;
  phone: string;
  code?: string | null; // ← NEW
  specialty?: string | null; // ← NEW
  status?: string;
  headTechnicianId?: number | null;
  departmentId?: number | null;
}

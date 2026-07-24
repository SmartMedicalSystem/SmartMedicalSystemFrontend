export interface UpdateLaboratoryDto {
  name: string;
  location: string;
  phone: string;
  code?: string | null; // ← NEW
  specialty?: string | null; // ← NEW
  status?: string | null;
  headTechnicianId?: number | null;
  departmentId?: number | null;
}

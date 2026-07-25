export interface UpdateDepartmentDto {
  name: string;
  floorNumber?: number | null;
  headDoctor: string;
  headDoctorId?: number | null;
  phoneExt?: string | null;
  status?: string;
}

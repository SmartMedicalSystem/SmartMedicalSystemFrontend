// ============ Request Labs DTOs ============
// مطابقة لـ Application.DTOs.RequestLabs في الباك اند

// TODO: تأكد من أسماء قيم enum Domain.Enums.LabRequestPriority الفعلية في الباك.
// الافتراض هنا إنها بتتسلسل كـ string زي باقي الـ enums في المشروع (Gender مثلاً)،
// والقيم شائعة الاستخدام بتبقى بالشكل ده. عدّل الاتحاد (union) ده لو مختلف.
export type LabRequestPriority = 'Low' | 'Normal' | 'High' | 'Urgent';

export interface RequestLabsCreateDto {
  sessionId: number;
  requestedAt: string; // ISO date string
  labTestIds: number[];
  priority: LabRequestPriority; // الباك عنده Default = Normal لو اتبعتت من غيرها
}

export interface RequestLabsUpdateStatusDto {
  // TODO: عدّل النوع لو الباك عامل الحالة enum برقم بدل string
  status: string;
}

export interface RequestLabsReadDto {
  id: number;
  sessionId: number;
  requestedAt: string;
  status: string;
  labTests: {
    id: number;
    name: string;
  }[];
}

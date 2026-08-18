// مطابقة لـ Application.DTOs.Rag.RagChatRequestDto
// PatientId nullable (زي الباك int?) — null يعني بحث عام مش مربوط بمريض معين،
// وده اللي هنستخدمه في صفحة الـ Home بالتحديد.
export interface AIChatRequestDto {
  question: string;
  patientId: number | null;
  topK?: number;
  groupByPatient?: boolean;
}

// مطابقة لـ Application.DTOs.Rag.RagSourceDto
export interface RagSourceDto {
  documentId: number;
  patientId: number;
  patientResultId: number | null;
  sourceType: string;
  content: string;
  similarityScore: number;
}

// مطابقة لـ Application.DTOs.Rag.RagChatResponseDto
export interface AIChatResponseDto {
  answer: string;
  sources: RagSourceDto[];
  disclaimer: string;
}

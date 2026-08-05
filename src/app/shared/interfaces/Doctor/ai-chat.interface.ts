export interface AIChatRequestDto {
  patientId: number;
  question: string;
}

export interface AIChatResponseDto {
  answer: string;
}
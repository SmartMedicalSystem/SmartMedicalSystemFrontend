export type NotificationType =
  | 'LabTestRequested'
  | 'LabResultReady'
  | 'AppointmentReminder'
  | 'AIReportGenerated';

export interface INotification {
  id: number;
  message: string;
  sentAt: string;
  isRead: boolean;
  type: NotificationType;
  requestLabsId: number;
  patientResultId: number;
  sessionId: number;
  patientId: number;

  isNew?: boolean;
}
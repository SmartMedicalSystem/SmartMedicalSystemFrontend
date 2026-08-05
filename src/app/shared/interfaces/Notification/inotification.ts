export interface INotification {
  id: number;
  message: string;
  sentAt: string;
  isRead: boolean;
  isNew?: boolean;
}
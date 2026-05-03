import type { NotificationType } from "./enum.type";

export interface Notification {
  id: string;
  type: NotificationType;
  content: string;
  referenceId: string | null;
  isRead: boolean;
  createdAt: string;
  issuerId: string | null;
  issuerName: string | null;
  issuerAvatar: string | null;
}

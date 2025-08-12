export type NotificationType =
  typeof import("./constants").NOTIFICATION_TYPES[keyof typeof import("./constants").NOTIFICATION_TYPES];

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
  groupId?: string;
  timestamp: number;
}

export interface IndividualNotificationProps {
  id: string;
  type: NotificationData["type"];
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export interface NotificationOptions {
  autoClose?: boolean;
  autoCloseDelay?: number;
  id?: string;
  replaceId?: string;
}

export interface NotificationGroup {
  id: string;
  notifications: NotificationData[];
  isExpanded: boolean;
}

export interface NotificationContextType {
  showNotification: (
    notification: Omit<NotificationData, "id" | "timestamp"> & {
      id?: string;
      replaceId?: string;
    }
  ) => void;
  hideNotification: (id: string) => void;
  hideNotificationGroup: (groupId: string) => void;
}

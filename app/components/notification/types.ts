export interface NotificationData {
  id: string;
  type: "success" | "error" | "loading";
  title: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
  groupId?: string;
  timestamp: number;
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

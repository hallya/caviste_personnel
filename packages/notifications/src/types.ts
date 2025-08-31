export type NotificationType = "success" | "error" | "loading";

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

export interface NotificationGroupType {
  id: string;
  notifications: NotificationData[];
  isExpanded: boolean;
}

export interface NotificationContextType {
  showNotification: (
    notification: Omit<NotificationData, "id" | "timestamp"> & {
      id?: string;
      replaceId?: string;
    },
  ) => void;
  hideNotification: (id: string) => void;
  hideNotificationGroup: (groupId: string) => void;
}

// Module types
export type NotificationModuleAPI = {
  showNotification: NotificationContextType["showNotification"];
  hideNotification: NotificationContextType["hideNotification"];
  hideNotificationGroup: NotificationContextType["hideNotificationGroup"];
}

export interface NotificationModuleConfig {
  defaultAutoClose?: boolean;
  defaultAutoCloseDelay?: number;
  maxGroupNotifications?: number;
}

// Constants
export const NOTIFICATION_DEFAULTS = {
  ANIMATION_DURATION: 300,
  AUTO_CLOSE_DELAY: 5000,
} as const;

export const NOTIFICATION_GROUPS = {
  CART: "cart",
} as const;
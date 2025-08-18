import type { NotificationData as BaseNotificationData } from "../../components/notification/types";

export interface NotificationData extends BaseNotificationData {
  checkoutUrl?: string;
}

export interface NotificationModuleAPI {
  showNotification: (notification: Omit<NotificationData, "id" | "timestamp"> & { id?: string; replaceId?: string }) => void;
  hideNotification: (id: string) => void;
  hideNotificationGroup: (groupId: string) => void;
}

export interface NotificationModuleConfig {
  maxNotifications: number;
  defaultDuration: number;
  enableGrouping: boolean;
}

export interface NotificationProps {
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  checkoutUrl?: string;
}

export interface NotificationData {
  id: string;
  type: "success" | "error";
  title: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
  checkoutUrl?: string;
}

export interface NotificationContextType {
  showNotification: (notification: Omit<NotificationData, "id">) => void;
  hideNotification: (id: string) => void;
} 
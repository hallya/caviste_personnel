import { useEffect } from "react";

import { CloseIcon } from "../design-system/icons";
import type { NotificationData } from "./types";
import NotificationContent from "./NotificationContent";

interface IndividualNotificationProps {
  id: string;
  type: NotificationData["type"];
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function IndividualNotification({
  id,
  type,
  title,
  message,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
}: IndividualNotificationProps) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, onClose]);

  return (
    <div
      className="bg-white rounded-lg shadow-lg border-l-4 border-primary-600 p-4 transform transition-all duration-200 ease-out"
      role="alert"
      aria-live="polite"
      aria-label={`${title}: ${message}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center flex-1 min-w-0">
          <NotificationContent
            notification={{ id, type, title, message, timestamp: Date.now() }}
          />
        </div>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label={`Fermer la notification: ${title}`}
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

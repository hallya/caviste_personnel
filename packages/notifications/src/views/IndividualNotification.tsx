import { useEffect } from "react";
import { CloseIcon } from "@pkg/design-system";
import type { IndividualNotificationProps } from "../types";
import NotificationContent from "./NotificationContent";

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
        <NotificationContent
          notification={{ id, type, title, message, timestamp: Date.now() }}
        />
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-600 transition-colors ml-3 flex-shrink-0"
          aria-label={`Fermer la notification: ${title}`}
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

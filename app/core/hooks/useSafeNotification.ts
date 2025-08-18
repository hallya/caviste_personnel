"use client";

import { useNotification } from "../../contexts/NotificationContext";

export function useSafeNotification() {
  try {
    return useNotification();
  } catch {
    return {
      showNotification: () => {},
      hideNotification: () => {},
      hideNotificationGroup: () => {},
    };
  }
}

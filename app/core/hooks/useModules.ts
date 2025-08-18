"use client";

import { useSafeAppShell } from "./useSafeAppShell";
import type { CartModuleAPI } from "../../modules/cart/types";
import type { NotificationModuleAPI } from "../../modules/notifications/types";

export function useModules() {
  const { getModuleAPI, isModuleLoaded } = useSafeAppShell();

  const getCartModule = (): CartModuleAPI | null => {
    return getModuleAPI("cart") as CartModuleAPI | null;
  };

  const getNotificationModule = (): NotificationModuleAPI | null => {
    return getModuleAPI("notifications") as NotificationModuleAPI | null;
  };

  return {
    cart: {
      api: getCartModule(),
      isLoaded: isModuleLoaded("cart"),
    },
    notifications: {
      api: getNotificationModule(),
      isLoaded: isModuleLoaded("notifications"),
    },
  };
}

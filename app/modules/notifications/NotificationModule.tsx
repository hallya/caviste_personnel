"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useSafeNotification } from "../../core/hooks/useSafeNotification";
import { useSafeAppShell } from "../../core/hooks/useSafeAppShell";
import type { NotificationModuleAPI, NotificationModuleConfig } from "./types";
import type { FeatureModule } from "../../core/shell/types";

const NotificationModuleContext = createContext<NotificationModuleAPI | null>(
  null
);

interface NotificationModuleProps {
  children: ReactNode;
  config?: Partial<NotificationModuleConfig>;
}

export function NotificationModule({ children }: NotificationModuleProps) {
  const notificationContext = useSafeNotification();
  const appShell = useSafeAppShell();
  const registeredRef = useRef(false);

    const publicAPI = useMemo<NotificationModuleAPI>(
    () => ({
      showNotification: notificationContext.showNotification,
      hideNotification: notificationContext.hideNotification,
      hideNotificationGroup: notificationContext.hideNotificationGroup,
    }),
    [notificationContext]
  );

  const featureModule: FeatureModule = useMemo(
    () => ({
      initialize: async () => {},
      getPublicAPI: () => publicAPI as unknown as Record<string, unknown>,
      destroy: () => {},
    }),
    [publicAPI]
  );

  useEffect(() => {
    if (!registeredRef.current) {
      const moduleConfigData = {
        name: "notifications",
        routes: [],
        publicAPI: publicAPI as unknown as Record<string, unknown>,
      };

      appShell.registerModule("notifications", featureModule, moduleConfigData);
      registeredRef.current = true;
    }
  }, [appShell, featureModule, publicAPI]);

  return (
    <NotificationModuleContext.Provider value={publicAPI}>
      {children}
    </NotificationModuleContext.Provider>
  );
}

export function useNotificationModule() {
  const context = useContext(NotificationModuleContext);
  if (!context) {
    throw new Error(
      "useNotificationModule must be used within NotificationModule"
    );
  }
  return context;
}

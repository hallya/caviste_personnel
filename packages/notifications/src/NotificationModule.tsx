"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useSafeAppShell, type FeatureModule } from "@pkg/core";
import { useNotification } from "./context/NotificationContext";
import { setNotificationContext } from "./hooks/useSafeNotification";
import type { NotificationModuleAPI, NotificationModuleConfig } from "./types";

const NotificationModuleContext = createContext<NotificationModuleAPI | null>(
  null
);

interface NotificationModuleProps {
  children: ReactNode;
  config?: Partial<NotificationModuleConfig>;
}

export function NotificationModule({ children }: NotificationModuleProps) {
  const notificationContext = useNotification();
  const appShell = useSafeAppShell();
  const registeredRef = useRef(false);

  useEffect(() => {
    setNotificationContext(notificationContext);
  }, [notificationContext]);

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
      getPublicAPI: () => publicAPI,
      destroy: () => {},
    }),
    [publicAPI]
  );

  useEffect(() => {
    if (!registeredRef.current) {
      const moduleConfigData = {
        name: "notifications",
        routes: [],
        publicAPI,
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

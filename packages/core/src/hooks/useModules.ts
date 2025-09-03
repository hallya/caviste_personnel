"use client";

import { useMemo } from "react";
import { useSafeAppShell } from "./useSafeAppShell";
import type { NotificationModuleAPI } from "@pkg/notifications";

export function useModules() {
  const { getModuleAPI, isModuleLoaded } = useSafeAppShell();

  const notifications = useMemo(() => {
    const api = getModuleAPI("notifications") as NotificationModuleAPI | null;
    return {
      api,
      isLoaded: isModuleLoaded("notifications"),
    };
  }, [getModuleAPI, isModuleLoaded]);

  return { notifications };
}

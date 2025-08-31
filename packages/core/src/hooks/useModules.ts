"use client";

import { useMemo } from "react";
import { useSafeAppShell } from "./useSafeAppShell";
import type { CartModuleAPI } from "@pkg/cart";
import type { NotificationModuleAPI } from "@pkg/notifications";

export function useModules() {
  const { getModuleAPI, isModuleLoaded } = useSafeAppShell();

  const cart = useMemo(() => {
    const api = getModuleAPI("cart") as CartModuleAPI | null;
    return {
      api,
      isLoaded: isModuleLoaded("cart"),
    };
  }, [getModuleAPI, isModuleLoaded]);

  const notifications = useMemo(() => {
    const api = getModuleAPI("notifications") as NotificationModuleAPI | null;
    return {
      api,
      isLoaded: isModuleLoaded("notifications"),
    };
  }, [getModuleAPI, isModuleLoaded]);

  return { cart, notifications };
}

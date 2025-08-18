"use client";

import { useAppShell } from "../shell/AppShell";

export function useSafeAppShell() {
  try {
    return useAppShell();
  } catch {
    return {
      registerModule: () => {},
      getModule: () => null,
      getModuleAPI: () => null,
      isModuleLoaded: () => false,
    };
  }
}

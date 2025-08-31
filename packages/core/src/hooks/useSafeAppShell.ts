"use client";

import { useAppShell, type AppShellContextType } from "../shell/AppShell";

export function useSafeAppShell(): AppShellContextType {
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

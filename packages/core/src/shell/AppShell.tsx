"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import type { FeatureModule, ModuleConfig } from "./types";

export interface AppShellContextType {
  registerModule: (
    name: string,
    featureModule: FeatureModule,
    config: ModuleConfig,
  ) => void;
  getModule: (name: string) => FeatureModule | null;
  getModuleAPI: (name: string) => Record<string, unknown> | null;
  isModuleLoaded: (name: string) => boolean;
}

const AppShellContext = createContext<AppShellContextType | null>(null);

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [modules, setModules] = useState<Map<string, FeatureModule>>(new Map());
  const [, setModuleConfigs] = useState<Map<string, ModuleConfig>>(new Map());

  const registerModule = useCallback(
    (name: string, featureModule: FeatureModule, config: ModuleConfig) => {
      setModules((prev) => new Map(prev).set(name, featureModule));
      setModuleConfigs((prev) => new Map(prev).set(name, config));
    },
    [],
  );

  const getModule = useCallback(
    (name: string) => {
      return modules.get(name) || null;
    },
    [modules],
  );

  const getModuleAPI = useCallback(
    (name: string) => {
      const featureModule = modules.get(name);
      return featureModule ? featureModule.getPublicAPI() : null;
    },
    [modules],
  );

  const isModuleLoaded = useCallback(
    (name: string) => {
      return modules.has(name);
    },
    [modules],
  );

  const contextValue: AppShellContextType = {
    registerModule,
    getModule,
    getModuleAPI,
    isModuleLoaded,
  };

  return (
    <AppShellContext.Provider value={contextValue}>
      {children}
    </AppShellContext.Provider>
  );
}

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error("useAppShell must be used within AppShell");
  }
  return context;
}

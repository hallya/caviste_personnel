"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import type { RouteConfig } from "../shell/types";

interface RouteRegistryContextType {
  registerRoute: (config: RouteConfig) => void;
  preloadRoute: (path: string) => Promise<void>;
  getRouteConfig: (path: string) => RouteConfig | null;
  preloadOnHover: (path: string) => void;
  preloadOnViewport: (path: string) => void;
}

const RouteRegistryContext = createContext<RouteRegistryContextType | null>(
  null
);

interface RouteRegistryProps {
  children: ReactNode;
}

export function RouteRegistry({ children }: RouteRegistryProps) {
  const [routes, setRoutes] = useState<Map<string, RouteConfig>>(new Map());
  const [preloadedRoutes, setPreloadedRoutes] = useState<Set<string>>(
    new Set()
  );

  const registerRoute = useCallback((config: RouteConfig) => {
    setRoutes((prev) => new Map(prev).set(config.path, config));
  }, []);

  const preloadRoute = useCallback(
    async (path: string) => {
      if (preloadedRoutes.has(path)) return;

      const routeConfig = routes.get(path);
      if (!routeConfig) return;

      try {
        if (routeConfig.preload) {
          await routeConfig.preload();
        }
        await routeConfig.component();
        setPreloadedRoutes((prev) => new Set(prev).add(path));
      } catch (error) {
        console.error(`Failed to preload route ${path}:`, error);
      }
    },
    [routes, preloadedRoutes]
  );

  const getRouteConfig = useCallback(
    (path: string) => {
      return routes.get(path) || null;
    },
    [routes]
  );

  const preloadOnHover = useCallback(
    (path: string) => {
      setTimeout(() => preloadRoute(path), 100);
    },
    [preloadRoute]
  );

  const preloadOnViewport = useCallback(
    (path: string) => {
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              preloadRoute(path);
              observer.disconnect();
            }
          });
        });

        const element = document.querySelector(
          `[data-preload-route="${path}"]`
        );
        if (element) observer.observe(element);
      }
    },
    [preloadRoute]
  );

  const contextValue: RouteRegistryContextType = {
    registerRoute,
    preloadRoute,
    getRouteConfig,
    preloadOnHover,
    preloadOnViewport,
  };

  return (
    <RouteRegistryContext.Provider value={contextValue}>
      {children}
    </RouteRegistryContext.Provider>
  );
}

export function useRouteRegistry() {
  const context = useContext(RouteRegistryContext);
  if (!context) {
    throw new Error("useRouteRegistry must be used within RouteRegistry");
  }
  return context;
}

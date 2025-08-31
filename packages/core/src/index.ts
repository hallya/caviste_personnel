// Shell
export { AppShell, useAppShell } from "./shell/AppShell";
export type {
  FeatureModule,
  ModuleConfig,
  RouteConfig,
  AppShellConfig,
} from "./shell/types";

// Routing
export { RouteRegistry, useRouteRegistry } from "./routing/RouteRegistry";

// Components
export { PreloadLink } from "./components/PreloadLink";

// Hooks
export { useModules } from "./hooks/useModules";
export { useSafeAppShell } from "./hooks/useSafeAppShell";

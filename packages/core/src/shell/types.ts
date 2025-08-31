export interface ModuleConfig {
  name: string;
  routes: string[];
  publicAPI: Record<string, unknown>;
  dependencies?: string[];
}

export interface FeatureModule {
  initialize: () => Promise<void>;
  getPublicAPI: () => Record<string, unknown>;
  destroy?: () => void;
}

export interface RouteConfig {
  path: string;
  module: string;
  component: () => Promise<React.ComponentType>;
  preload?: () => Promise<void>;
  ssr?: boolean;
  isr?: boolean | number;
}

export interface AppShellConfig {
  modules: Record<string, ModuleConfig>;
  routes: RouteConfig[];
}

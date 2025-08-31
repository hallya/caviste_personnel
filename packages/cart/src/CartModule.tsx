"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useEffect,
  useRef,
} from "react";
// Note: using local types until proper workspace resolution
interface FeatureModule {
  initialize: () => Promise<void>;
  getPublicAPI: () => Record<string, unknown>;
  destroy: () => void;
}

interface AppShellContextType {
  registerModule: (
    name: string,
    module: FeatureModule,
    config: Record<string, unknown>
  ) => void;
  getModule: (name: string) => FeatureModule | null;
  getModuleAPI: (name: string) => Record<string, unknown> | null;
  isModuleLoaded: (name: string) => boolean;
}

function useSafeAppShell(): AppShellContextType {
  return {
    registerModule: () => {},
    getModule: () => null,
    getModuleAPI: () => null,
    isModuleLoaded: () => false,
  };
}
import type { CartModuleAPI, CartModuleConfig } from "./types";
import { useCart } from "./hooks";

const CartModuleContext = createContext<CartModuleAPI | null>(null);

interface CartModuleProps {
  children: ReactNode;
  config?: Partial<CartModuleConfig>;
}

export function CartModule({ children }: CartModuleProps) {
  const cartState = useCart();
  const appShell = useSafeAppShell();
  const registeredRef = useRef(false);

  const publicAPI = useMemo<CartModuleAPI>(
    () => ({
      addToCart: cartState.addToCart,
      removeFromCart: cartState.removeFromCart,
      updateCart: cartState.updateCart,
      getCartState: cartState.getCartState,
      refetch: cartState.refetch,
    }),
    [cartState]
  );

  const featureModule: FeatureModule = useMemo(
    () => ({
      initialize: async () => {
        await cartState.refetch();
      },
      getPublicAPI: () => publicAPI as unknown as Record<string, unknown>,
      destroy: () => {},
    }),
    [cartState, publicAPI]
  );

  useEffect(() => {
    if (!registeredRef.current) {
      const moduleConfigData = {
        name: "cart",
        routes: ["/cart"],
        publicAPI: publicAPI as unknown as Record<string, unknown>,
      };

      appShell.registerModule("cart", featureModule, moduleConfigData);
      registeredRef.current = true;
    }
  }, [appShell, featureModule, publicAPI]);

  return (
    <CartModuleContext.Provider value={publicAPI}>
      {children}
    </CartModuleContext.Provider>
  );
}

export function useCartModule() {
  const context = useContext(CartModuleContext);
  if (!context) {
    throw new Error("useCartModule must be used within CartModule");
  }
  return context;
}

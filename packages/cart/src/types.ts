import type { CartDetailed } from "@pkg/domain";

export type CartActionType = "add_to_cart" | "update_quantity" | "remove_item" | "fetch_cart";

export interface CartState {
  isLoading: boolean;
  error: string | null;
  actionLoading: boolean;
  actionError: string | null;
  cart: CartDetailed | null;
}

export interface CartModuleAPI {
  addToCart: (variantId: string, quantity: number) => Promise<CartDetailed | null>;
  removeFromCart: (variantId: string) => Promise<CartDetailed | null>;
  updateCart: (variantId: string, quantity: number) => Promise<CartDetailed | null>;
  refetch: () => Promise<void>;
  getCartState: () => CartState;
}

export interface CartHook extends CartState, CartModuleAPI {
  cart: CartDetailed | null;
}

export interface CartModuleConfig {
  apiEndpoint: string;
  maxItems: number;
  persistToStorage: boolean;
}
export interface CartModuleFactoryProps {
  children: React.ReactNode;
  config?: Record<string, unknown>;
}

import type { CartDetailed } from "@pkg/domain";
import { useShopify } from "@pkg/services-shopify";

export interface CartServiceInterface {
  addToCart: (variantId: string, quantity: number) => Promise<CartDetailed | null>;
  removeFromCart: (lineId: string) => Promise<CartDetailed | null>;
  updateCart: (lineId: string, quantity: number) => Promise<CartDetailed | null>;
  fetchCart: () => Promise<CartDetailed | null>;
}

export interface CartServiceDependencies {
  query: ReturnType<typeof useShopify>["query"];
  mutate: ReturnType<typeof useShopify>["mutate"];
  getCartId: () => string | null;
  setCartId: (id: string) => void;
  removeCartId: () => void;
}

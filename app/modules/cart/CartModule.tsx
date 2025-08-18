"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useCart } from "../../components/cart/hooks/useCart";
import { useSafeAppShell } from "../../core/hooks/useSafeAppShell";
import type { CartModuleAPI, CartState, CartModuleConfig } from "./types";
import type { FeatureModule } from "../../core/shell/types";

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
      addToCart: async (
        _productId: string,
        variantId: string,
        quantity: number
      ) => {
        const result = await cartState.addToCart(variantId, quantity);
        if (!result) {
          throw new Error("Failed to add item to cart");
        }
      },
      removeFromCart: async (variantId: string) => {
        const lineItem = cartState.cart?.lines?.find(
          (line) => line.variantId === variantId
        );

        if (lineItem) {
          const result = await cartState.removeItem(lineItem.id);
          if (!result) {
            throw new Error("Failed to remove item from cart");
          }
        }
      },
      updateQuantity: async (variantId: string, quantity: number) => {
        const lineItem = cartState.cart?.lines?.find(
          (line) => line.variantId === variantId
        );

        if (lineItem) {
          const result = await cartState.updateQuantity(lineItem.id, quantity);
          if (!result) {
            throw new Error("Failed to update quantity");
          }
        }
      },
      clearCart: async () => {
        if (cartState.cart?.lines) {
          for (const line of cartState.cart.lines) {
            await cartState.removeItem(line.id);
          }
        }
      },
      getCartState: (): CartState => ({
        items:
          cartState.cart?.lines?.map((line) => ({
            id: line.id,
            variantId: line.variantId || "",
            quantity: line.quantity,
            title: line.title,
            price: line.unitPrice,
            image: line.image,
          })) || [],
        total: parseFloat(cartState.cart?.totalAmount || "0"),
        itemCount: cartState.cart?.totalQuantity || 0,
        isLoading: cartState.loading || cartState.actionLoading,
        error: cartState.error || cartState.actionError,
      }),
      getCartTotal: () => parseFloat(cartState.cart?.totalAmount || "0"),
      getItemCount: () => cartState.cart?.totalQuantity || 0,
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

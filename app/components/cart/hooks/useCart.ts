import { useState, useCallback, useEffect } from "react";

import type { Cart } from "../types";
import type { CartAddResult } from "../../../types/shopify";
import { useAnalytics } from "../../analytics/hooks/useAnalytics";
import { ANALYTICS_EVENTS } from "../../analytics/constants/analytics";
import { CART_ACTIONS } from "../constants";

interface UseCartReturn {
  cart: Cart | null;
  loading: boolean;
  error: string | null;

  addToCart: (
    variantId: string,
    quantity?: number
  ) => Promise<CartAddResult | null>;
  updateQuantity: (lineId: string, quantity: number) => Promise<Cart | null>;
  removeItem: (lineId: string) => Promise<Cart | null>;

  refetch: () => Promise<void>;
  updateCart: (newCart: Cart) => void;

  actionLoading: boolean;
  actionError: string | null;
}

export function useCart(): UseCartReturn {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const { track } = useAnalytics();

  const getCartId = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("cartId");
  };

  const fetchCart = useCallback(async () => {
    const cartId = getCartId();
    if (!cartId) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/cart?cartId=${cartId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        if (res.status === 404) {
          localStorage.removeItem("cartId");
          setCart(null);
          return;
        }
        throw new Error("Erreur de connexion");
      }

      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (variantId: string, quantity = 1) => {
    try {
      setActionLoading(true);
      setActionError(null);

      const cartId = getCartId();

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, variantId, quantity }),
      });
      const data = await res.json();

      if (!res.ok) {
        const error = new Error(data?.error || "Erreur ajout panier");
        (error as Error & { status?: number }).status = res.status;
        throw error;
      }

      if (data.cartId) {
        localStorage.setItem("cartId", data.cartId);
      }

      track({
        name: ANALYTICS_EVENTS.CART_ADD,
        properties: {
          variant_id: variantId,
          quantity,
          cart_id: data.cartId || null,
        },
      });

      window.dispatchEvent(new CustomEvent("cart-updated"));

      return data as CartAddResult;
    } catch (fetchError) {
      const error = new Error(
        fetchError instanceof Error ? fetchError.message : "Erreur de connexion"
      );
      (
        error as Error & { status?: number; isNetworkError?: boolean }
      ).isNetworkError = true;
      setActionError(error.message);

      track({
        name: ANALYTICS_EVENTS.CART_ERROR,
        properties: {
          action: CART_ACTIONS.ADD_TO_CART,
          error_message: error.message,
          variant_id: variantId,
          quantity,
        },
      });

      return null;
    } finally {
      setActionLoading(false);
    }
  };

  const updateQuantity = async (
    lineId: string,
    quantity: number
  ): Promise<Cart | null> => {
    try {
      setActionLoading(true);
      setActionError(null);

      const cartId = getCartId();
      if (!cartId) {
        throw new Error("Panier non trouvé");
      }

      const res = await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, lineId, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erreur mise à jour");
      }

      track({
        name: ANALYTICS_EVENTS.CART_UPDATE_QUANTITY,
        properties: {
          line_id: lineId,
          quantity,
          cart_id: cartId,
        },
      });

      window.dispatchEvent(new CustomEvent("cart-updated"));
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur de connexion";
      setActionError(errorMessage);

      track({
        name: ANALYTICS_EVENTS.CART_ERROR,
        properties: {
          action: CART_ACTIONS.UPDATE_QUANTITY,
          error_message: errorMessage,
          line_id: lineId,
          quantity,
        },
      });

      return null;
    } finally {
      setActionLoading(false);
    }
  };

  const removeItem = async (lineId: string): Promise<Cart | null> => {
    try {
      setActionLoading(true);
      setActionError(null);

      const cartId = getCartId();
      if (!cartId) {
        throw new Error("Panier non trouvé");
      }

      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, lineId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erreur suppression");
      }

      track({
        name: ANALYTICS_EVENTS.CART_REMOVE,
        properties: {
          line_id: lineId,
          cart_id: cartId,
        },
      });

      window.dispatchEvent(new CustomEvent("cart-updated"));
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur de connexion";
      setActionError(errorMessage);

      track({
        name: ANALYTICS_EVENTS.CART_ERROR,
        properties: {
          action: CART_ACTIONS.REMOVE_ITEM,
          error_message: errorMessage,
          line_id: lineId,
        },
      });

      return null;
    } finally {
      setActionLoading(false);
    }
  };

  const updateCart = useCallback((newCart: Cart | null) => {
    setCart(newCart);
  }, []);

  const refetch = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    actionLoading,
    actionError,
    addToCart,
    updateQuantity,
    removeItem,
    updateCart,
    refetch,
  };
}

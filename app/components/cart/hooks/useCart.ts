import { useState, useEffect } from "react";
import type { Cart } from "../types";
import type { CartAddResult } from "../../../types/shopify";

const getCartId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cartId");
};

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const cartId = getCartId();

      if (!cartId) {
        setError("Aucun panier trouvé");
        return;
      }

      const res = await fetch(
        `/api/cart?cartId=${encodeURIComponent(cartId)}`,
        {
          cache: "no-store",
        }
      );

      if (res.ok) {
        const cartData = await res.json();
        setCart(cartData);
      } else {
        setError("Erreur lors du chargement du panier");
      }
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

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
      throw error;
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
        setActionError("Aucun panier trouvé");
        return null;
      }

      const res = await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, lineId, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        setActionError(data?.error || "Erreur lors de la mise à jour");
        return null;
      }

      window.dispatchEvent(new CustomEvent("cart-updated"));

      return data as Cart;
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      setActionError("Erreur de connexion");
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
        setActionError("Aucun panier trouvé");
        return null;
      }

      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, lineId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setActionError(data?.error || "Erreur lors de la suppression");
        return null;
      }

      window.dispatchEvent(new CustomEvent("cart-updated"));

      return data as Cart;
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setActionError("Erreur de connexion");
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateCart = (newCart: Cart) => {
    setCart(newCart);
  };

  return {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    refetch: fetchCart,
    updateCart,
    actionLoading,
    actionError,
  };
}

import { useState } from "react";
import { getCartId } from "../../../lib/cart";
import type { Cart } from "../types";

interface UseCartActionsReturn {
  updateQuantity: (lineId: string, quantity: number) => Promise<Cart | null>;
  removeItem: (lineId: string) => Promise<Cart | null>;
  loading: boolean;
  error: string | null;
}

export function useCartActions(): UseCartActionsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateQuantity = async (lineId: string, quantity: number): Promise<Cart | null> => {
    try {
      setLoading(true);
      setError(null);

      const cartId = getCartId();
      if (!cartId) {
        setError("Aucun panier trouvé");
        return null;
      }

      const res = await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, lineId, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Erreur lors de la mise à jour");
        return null;
      }

      // Trigger cart-updated event after successful update
      window.dispatchEvent(new CustomEvent("cart-updated"));

      return data as Cart;
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      setError("Erreur de connexion");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (lineId: string): Promise<Cart | null> => {
    try {
      setLoading(true);
      setError(null);

      const cartId = getCartId();
      if (!cartId) {
        setError("Aucun panier trouvé");
        return null;
      }

      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, lineId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Erreur lors de la suppression");
        return null;
      }

      // Trigger cart-updated event after successful removal
      window.dispatchEvent(new CustomEvent("cart-updated"));

      return data as Cart;
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setError("Erreur de connexion");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateQuantity, removeItem, loading, error };
} 
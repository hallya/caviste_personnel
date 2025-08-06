import { useState, useEffect } from "react";
import { getCartId } from "../../../lib/cart";
import type { Cart } from "../types";

interface UseCartReturn {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateCart: (newCart: Cart) => void;
}

export function useCart(): UseCartReturn {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const cartId = getCartId();
      
      if (!cartId) {
        setError("Aucun panier trouvé");
        return;
      }

      const res = await fetch(`/api/cart?cartId=${encodeURIComponent(cartId)}`, { 
        cache: "no-store" 
      });
      
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

  useEffect(() => {
    fetchCart();
  }, []);

  const updateCart = (newCart: Cart) => {
    setCart(newCart);
  };

  return { cart, loading, error, refetch: fetchCart, updateCart };
} 
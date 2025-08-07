"use client";

import { useEffect, useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { getCartId } from "../../lib/cart";

export default function CartFloatingButton() {
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchCart() {
      const cartId = getCartId();
      
      if (!cartId) {
        setCartCount(0);
        return;
      }
      
      const res = await fetch(`/api/cart?cartId=${encodeURIComponent(cartId)}`, { cache: "no-store" });
      if (!res.ok) return;
      const cart = await res.json();
      setCartCount(cart?.totalQuantity ?? 0);
    }

    function handleStorageChange() {
      const cartId = getCartId();
      if (cartId) {
        fetchCart();
      } else {
        setCartCount(0);
      }
    }

    function handleCartUpdate() {
      fetchCart();
    }

    fetchCart();

    window.addEventListener("storage", handleStorageChange);
    
    window.addEventListener("cart-updated", handleCartUpdate);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  if (cartCount === 0) return null;

  const handleClick = () => {
    router.push("/cart");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors z-tooltip-global"
      aria-label={`Voir le panier (${cartCount} articles)`}
    >
      <ShoppingCartIcon className="h-6 w-6" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-white text-primary-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
          {cartCount}
        </span>
      )}
    </button>
  );
} 
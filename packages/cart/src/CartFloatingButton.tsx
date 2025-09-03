"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useCart } from "./hooks";

export default function CartFloatingButton() {
  const router = useRouter();
  const { cart } = useCart();

  const cartCount = cart?.totalQuantity ?? 0;

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

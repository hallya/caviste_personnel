"use client";

import { useMemo } from "react";
import { useCartContext } from "../contexts/CartContext";
import CartView from "../views/CartView";

export default function CartContainer() {
  const {
    getCartState,
    isLoading: loading,
    error,
    updateCart,
    removeFromCart,
    actionLoading,
    actionError,
  } = useCartContext();

  const cart = useMemo(() => getCartState().cart, [getCartState]);

  const handleQuantityChange = async (lineId: string, quantity: number) => {
    await updateCart(lineId, quantity);
  };

  const handleRemoveItem = async (lineId: string) => {
    await removeFromCart(lineId);
  };

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.open(cart.checkoutUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <CartView
      cart={cart}
      loading={loading}
      error={error || actionError}
      actionLoading={actionLoading}
      onQuantityChange={handleQuantityChange}
      onRemoveItem={handleRemoveItem}
      onCheckout={handleCheckout}
    />
  );
}

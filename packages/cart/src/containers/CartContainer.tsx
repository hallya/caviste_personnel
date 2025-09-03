"use client";

import { useCart } from "../hooks";
import { CartView } from "../views";

export default function CartContainer() {
  const {
    actionError,
    isActionLoading,
    updateCart,
    removeFromCart,
    cart,
  } = useCart();


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
      error={actionError}
      actionLoading={isActionLoading}
      onQuantityChange={handleQuantityChange}
      onRemoveItem={handleRemoveItem}
      onCheckout={handleCheckout}
    />
  );
}

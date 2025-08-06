"use client";

import { useCart } from '../hooks/useCart';
import { useCartActions } from '../hooks/useCartActions';
import CartView from '../views/CartView';

export default function CartContainer() {
  const { cart, loading, error, updateCart } = useCart();
  const { updateQuantity, removeItem, loading: actionLoading, error: actionError } = useCartActions();

  const handleQuantityChange = async (lineId: string, quantity: number) => {
    const updatedCart = await updateQuantity(lineId, quantity);
    if (updatedCart) {
      updateCart(updatedCart);
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    const updatedCart = await removeItem(lineId);
    if (updatedCart) {
      updateCart(updatedCart);
    }
  };

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.open(cart.checkoutUrl, '_blank', 'noopener,noreferrer');
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
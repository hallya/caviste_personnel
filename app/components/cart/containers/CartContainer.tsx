"use client";

import { useCart } from '../hooks/useCart';
import CartView from '../views/CartView';

export default function CartContainer() {
  const { 
    cart, 
    loading, 
    error, 
    updateCart, 
    refetch,
    updateQuantity,
    removeItem,
    actionLoading,
    actionError
  } = useCart();

  const handleQuantityChange = async (lineId: string, quantity: number) => {
    const updatedCart = await updateQuantity(lineId, quantity);
    if (updatedCart) {
      updateCart(updatedCart);
      await refetch();
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    const updatedCart = await removeItem(lineId);
    if (updatedCart) {
      updateCart(updatedCart);
      await refetch();
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
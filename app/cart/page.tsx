"use client";

import { useCart } from "../components/cart/hooks/useCart";
import { useCartActions } from "../components/cart/hooks/useCartActions";
import CartLoading from "../components/cart/CartLoading";
import CartEmpty from "../components/cart/CartEmpty";
import CartItem from "../components/cart/CartItem";
import CartActions from "../components/cart/CartActions";
import { calculateCartTotal } from "../components/cart/utils";

export default function CartPage() {
  const { cart, loading, error, updateCart } = useCart();
  const { updateQuantity, removeItem, loading: actionsLoading, error: actionsError } = useCartActions();

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.open(cart.checkoutUrl, '_blank', 'noopener,noreferrer');
    }
  };

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

  if (loading) return <CartLoading />;
  if (error || !cart || cart.totalQuantity === 0) return <CartEmpty error={error || actionsError} />;

  return (
    <div className="min-h-screen bg-primary-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-title text-primary-600 text-center mb-8">
          Votre panier
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            {cart.lines.map((item) => (
              <CartItem 
                key={item.id} 
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                loading={actionsLoading}
              />
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <span className="text-subtitle text-primary-600">Total:</span>
              <span className="text-title text-primary-600">{calculateCartTotal(cart.lines)}</span>
            </div>
            
            <CartActions onCheckout={handleCheckout} />
          </div>
        </div>
      </div>
    </div>
  );
} 
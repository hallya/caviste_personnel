import CartItem from '../CartItem';
import CartActions from '../CartActions';
import { calculateCartTotal } from '../utils';
import type { Cart } from '../types';

interface CartContentProps {
  cart: Cart;
  actionLoading: boolean;
  onQuantityChange: (lineId: string, quantity: number) => Promise<void>;
  onRemoveItem: (lineId: string) => Promise<void>;
  onCheckout: () => void;
}

export default function CartContent({
  cart,
  actionLoading,
  onQuantityChange,
  onRemoveItem,
  onCheckout,
}: CartContentProps) {
  const totalAmount = calculateCartTotal(cart.lines);

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
                onQuantityChange={onQuantityChange}
                onRemove={onRemoveItem}
                loading={actionLoading}
              />
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <span className="text-subtitle text-primary-600">Total:</span>
              <span className="text-title text-primary-600">{totalAmount}</span>
            </div>
            
            <CartActions onCheckout={onCheckout} />
          </div>
        </div>
      </div>
    </div>
  );
} 
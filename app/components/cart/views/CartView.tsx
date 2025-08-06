import CartLoading from './CartLoading';
import CartEmpty from './CartEmpty';
import CartContent from './CartContent';
import type { Cart } from '../types';

interface CartViewProps {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  onQuantityChange: (lineId: string, quantity: number) => Promise<void>;
  onRemoveItem: (lineId: string) => Promise<void>;
  onCheckout: () => void;
}

export default function CartView({
  cart,
  loading,
  error,
  actionLoading,
  onQuantityChange,
  onRemoveItem,
  onCheckout,
}: CartViewProps) {
  if (loading) {
    return <CartLoading />;
  }

  if (error || !cart) {
    return <CartEmpty error={error} />;
  }

  return (
    <CartContent
      cart={cart}
      actionLoading={actionLoading}
      onQuantityChange={onQuantityChange}
      onRemoveItem={onRemoveItem}
      onCheckout={onCheckout}
    />
  );
} 
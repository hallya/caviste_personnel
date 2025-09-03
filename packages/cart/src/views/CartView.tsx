import type { CartDetailed } from "@pkg/domain";
import CartLoading from "./CartLoading";
import CartEmpty from "./CartEmpty";
import CartContent from "./CartContent";

interface CartViewProps {
  cart: CartDetailed | null;
  error: string | null;
  actionLoading: boolean;
  onQuantityChange: (lineId: string, quantity: number) => Promise<void>;
  onRemoveItem: (lineId: string) => Promise<void>;
  onCheckout: () => void;
}

export default function CartView({
  cart,
  error,
  actionLoading,
  onQuantityChange,
  onRemoveItem,
  onCheckout,
}: CartViewProps) {
  if (!cart && actionLoading) {
    return <CartLoading />;
  }

  if (error || !cart || cart.totalQuantity === 0) {
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

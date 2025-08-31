import { useEffect, useRef } from "react";
import type { CartDetailed } from "@pkg/domain";
import CartItem from "../CartItem";
import CartActions from "../CartActions";
import Announcement from "../Announcement";
import { useAnnouncement } from "../hooks";
import { calculateCartTotal } from "../utils";

interface CartContentProps {
  cart: CartDetailed;
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const { announcement, announce } = useAnnouncement();
  const totalAmount = calculateCartTotal(cart.lines);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleQuantityChange = async (lineId: string, quantity: number) => {
    const item = cart.lines.find((line) => line.id === lineId);
    await onQuantityChange(lineId, quantity);
    if (item) {
      announce(`Quantité de ${item.title} mise à jour à ${quantity}`);
    }
    totalRef.current?.focus();
  };

  const handleRemoveItem = async (lineId: string) => {
    const item = cart.lines.find((line) => line.id === lineId);
    await onRemoveItem(lineId);
    if (item) {
      announce(`${item.title} supprimé du panier`);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 p-4">
      <Announcement message={announcement} />

      <div className="max-w-4xl mx-auto">
        <h1
          ref={titleRef}
          className="text-title text-primary-600 text-center mb-8"
          tabIndex={-1}
        >
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
                loading={actionLoading}
              />
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="flex justify-between items-center mb-6">
              <span className="text-subtitle text-primary-600">Total:</span>
              <span
                ref={totalRef}
                className="text-title text-primary-600"
                tabIndex={-1}
                aria-live="polite"
                aria-atomic="true"
              >
                {totalAmount}
              </span>
            </div>

            <CartActions onCheckout={onCheckout} />
          </div>
        </div>
      </div>
    </div>
  );
}

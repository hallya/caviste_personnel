import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { CartItem as CartItemType } from "./types";
import QuantitySelector from "./QuantitySelector";
import { formatPrice } from "./utils";

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  loading?: boolean;
}

export default function CartItem({ 
  item, 
  onQuantityChange, 
  onRemove, 
  loading = false 
}: CartItemProps) {
  const handleQuantityChange = (quantity: number) => {
    onQuantityChange(item.id, quantity);
  };

  return (
    <article className="flex items-stretch justify-between border-b border-neutral-200 pb-4">
      <div className="flex items-stretch space-x-2 md:space-x-4 flex-1 min-w-0">
        {item.image && (
          <div className="flex-shrink-0">
            <Image 
              src={item.image} 
              alt={`Image de ${item.title}`}
              width={80}
              height={120}
              className="w-12 md:w-20 h-full object-cover rounded"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <header className="min-w-0">
            <h2 className="text-subtitle text-primary-600 leading-tight">{item.title}</h2>
            {!item.availableForSale && (
              <p className="text-caption text-primary-700 mt-1" role="alert">
                Rupture de stock
              </p>
            )}
            {item.availableForSale && item.quantityAvailable < 10 && (
              <p className="text-caption text-primary-600 mt-1">
                Plus que {item.quantityAvailable} en stock
              </p>
            )}
          </header>
          <div className="flex items-center space-x-2 md:space-x-4 mt-2">
            <QuantitySelector
              quantity={item.quantity}
              onQuantityChange={handleQuantityChange}
              disabled={loading}
              availableForSale={item.availableForSale}
              quantityAvailable={item.quantityAvailable}
            />
            <button
              onClick={() => onRemove(item.id)}
              disabled={loading}
              className="text-primary-500 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label={`Supprimer ${item.title} du panier`}
            >
              <TrashIcon className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="text-right ml-2 md:ml-4 flex flex-col justify-center flex-shrink-0">
        <p className="text-subtitle text-primary-600 font-medium" aria-label={`Prix total pour ${item.title}: ${item.lineTotal}`}>
          {item.lineTotal}
        </p>
        <p className="text-caption text-neutral-500 mt-1">
          {formatPrice(item.price)} l&apos;unité
        </p>
      </div>
    </article>
  );
} 
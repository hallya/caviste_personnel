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
  return (
    <div className="flex items-stretch justify-between border-b border-neutral-200 pb-4">
      <div className="flex items-stretch space-x-4 flex-1">
        {item.image && (
          <div className="flex-shrink-0">
            <Image 
              src={item.image} 
              alt={item.title}
              width={80}
              height={120}
              className="w-20 h-full object-cover rounded"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-subtitle text-primary-600">{item.title}</h3>
            {!item.availableForSale && (
              <p className="text-caption text-primary-700 mt-1">Rupture de stock</p>
            )}
            {item.availableForSale && item.quantityAvailable < 10 && (
              <p className="text-caption text-primary-600 mt-1">
                Plus que {item.quantityAvailable} en stock
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <QuantitySelector
              quantity={item.quantity}
              onQuantityChange={(quantity) => onQuantityChange(item.id, quantity)}
              disabled={loading}
              availableForSale={item.availableForSale}
              quantityAvailable={item.quantityAvailable}
            />
            <button
              onClick={() => onRemove(item.id)}
              disabled={loading}
              className="text-primary-500 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Supprimer l'article"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="text-right ml-4 flex flex-col justify-center">
        <p className="text-subtitle text-primary-600">{item.lineTotal}</p>
        <p className="text-caption text-neutral-500 mt-1">
          {formatPrice(item.price)} l&apos;unité
        </p>
      </div>
    </div>
  );
} 
import { useState, useEffect } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  disabled?: boolean;
  maxQuantity?: number;
  availableForSale?: boolean;
  quantityAvailable?: number;
}

export default function QuantitySelector({ 
  quantity, 
  onQuantityChange, 
  disabled = false,
  maxQuantity = 99,
  availableForSale = true,
  quantityAvailable = 99
}: QuantitySelectorProps) {
  const [localQuantity, setLocalQuantity] = useState(quantity);

  const actualMaxQuantity = Math.min(maxQuantity, quantityAvailable);

  useEffect(() => {
    setLocalQuantity(quantity);
  }, [quantity]);

  const handleDecrease = () => {
    if (localQuantity > 1 && !disabled) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (localQuantity < actualMaxQuantity && !disabled && availableForSale) {
      const newQuantity = localQuantity + 1;
      setLocalQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= actualMaxQuantity) {
      setLocalQuantity(value);
      onQuantityChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault();
      handleDecrease();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault();
      handleIncrease();
    }
  };

  return (
    <div 
      className="flex items-center space-x-1 md:space-x-2"
      role="group"
      aria-label="Sélecteur de quantité"
      onKeyDown={handleKeyDown}
    >
      <button
        onClick={handleDecrease}
        disabled={disabled || localQuantity <= 1}
        className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-neutral-200 text-neutral-600 rounded hover:bg-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
        aria-label="Diminuer la quantité"
      >
        <MinusIcon className="w-3 h-3 md:w-4 md:h-4" />
      </button>
      
      <input
        type="number"
        min="1"
        max={actualMaxQuantity}
        value={localQuantity}
        onChange={handleInputChange}
        disabled={disabled || !availableForSale}
        className="w-10 md:w-12 h-7 md:h-8 text-center border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
        aria-label="Quantité"
        aria-describedby={!availableForSale ? "stock-unavailable" : undefined}
      />
      
      <button
        onClick={handleIncrease}
        disabled={disabled || localQuantity >= actualMaxQuantity || !availableForSale}
        className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-neutral-200 text-neutral-600 rounded hover:bg-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
        aria-label="Augmenter la quantité"
      >
        <PlusIcon className="w-3 h-3 md:w-4 md:h-4" />
      </button>
      
      {!availableForSale && (
        <span id="stock-unavailable" className="sr-only">
          Article non disponible en stock
        </span>
      )}
    </div>
  );
} 
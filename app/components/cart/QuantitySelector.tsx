import { useState } from "react";
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

  const handleDecrease = () => {
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (localQuantity < actualMaxQuantity) {
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

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleDecrease}
        disabled={disabled || localQuantity <= 1}
        className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Diminuer la quantité"
      >
        <MinusIcon className="w-4 h-4" />
      </button>
      
      <input
        type="number"
        min="1"
        max={actualMaxQuantity}
        value={localQuantity}
        onChange={handleInputChange}
        disabled={disabled || !availableForSale}
        className="w-12 h-8 text-center border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
        aria-label="Quantité"
      />
      
      <button
        onClick={handleIncrease}
        disabled={disabled || localQuantity >= actualMaxQuantity || !availableForSale}
        className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Augmenter la quantité"
      >
        <PlusIcon className="w-4 h-4" />
      </button>
    </div>
  );
} 
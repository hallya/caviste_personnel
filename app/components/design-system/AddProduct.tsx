import { iconMap, type IconName } from "./icons";

interface AddProductProps {
  name: IconName;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  quantity: number;
  className?: string;
  "aria-label"?: string;
}

export default function AddProduct({
  name,
  onClick,
  disabled = false,
  loading = false,
  quantity,
  className = "",
  "aria-label": ariaLabel,
}: AddProductProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
        isDisabled
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
      } ${className}`}
      aria-label={ariaLabel}
    >
      <IconComponent />
      <span>x{quantity}</span>
    </button>
  );
} 
import Link from "next/link";

interface CartActionsProps {
  onCheckout: () => void;
}

export default function CartActions({ onCheckout }: CartActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Link 
        href="/"
        className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-md text-center hover:bg-gray-300 transition-colors text-button"
      >
        Continuer mes achats
      </Link>
      <button 
        onClick={onCheckout}
        className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors text-button"
      >
        Finaliser ma commande
      </button>
    </div>
  );
} 
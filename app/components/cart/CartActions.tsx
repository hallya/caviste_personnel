import Link from "next/link";

interface CartActionsProps {
  onCheckout: () => void;
}

export default function CartActions({ onCheckout }: CartActionsProps) {
  const handleCheckout = () => {
    onCheckout();
  };

  return (
    <div
      className="flex flex-col sm:flex-row gap-4"
      role="group"
      aria-label="Actions du panier"
    >
      <Link
        href="/"
        className="flex-1 bg-neutral-200 text-neutral-700 px-6 py-3 rounded-md text-center hover:bg-neutral-300 transition-colors text-button focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="Continuer mes achats et retourner à la page d'accueil"
      >
        Continuer mes achats
      </Link>
      <button
        onClick={handleCheckout}
        className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors text-button focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white"
        aria-label="Finaliser ma commande et procéder au paiement"
      >
        Finaliser ma commande
      </button>
    </div>
  );
}

import Link from "next/link";

interface CartEmptyProps {
  error?: string | null;
}

export default function CartEmpty({ error }: CartEmptyProps) {
  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-title text-primary-600 mb-4">Votre panier</h1>
        <p className="text-body mb-8">
          {error || "Votre panier est vide"}
        </p>
        <Link 
          href="/"
          className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors text-button"
        >
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
} 
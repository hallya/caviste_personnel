import Link from 'next/link';

interface CartEmptyProps {
  error?: string | null;
}

export default function CartEmpty({ error }: CartEmptyProps) {
  return (
    <div className="min-h-screen bg-primary-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-title text-primary-600 text-center mb-8">
          Votre panier
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center py-12">
            {error ? (
              <div className="mb-6">
                <p className="text-body text-red-600 mb-4">{error}</p>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-title text-neutral-700 mb-2">Votre panier est vide</p>
                <p className="text-body text-neutral-600">Ajoutez des produits pour commencer vos achats</p>
              </div>
            )}
            
            <Link
              href="/"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors text-button"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
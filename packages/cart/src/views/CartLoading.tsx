export default function CartLoading() {
  return (
    <div className="min-h-screen bg-primary-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-title text-primary-600 text-center mb-8">
          Votre panier
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center py-12">
            <p className="text-body text-neutral-600">Chargement...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

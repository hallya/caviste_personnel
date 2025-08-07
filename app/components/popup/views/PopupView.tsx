import PopupHeader from "../PopupHeader";
import PopupFooter from "../PopupFooter";
import ProductCard from "../ProductCard";
import type { SimplifiedProduct } from "../../../types/shopify";

interface PopupViewProps {
  title: string;
  onClose: () => void;
  products: SimplifiedProduct[];
  loading: boolean;
  hasNext: boolean;
  onLoadMore: () => void;
}

export default function PopupView({
  title,
  onClose,
  products,
  loading,
  hasNext,
  onLoadMore,
}: PopupViewProps) {
  const gridId = "collection-products-grid";

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black/60 flex justify-center items-center z-modal animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div className="bg-primary-50 rounded-xl w-[90vw] max-w-[80vw] h-[80vh] shadow-lg animate-scaleIn relative flex flex-col">
        <PopupHeader title={title} onClose={onClose} />

        <main className="flex-1 overflow-y-auto px-8 py-4">
          <p className="sr-only" aria-live="polite">
            {loading ? "Chargement des produits…" : ""}
          </p>

          <section
            id={gridId}
            className="grid gap-4 auto-rows-fr grid-cols-[repeat(auto-fill,minmax(200px,1fr))] max-w-full"
            aria-label={`Liste des produits de ${title}`}
            aria-busy={loading ? "true" : "false"}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        </main>

        <PopupFooter 
          hasNext={hasNext} 
          loading={loading} 
          onLoadMore={onLoadMore} 
          gridId={gridId} 
        />
      </div>
    </div>
  );
} 
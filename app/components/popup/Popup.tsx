"use client";

import { useEffect } from "react";
import type { Product } from "../../api/collection-products/route";
import PopupHeader from "./PopupHeader";
import PopupFooter from "./PopupFooter";
import ProductCard from "./ProductCard";

interface PopupProps {
  title: string;
  onClose: () => void;
  products: Product[];
  loading: boolean;
  hasNext: boolean;
  onLoadMore: () => void;
}

export default function Popup({
  title,
  onClose,
  products,
  loading,
  hasNext,
  onLoadMore,
}: PopupProps) {
  // Gestion de la touche Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const gridId = "collection-products-grid";

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black/60 flex justify-center items-center z-[10000] animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div className="bg-white rounded-xl w-[90vw] h-[80vh] shadow-lg animate-scaleIn relative flex flex-col">
        <PopupHeader title={title} onClose={onClose} />

        <main className="flex-1 overflow-y-auto px-8 py-4">
          <p className="sr-only" aria-live="polite">
            {loading ? "Chargement des produits…" : ""}
          </p>

          <section
            id={gridId}
            className="grid grid-cols-1 md:grid-cols-6 gap-4"
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

"use client";

import { useState } from "react";
import type { SimplifiedProduct } from "../../types/shopify";
import Image from "next/image";
import ImagePlaceholder from "./ImagePlaceholder";
import { addToCart } from "../../lib/cart";
import { useNotification } from "../../contexts/NotificationContext";

interface ProductCardProps {
  product: SimplifiedProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { showNotification } = useNotification();
  const hasPrice = product.price ?? product.currency;
  
  const handleAddToCart = async () => {
    if (!product.variantId) return;
    
    setIsAdding(true);
    try {
      const result = await addToCart(product.variantId, 1);
      showNotification({
        type: "success",
        title: "Produit ajouté",
        message: `${product.title} ajouté au panier (${result.totalQuantity} article${result.totalQuantity > 1 ? 's' : ''})`,
        autoClose: false,
        checkoutUrl: result.checkoutUrl,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'ajout au panier";
      
      // Log l'erreur complète pour le debugging
      const errorWithStatus = error as Error & { status?: number; isNetworkError?: boolean };
      console.error("Cart error:", {
        product: product.title,
        variantId: product.variantId,
        error: error instanceof Error ? error.message : error,
        status: errorWithStatus.status || "N/A (network error)",
        isNetworkError: errorWithStatus.isNetworkError || false,
        timestamp: new Date().toISOString()
      });
      
      showNotification({
        type: "error",
        title: "Erreur d'ajout",
        message: errorMessage,
        autoClose: false,
      });
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <article
      className="bg-[#f4f1ee] rounded-md p-4 text-center flex flex-col min-h-100"
      aria-labelledby={`product-title-${product.id}`}
    >
      <figure className="relative flex-1 mb-2 min-h-0 rounded overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={`Image de ${product.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <ImagePlaceholder title={product.title} />
        )}

        {hasPrice && (
          <figcaption className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-[#7a2d2d]">
            {product.price} {product.currency}
          </figcaption>
        )}
      </figure>
      
      <header className="h-16 flex items-center justify-center mb-3">
        <h3
          id={`product-title-${product.id}`}
          className="text-sm text-[#7a2d2d] line-clamp-2 font-semibold"
        >
          {product.title}
        </h3>
      </header>
      
      {product.variantId && (
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-[#7a2d2d] text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-[#5a1d1d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? "Ajout..." : "Ajouter"}
        </button>
      )}
    </article>
  );
} 
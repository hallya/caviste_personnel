"use client";

import { useState } from "react";
import type { SimplifiedProduct } from "../../types/shopify";
import Image from "next/image";
import ImagePlaceholder from "./ImagePlaceholder";
import { useNotification } from "../../contexts/NotificationContext";
import { useCart } from "../cart/hooks/useCart";

interface ProductCardProps {
  product: SimplifiedProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { showNotification } = useNotification();
  const { cart, refetch, addToCart } = useCart();

  const cartQuantity =
    cart?.lines?.find((line) => line.variantId === product.variantId)
      ?.quantity || 0;

  const isAvailable =
    product.variantId && cartQuantity < (product.quantityAvailable || 0);

  const hasPrice = product.price ?? product.currency;

  const handleAddToCart = async () => {
    if (!isAvailable) {
      showNotification({
        type: "error",
        title: "Stock insuffisant",
        message: `Vous avez déjà ajouté le maximum disponible de ${product.title}`,
        autoClose: false,
      });
      return;
    }

    if (!product.variantId) {
      return;
    }

    setIsAdding(true);
    try {
      const result = await addToCart(product.variantId, 1);
      await refetch();
      if (result) {
        showNotification({
          type: "success",
          title: "Produit ajouté",
          message: `${product.title} ajouté au panier (${
            result.totalQuantity
          } article${result.totalQuantity > 1 ? "s" : ""})`,
          autoClose: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de l'ajout au panier";

      const errorWithStatus = error as Error & {
        status?: number;
        isNetworkError?: boolean;
      };
      console.error("Cart error:", {
        product: product.title,
        variantId: product.variantId,
        error: error instanceof Error ? error.message : error,
        status: errorWithStatus.status || "N/A (network error)",
        isNetworkError: errorWithStatus.isNetworkError || false,
        timestamp: new Date().toISOString(),
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
      className="bg-primary-50 rounded-md p-4 text-center flex flex-col min-h-100"
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
          <figcaption className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-primary-600 z-tooltip">
            {product.price} {product.currency}
          </figcaption>
        )}
      </figure>

      <header className="h-16 flex items-center justify-center mb-3">
        <h3
          id={`product-title-${product.id}`}
          className="text-sm text-primary-600 line-clamp-2 font-semibold"
        >
          {product.title}
        </h3>
      </header>

      <button
        onClick={handleAddToCart}
        disabled={isAdding || !isAvailable}
        className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          isAvailable
            ? "bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
        aria-label={
          isAvailable
            ? `Ajouter ${product.title} au panier`
            : `${product.title} n'est pas disponible`
        }
      >
        {isAdding
          ? "Ajout..."
          : isAvailable
          ? `Ajouter (${(product.quantityAvailable || 0) - cartQuantity} dispo)`
          : "Maximum atteint"}
      </button>
    </article>
  );
}

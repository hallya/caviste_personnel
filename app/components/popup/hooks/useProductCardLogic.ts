import { useState } from "react";
import type { SimplifiedProduct } from "../../../types/shopify";
import { useNotification } from "../../../contexts/NotificationContext";
import { useCartContext } from "../../../contexts/CartContext";

interface UseProductCardLogicProps {
  product: SimplifiedProduct;
}

const BOTTLE_QUANTITY = 1;
const CARTON_QUANTITY = 6;

export function useProductCardLogic({ product }: UseProductCardLogicProps) {
  const [isAddingBottle, setIsAddingBottle] = useState(false);
  const [isAddingCarton, setIsAddingCarton] = useState(false);
  const { showNotification } = useNotification();
  const { cart, addToCart } = useCartContext();

  const cartQuantity =
    cart?.lines?.find((line) => line.variantId === product.variantId)
      ?.quantity || 0;

  const availableQuantity = (product.quantityAvailable || 0) - cartQuantity;

  const canAddBottle = !!(
    product.variantId && availableQuantity >= BOTTLE_QUANTITY
  );
  const canAddCarton = !!(
    product.variantId && availableQuantity >= CARTON_QUANTITY
  );

  const handleAddToCart = async (
    quantity: number,
    mode: "bottle" | "carton"
  ) => {
    const isAdding =
      mode === "carton" ? setIsAddingCarton : setIsAddingBottle;
    const canAdd = mode === "carton" ? canAddCarton : canAddBottle;
    const modeText = mode === "carton" ? "carton" : "bouteille";

    if (!canAdd) {
      showNotification({
        type: "error",
        title: "Stock insuffisant",
        message: `Stock insuffisant pour ajouter ${quantity} ${modeText} de ${product.title}`,
        autoClose: false,
      });
      return;
    }

    if (!product.variantId) {
      return;
    }

    isAdding(true);
    try {
      const result = await addToCart(product.variantId, quantity);
      if (result) {
        const isPlural = quantity > 1;
        const addedText =
          mode === "carton"
            ? isPlural
              ? "ajoutés"
              : "ajouté"
            : isPlural
            ? "ajoutées"
            : "ajoutée";

        showNotification({
          type: "success",
          title: "Produit ajouté",
          message: `${quantity} ${
            mode === "carton" ? "carton" : "bouteille"
          } de ${product.title} ${addedText} au panier (${
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
      isAdding(false);
    }
  };

  return {
    availableQuantity,
    canAddBottle,
    canAddCarton,
    isAddingBottle,
    isAddingCarton,
    onAddBottle: () => handleAddToCart(BOTTLE_QUANTITY, "bottle"),
    onAddCarton: () => handleAddToCart(CARTON_QUANTITY, "carton"),
  };
}

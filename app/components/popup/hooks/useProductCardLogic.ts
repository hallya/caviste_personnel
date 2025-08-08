import { useState, useMemo, useCallback } from "react";
import type { SimplifiedProduct } from "../../../types/shopify";
import { useNotificationGroup } from "../../notification/hooks/useNotificationGroup";
import { useCartContext } from "../../../contexts/CartContext";

interface UseProductCardLogicProps {
  product: SimplifiedProduct;
}

const BOTTLE_QUANTITY = 1;
const CARTON_QUANTITY = 6;

export function useProductCardLogic({ product }: UseProductCardLogicProps) {
  const [isAddingBottle, setIsAddingBottle] = useState(false);
  const [isAddingCarton, setIsAddingCarton] = useState(false);
  const { showCartNotification } = useNotificationGroup();
  const { cart, addToCart } = useCartContext();

  const cartQuantity = useMemo(() => 
    cart?.lines?.find((line) => line.variantId === product.variantId)?.quantity || 0,
    [cart?.lines, product.variantId]
  );

  const availableQuantity = useMemo(() => 
    (product.quantityAvailable || 0) - cartQuantity,
    [product.quantityAvailable, cartQuantity]
  );

  const canAddBottle = useMemo(() => 
    !!(product.variantId && availableQuantity >= BOTTLE_QUANTITY),
    [product.variantId, availableQuantity]
  );

  const canAddCarton = useMemo(() => 
    !!(product.variantId && availableQuantity >= CARTON_QUANTITY),
    [product.variantId, availableQuantity]
  );

  const handleAddToCart = useCallback(async (
    quantity: number,
    mode: "bottle" | "carton"
  ) => {
    const isAdding = mode === "carton" ? setIsAddingCarton : setIsAddingBottle;
    const canAdd = mode === "carton" ? canAddCarton : canAddBottle;
    const modeText = mode === "carton" ? "carton" : "bouteille";

    if (!canAdd) {
      showCartNotification("error", "Stock insuffisant", `Stock insuffisant pour ajouter ${quantity} ${modeText} de ${product.title}`, {
        autoClose: false,
      });
      return;
    }

    if (!product.variantId) {
      return;
    }

    isAdding(true);
    
    // Create loading notification with unique ID for replacement
    const loadingId = `loading-${Date.now()}`;
    showCartNotification("loading", "En cours d'ajout...", `${quantity} ${modeText} de ${product.title}`, {
      autoClose: false,
      id: loadingId,
    });

    try {
      const result = await addToCart(product.variantId, quantity);
      if (result) {
        const isPlural = quantity > 1;
        const addedText = mode === "carton"
          ? isPlural ? "ajoutés" : "ajouté"
          : isPlural ? "ajoutées" : "ajoutée";

        // Replace loading notification with success
        showCartNotification("success", "Produit ajouté", `${quantity} ${modeText} de ${product.title} ${addedText} au panier`, {
          autoClose: true,
          replaceId: loadingId,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Erreur lors de l'ajout au panier";

      console.error("Cart error:", {
        product: product.title,
        variantId: product.variantId,
        error: error instanceof Error ? error.message : error,
        timestamp: new Date().toISOString(),
      });

      // Replace loading notification with error
      showCartNotification("error", "Erreur d'ajout", errorMessage, {
        autoClose: true,
        replaceId: loadingId,
      });
    } finally {
      isAdding(false);
    }
  }, [canAddBottle, canAddCarton, product, showCartNotification, addToCart]);

  const onAddBottle = useCallback(() => 
    handleAddToCart(BOTTLE_QUANTITY, "bottle"),
    [handleAddToCart]
  );

  const onAddCarton = useCallback(() => 
    handleAddToCart(CARTON_QUANTITY, "carton"),
    [handleAddToCart]
  );

  return {
    availableQuantity,
    canAddBottle,
    canAddCarton,
    isAddingBottle,
    isAddingCarton,
    onAddBottle,
    onAddCarton,
  };
}

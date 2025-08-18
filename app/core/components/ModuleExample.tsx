"use client";

import { useCartModule } from "../../modules/cart";
import { useNotificationModule } from "../../modules/notifications";

export function ModuleExample() {
  const cartModule = useCartModule();
  const notificationModule = useNotificationModule();

  const handleAddToCart = async () => {
    try {
      await cartModule.addToCart("product-1", "variant-1", 1);
      notificationModule.showNotification({
        type: "success",
        title: "Produit ajouté",
        message: "Le produit a été ajouté au panier",
        autoClose: true,
      });
    } catch {
      notificationModule.showNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible d'ajouter le produit",
        autoClose: true,
      });
    }
  };

  const cartState = cartModule.getCartState();

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Module Example</h3>
      <p className="mb-4">
        Cart items: {cartState.itemCount} | Total: €{cartState.total.toFixed(2)}
      </p>
      <button
        onClick={handleAddToCart}
        className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
        disabled={cartState.isLoading}
      >
        {cartState.isLoading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}

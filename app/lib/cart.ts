export async function addToCart(variantId: string, qty = 1) {
  const cartId = localStorage.getItem("shopifyCartId");
  
  try {
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId, variantId, quantity: qty }),
    });
    const data = await res.json();
    
    if (!res.ok) {
      const error = new Error(data?.error || "Erreur ajout panier");
      (error as Error & { status?: number }).status = res.status; // Add status code to error
      throw error;
    }
    
    if (data.cartId) localStorage.setItem("shopifyCartId", data.cartId);
    return data as { cartId: string; checkoutUrl: string; totalQuantity: number };
  } catch (fetchError) {
    const error = new Error(
      fetchError instanceof Error ? fetchError.message : "Erreur de connexion"
    );
    (error as Error & { status?: number; isNetworkError?: boolean }).isNetworkError = true;
    throw error;
  }
}

export function getCartId(): string | null {
  return localStorage.getItem("shopifyCartId");
}

export function clearCart(): void {
  localStorage.removeItem("shopifyCartId");
} 
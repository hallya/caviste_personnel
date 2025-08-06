import type { CartItem } from "./types";

export function calculateCartTotal(items: CartItem[]): string {
  if (items.length === 0) return "0.00 EUR";

  const total = items.reduce((sum, item) => {
    const priceMatch = item.price.match(/(\d+\.?\d*)/);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1]);
      return sum + (price * item.quantity);
    }
    return sum;
  }, 0);

  const currency = items[0].price.split(' ')[1] || 'EUR';
  return `${total.toFixed(2)} ${currency}`;
}

export function formatPrice(price: string): string {
  const priceMatch = price.match(/(\d+\.?\d*)/);
  if (priceMatch) {
    const amount = parseFloat(priceMatch[1]);
    const currency = price.split(' ')[1] || 'EUR';
    return `${amount.toFixed(2)} ${currency}`;
  }
  return price;
} 
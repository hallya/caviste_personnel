import type { CartLine } from "@pkg/domain";

export function calculateCartTotal(items: CartLine[]): string {
  if (items.length === 0) return "0.00 EUR";

  const total = items.reduce((sum, item) => {
    return sum + item.unitPrice * item.quantity;
  }, 0);

  const currency = items[0].currency || "EUR";
  return Number.isNaN(total) ? "N/A" : `${total.toFixed(2)} ${currency}`;
}

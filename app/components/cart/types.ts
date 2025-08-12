export interface CartItem {
  id: string;
  title: string;
  price: string;
  unitPrice: number;
  currency: string;
  lineTotal: string;
  quantity: number;
  image?: string;
  availableForSale: boolean;
  quantityAvailable: number;
  variantId?: string;
}

export interface Cart {
  id: string;
  totalQuantity: number;
  totalAmount: string;
  checkoutUrl: string;
  lines: CartItem[];
}

export type CartActionType = typeof import('./constants').CART_ACTIONS[keyof typeof import('./constants').CART_ACTIONS]; 
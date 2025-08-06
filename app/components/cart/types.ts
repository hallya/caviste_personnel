export interface CartItem {
  id: string;
  title: string;
  price: string;
  quantity: number;
  image?: string;
  availableForSale: boolean;
  quantityAvailable: number;
}

export interface Cart {
  id: string;
  totalQuantity: number;
  totalAmount: string;
  checkoutUrl: string;
  lines: CartItem[];
} 
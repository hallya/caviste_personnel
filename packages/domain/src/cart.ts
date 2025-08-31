export interface CartLine {
    id: string;
    variantId: string;
    title: string;
    unitPrice: number;
    currency: string;
    lineTotal: string;
    quantity: number;
    imageUrl?: string | null;
    availableForSale: boolean;
    quantityAvailable: number;
  }
  
  export interface Cart {
    id: string;
    totalQuantity: number;
    totalAmount: string;
    checkoutUrl: string;
  }
  
  export interface CartDetailed extends Cart {
    lines: CartLine[];
  }
export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  title: string;
  price: number;
  image?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface CartModuleAPI {
  addToCart: (productId: string, variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartState: () => CartState;
  getCartTotal: () => number;
  getItemCount: () => number;
}

export interface CartModuleConfig {
  apiEndpoint: string;
  maxItems: number;
  persistToStorage: boolean;
}

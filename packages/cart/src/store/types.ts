import type { CartDetailed } from "@pkg/domain";

export interface CartStoreState {
  cart: CartDetailed | null;
  
  isLoading: boolean;
  isActionLoading: boolean;
  
  error: string | null;
  actionError: string | null;
}

export interface CartStoreActions {
  setCart: (cart: CartDetailed | null) => void;
  setLoading: (loading: boolean) => void;
  setActionLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActionError: (error: string | null) => void;
  
  setCartLoading: (loading: boolean) => void;
  setCartError: (error: string | null) => void;
  setActionLoadingAndError: (loading: boolean, error: string | null) => void;
  
  clearErrors: () => void;
  clearActionError: () => void;
}

export type CartStore = CartStoreState & CartStoreActions;

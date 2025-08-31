export interface Product {
  availableForSale: boolean;
  featuredImageUrl: string | null;
  price: string | null;
  tags: string[];
  title: string;
  totalInventory: number;
  variantId: string | null;
}

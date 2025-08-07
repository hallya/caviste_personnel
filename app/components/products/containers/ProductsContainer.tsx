import ProductsView from "../views/ProductsView";
import type { SimplifiedProduct } from "../../../types/shopify";

interface ProductsContainerProps {
  products: SimplifiedProduct[];
}

export default function ProductsContainer({ products }: ProductsContainerProps) {
  return <ProductsView products={products} />;
} 
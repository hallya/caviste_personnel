import type { SimplifiedProduct } from "../../../types/shopify";
import { useProductCardLogic } from "../hooks/useProductCardLogic";
import ProductCardView from "../views/ProductCardView";

interface ProductCardContainerProps {
  product: SimplifiedProduct;
}

export default function ProductCardContainer({
  product,
}: ProductCardContainerProps) {
  const logic = useProductCardLogic({ product });

  return <ProductCardView product={product} {...logic} />;
}

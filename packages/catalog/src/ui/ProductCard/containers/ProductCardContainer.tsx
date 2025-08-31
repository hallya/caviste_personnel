import type { Product } from "@pkg/domain";
import { useProductCardLogic } from "../hooks/useProductCardLogic";
import ProductCardView from "../views/ProductCardView";

interface ProductCardContainerProps {
  product: Product;
}

export default function ProductCardContainer({
  product,
}: ProductCardContainerProps) {
  const logic = useProductCardLogic({ product });

  return <ProductCardView product={product} {...logic} />;
}

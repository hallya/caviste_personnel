"use client";

import type { SimplifiedProduct } from "../../types/shopify";
import ProductCardContainer from "./containers/ProductCardContainer";

interface ProductCardProps {
  product: SimplifiedProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  return <ProductCardContainer product={product} />;
}

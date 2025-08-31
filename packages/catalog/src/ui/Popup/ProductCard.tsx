"use client";

import type { Product } from "@pkg/domain";
import { ProductCard as ProductCardContainer } from "../ProductCard";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return <ProductCardContainer product={product} />;
}

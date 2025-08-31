import { type Product } from "@pkg/domain";
import { type ProductFragment as ProductDto } from "../../__generated__/graphql";

export function mapProductDtoToDomain(product: ProductDto): Product | null {
  if (!product) {
    return null;
  }

  return {
    title: product.title,
    featuredImageUrl: product.featuredImage?.url ?? null,
    price: product.selectedOrFirstAvailableVariant?.price?.amount
      ? `${product.selectedOrFirstAvailableVariant?.price?.amount} ${product.selectedOrFirstAvailableVariant?.price?.currencyCode}`
      : null,
    availableForSale: product.availableForSale ?? false,
    tags: product.tags.map((tag) => tag) as string[],
    totalInventory: product.totalInventory ?? 0,
    variantId: product.selectedOrFirstAvailableVariant?.id ?? null,
  };
}

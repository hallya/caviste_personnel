import { Product, type CollectionProducts } from "@pkg/domain";
import { type CollectionProductsFragment as CollectionProductsDto } from "../../__generated__/graphql";
import { mapProductDtoToDomain } from "./product.mapper";

export function mapCollectionProductsDtoToDomain(
  collection: CollectionProductsDto | null
): CollectionProducts | null {
  if (!collection) {
    return null;
  }

  return {
    id: collection.id,
    title: collection.title,
    pageInfo: {
      endCursor: collection.products.pageInfo.endCursor ?? null,
      hasNextPage: collection.products.pageInfo.hasNextPage,
    },
    products: collection.products.edges
      .map((edge) => mapProductDtoToDomain(edge.node))
      .filter((product): product is Product => product !== null),
  };
}

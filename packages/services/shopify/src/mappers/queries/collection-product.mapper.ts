import { CollectionProducts } from "@pkg/domain";
import { GetCollectionProductsQuery } from "../../__generated__/graphql";
import { mapCollectionProductsDtoToDomain } from "../fragments";

export function mapCollectionProductQueryDtoToDomain(
  data: GetCollectionProductsQuery
): CollectionProducts | null {
  return mapCollectionProductsDtoToDomain(data.collection);
}
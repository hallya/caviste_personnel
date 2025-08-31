import { type Collection } from "@pkg/domain";
import { GetCollectionsQuery } from "../../__generated__/graphql";
import { mapCollectionsDtoToDomain } from "../fragments";

export function mapGetCollectionsQueryDtoToDomain(
  data: GetCollectionsQuery
): Collection[] | null {
  if (!data.collections) {
    return null;
  }

  return mapCollectionsDtoToDomain(data.collections);
}

import { CartDetailed } from "@pkg/domain";
import { GetCartDetailedQuery } from "../../__generated__/graphql";
import { mapCartDetailedDtoToDomain } from "../fragments";

export function mapCartDetailedQueryDtoToDomain(
  data: GetCartDetailedQuery
): CartDetailed | null {
  return mapCartDetailedDtoToDomain(data.cart);
}
import { CartDetailed } from "@pkg/domain";
import { CartLinesRemoveMutation } from "../../__generated__/graphql";
import { mapCartDetailedDtoToDomain } from "../fragments";

export function mapCartLinesRemoveMutationDtoToDomain(
  data: CartLinesRemoveMutation
): CartDetailed | null {
  if (!data.cartLinesRemove?.cart) {
    return null;
  }

  return mapCartDetailedDtoToDomain(data.cartLinesRemove.cart);
}
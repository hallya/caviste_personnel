import { CartDetailed } from "@pkg/domain";
import { CartLinesUpdateMutation } from "../../__generated__/graphql";
import { mapCartDetailedDtoToDomain } from "../fragments";

export function mapCartLinesUpdateMutationDtoToDomain(
  data: CartLinesUpdateMutation
): CartDetailed | null {
  if (!data.cartLinesUpdate?.cart) {
    return null;
  }

  return mapCartDetailedDtoToDomain(data.cartLinesUpdate.cart);
}

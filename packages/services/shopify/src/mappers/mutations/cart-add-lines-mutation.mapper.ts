import { CartDetailed } from "@pkg/domain";
import { CartLinesAddMutation } from "../../__generated__/graphql";
import { mapCartDetailedDtoToDomain } from "../fragments";

export function mapCartAddLinesMutationDtoToDomain(
  data: CartLinesAddMutation
): CartDetailed | null {
  if (!data.cartLinesAdd?.cart) {
    return null;
  }

  return mapCartDetailedDtoToDomain(data.cartLinesAdd.cart);
}

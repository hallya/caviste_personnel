import { CartDetailed } from "@pkg/domain";
import { CartCreateMutation } from "../../__generated__/graphql";
import { mapCartDetailedDtoToDomain } from "../fragments";

export function mapCartCreateMutationDtoToDomain(
  data: CartCreateMutation
): CartDetailed | null {
  if (!data.cartCreate?.cart) {
    return null;
  }

  return mapCartDetailedDtoToDomain(data.cartCreate.cart);
}
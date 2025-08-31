import { type CartDetailed } from "@pkg/domain";
import { type CartDetailedFragment as CartDetailedDto } from "../../__generated__/graphql";
import { mapCartDtoToDomain, mapCartLinesDtoToDomain } from "./";

export function mapCartDetailedDtoToDomain(
  cartDetailed: CartDetailedDto
): CartDetailed;
export function mapCartDetailedDtoToDomain(cartDetailed: null): null;
export function mapCartDetailedDtoToDomain(
  cartDetailed: CartDetailedDto | null
): CartDetailed | null;
export function mapCartDetailedDtoToDomain(
  cartDetailed: CartDetailedDto | null
): CartDetailed | null {
  if (!cartDetailed) {
    return null;
  }

  return {
    ...mapCartDtoToDomain(cartDetailed),
    lines: mapCartLinesDtoToDomain(cartDetailed.lines) ?? [],
  };
}

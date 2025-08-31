import { Cart } from "@pkg/domain";
import { GetCartQuery } from "../../__generated__/graphql";
import { mapCartDtoToDomain } from "../fragments";

export function mapCartQueryDtoToDomain(data: GetCartQuery): Cart | null {
  return mapCartDtoToDomain(data.cart);
}
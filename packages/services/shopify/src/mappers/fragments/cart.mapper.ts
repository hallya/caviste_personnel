import { type Cart } from "@pkg/domain";
import { type CartFragment as CartDto } from "../../__generated__/graphql";


export function mapCartDtoToDomain(cart: CartDto): Cart;
export function mapCartDtoToDomain(cart: null): null;
export function mapCartDtoToDomain(cart: CartDto | null): Cart | null;

export function mapCartDtoToDomain(cart: CartDto | null): Cart | null {
  if (!cart) {
    return null;
  }

  return {
    id: cart.id,
    totalQuantity: cart.totalQuantity,
    totalAmount: cart.cost.totalAmount.amount,
    checkoutUrl: cart.checkoutUrl,
  };
}

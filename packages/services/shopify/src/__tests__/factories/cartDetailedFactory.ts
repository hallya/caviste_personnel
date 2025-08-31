import { faker } from "@faker-js/faker";
import { CartDetailed, CartLine } from "@pkg/domain";
import { cartLinesFactory } from "./cartLinesFactory";

type CartDetailedFactoryParams = {
  cartDetailed?: Partial<CartDetailed>;
  overrideCartLines?: Partial<CartLine>[];
};

export function cartDetailedFactory(
  params?: CartDetailedFactoryParams
): CartDetailed {
  return {
    id: faker.string.uuid(),
    totalQuantity: faker.number.int({ min: 1, max: 10 }),
    totalAmount: faker.commerce.price({
      min: 1,
      max: 100,
      dec: 2,
      symbol: "EUR",
    }),
    checkoutUrl: faker.internet.url(),
    lines:
      params?.cartDetailed?.lines ??
      cartLinesFactory({ overrideCartLines: params?.overrideCartLines }),
    ...params?.cartDetailed,
  };
}

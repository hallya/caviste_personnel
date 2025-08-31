import { CartLine } from "@pkg/domain";
import { faker } from "@faker-js/faker";

export type CartLinesFactoryParams = {
  overrideCartLines?: Partial<CartLine>[];
  length?: number;
};

export function cartLinesFactory(params?: CartLinesFactoryParams): CartLine[] {
  return Array.from(
    {
      length:
        params?.overrideCartLines?.length ??
        params?.length ??
        faker.number.int({ min: 1, max: 10 }),
    },
    (_, i) => ({
      id: faker.string.uuid(),
      variantId: faker.string.uuid(),
      quantity: faker.number.int({ min: 1, max: 10 }),
      title: faker.commerce.productName(),
      unitPrice: faker.number.int({ min: 1, max: 100 }),
      currency: "EUR",
      lineTotal: faker.commerce.price({
        min: 1,
        max: 100,
        dec: 2,
        symbol: "EUR",
      }),
      imageUrl: faker.image.url(),
      availableForSale: true,
      quantityAvailable: faker.number.int({ min: 1, max: 10 }),
      ...params?.overrideCartLines?.[i],
    })
  );
}

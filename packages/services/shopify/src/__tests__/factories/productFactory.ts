import { faker } from "@faker-js/faker";
import { type Product } from "@pkg/domain";

export type ProductFactoryParams = {
  overrideProduct?: Partial<Product>;
};

export function productFactory(params: ProductFactoryParams = {}): Product {
  return {
    availableForSale: faker.datatype.boolean(),
    featuredImageUrl: faker.helpers.arrayElement([faker.image.url(), null]),
    price: faker.commerce.price({ symbol: "EUR", min: 5, max: 100, dec: 2 }),
    tags: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
      faker.commerce.productAdjective()
    ),
    title: faker.commerce.productName(),
    totalInventory: faker.number.int({ min: 0, max: 100 }),
    variantId: faker.string.uuid(),
    ...params.overrideProduct,
  };
}

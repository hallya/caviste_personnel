import { faker } from "@faker-js/faker";
import { CurrencyCode, ProductFragment } from "../../__generated__/graphql";

export const productDtoFactory = (
  params: Partial<ProductFragment> = {}
): ProductFragment => ({
  __typename: "Product",
  availableForSale: faker.datatype.boolean(),
  featuredImage: {
    __typename: "Image",
    url: faker.image.url(),
  },
  selectedOrFirstAvailableVariant: {
    __typename: "ProductVariant",
    id: faker.string.uuid(),
    price: {
      __typename: "MoneyV2",
      amount: faker.number.int({ min: 0, max: 100 }),
      currencyCode: CurrencyCode.Eur,
    },
  },
  tags: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
    faker.commerce.productAdjective()
  ),
  title: faker.commerce.productName(),
  totalInventory: faker.number.int({ min: 0, max: 100 }),
  id: faker.string.uuid(),
  ...params,
});

import { faker } from "@faker-js/faker";
import { productDtoFactory } from "./productDtoFactory";
import { CollectionProductsFragment, ProductFragment } from "../../__generated__/graphql";

type CollectionProductsDtoFactoryParams = Partial<
  Omit<
    CollectionProductsFragment,
    "__typename"
  >
> & {
  pageInfo?: Partial<CollectionProductsFragment["products"]["pageInfo"]>;
  product?: Partial<ProductFragment>;
};

export function collectionProductsDtoFactory(
  params: CollectionProductsDtoFactoryParams = { product: {}, pageInfo: {} }
): CollectionProductsFragment {
  const { product, pageInfo, ...rest } = params;
  return {
    __typename: "Collection",
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    ...rest,
    products: {
      __typename: "ProductConnection",
      pageInfo: {
        __typename: "PageInfo",
        hasNextPage: false,
        endCursor: null,
        ...pageInfo,
      },
      edges: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, (_, index) => ({
        __typename: "ProductEdge",
        cursor: `cursor_${index}`,
        node: productDtoFactory(product),
      })),
    },
  };
}

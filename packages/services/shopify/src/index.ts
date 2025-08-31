export {
  // Contextual client
  createShopifyAPI,
  createShopifyPage,
  createShopifyHook,
  shopifyAPI,
  shopifyClient,
  shopifyPage,
  useShopify,

  // Direct client (for special cases)
  createShopifyClient
} from "./client";

export type {
  ShopifyAPIAdapter,
  ShopifyPageAdapter,
  ShopifyHookAdapter,
} from "./client/types";

export type {
  GraphQLError,
  GraphQLNetworkError,
  GraphQLErrorResponse,
} from "./core";

export { COLLECTION_PRODUCTS_SORT_KEY } from "./constants";

export * from "./mappers";

export {
  GetCartDocument,
  GetCartDetailedDocument,
  GetCollectionsDocument,
  GetCollectionProductsDocument,
  CartCreateDocument,
  CartLinesAddDocument,
  CartLinesRemoveDocument,
  CartLinesUpdateDocument,
  ProductCollectionSortKeys,
} from "./__generated__/graphql";

export type {
  GetCartQuery,
  GetCartDetailedQuery,
  GetCollectionsQuery,
  GetCollectionProductsQuery,
  CartCreateMutation,
  CartLinesAddMutation,
  CartLinesUpdateMutation,
  CartLinesRemoveMutation,
} from "./__generated__/graphql";

export * as __testHelpers__ from "./__tests__";

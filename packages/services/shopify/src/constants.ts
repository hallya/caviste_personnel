import { CurrencyCode, ProductCollectionSortKeys } from "./__generated__/graphql";

export const PRODUCT_COLLECTION_SORT_KEYS = ProductCollectionSortKeys;

export const DEFAULT_CURRENCY_CODE = CurrencyCode.Eur;

export const DEFAULT_AMOUNT = 0;

export const DEFAULT_IMAGE_URL = null;

export const DEFAULT_PRODUCT_QUANTITY_AVAILABLE = 0;

export const COLLECTION_PRODUCTS_SORT_KEY: Record<string, ProductCollectionSortKeys> = {
  DEFAULT: ProductCollectionSortKeys.CollectionDefault,
  TITLE: ProductCollectionSortKeys.Title,
  PRICE: ProductCollectionSortKeys.Price,
  CREATED_AT: ProductCollectionSortKeys.Created,
  RELEVANCE: ProductCollectionSortKeys.Relevance,
  BEST_SELLING: ProductCollectionSortKeys.BestSelling,
};
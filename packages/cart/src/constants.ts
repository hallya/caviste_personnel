export const CART_CONSTANTS = {
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 99,
  CART_ID_KEY: "shopifyCartId",
} as const;

export const CART_ACTIONS: Record<Uppercase<string>, string> = {
  FETCH_CART: "fetch_cart",
  ADD_TO_CART: "add_to_cart",
  UPDATE_QUANTITY: "update_quantity",
  REMOVE_ITEM: "remove_item",
} as const;

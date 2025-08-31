export const ANALYTICS_EVENTS = {
  CART_ADD: "CART_ADD",
  CART_REMOVE: "CART_REMOVE",
  CART_UPDATE_QUANTITY: "CART_UPDATE_QUANTITY",
  CART_ERROR: "CART_ERROR",
};

export function useAnalytics() {
  return {
    track: jest.fn(),
  };
}

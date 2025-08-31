import type { AnalyticsEventName } from "./types";

export const ANALYTICS_EVENTS: AnalyticsEventName = {
  CART_ADD: "cart_add",
  CART_REMOVE: "cart_remove",
  CART_UPDATE_QUANTITY: "cart_update_quantity",
  CART_ERROR: "cart_error",
  CHECKOUT_STARTED: "checkout_started",
  PRODUCT_VIEW: "product_view",
  FILTER_APPLIED: "filter_applied",
  FILTER_CLEARED: "filter_cleared",
  SEARCH_PERFORMED: "search_performed",
  ERROR_OCCURRED: "error_occurred",
};

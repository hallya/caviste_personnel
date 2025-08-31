export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean | null>;
}

export type AnalyticsEventName = {
  readonly CART_ADD: "cart_add";
  readonly CART_REMOVE: "cart_remove";
  readonly CART_UPDATE_QUANTITY: "cart_update_quantity";
  readonly CART_ERROR: "cart_error";
  readonly CHECKOUT_STARTED: "checkout_started";
  readonly PRODUCT_VIEW: "product_view";
  readonly FILTER_APPLIED: "filter_applied";
  readonly FILTER_CLEARED: "filter_cleared";
  readonly SEARCH_PERFORMED: "search_performed";
  readonly ERROR_OCCURRED: "error_occurred";
};
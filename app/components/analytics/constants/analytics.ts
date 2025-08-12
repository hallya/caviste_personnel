export const ANALYTICS_EVENTS = {
  CART_ADD: 'cart_add',
  CART_REMOVE: 'cart_remove',
  CART_UPDATE_QUANTITY: 'cart_update_quantity',
  CART_ERROR: 'cart_error',
  CHECKOUT_STARTED: 'checkout_started',

  PRODUCT_VIEW: 'product_view',

  FILTER_APPLIED: 'filter_applied',
  FILTER_CLEARED: 'filter_cleared',
  SEARCH_PERFORMED: 'search_performed',

  ERROR_OCCURRED: 'error_occurred',
} as const;

export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

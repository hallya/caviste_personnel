export const NOTIFICATION_DEFAULTS = {
  ANIMATION_DURATION: 300,
  AUTO_CLOSE_DELAY: 5000,
} as const;

export const NOTIFICATION_GROUPS = {
  CART: "cart",
} as const;

export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error", 
  LOADING: "loading",
} as const;

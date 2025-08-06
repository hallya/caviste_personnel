export const NOTIFICATION_POSITIONS = {
  TOP_RIGHT: "top-right",
  TOP_LEFT: "top-left",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_LEFT: "bottom-left",
  TOP_CENTER: "top-center",
  BOTTOM_CENTER: "bottom-center",
} as const;

export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
} as const;

export const NOTIFICATION_DEFAULTS = {
  AUTO_CLOSE_DELAY: 5000,
  ANIMATION_DURATION: 300,
  Z_INDEX: 10001,
} as const; 
import { NotificationType } from "./types";

export const NOTIFICATION_TYPES: Record<Uppercase<NotificationType>, NotificationType> = {
  SUCCESS: "success",
  ERROR: "error",
  LOADING: "loading",
};
  
export const MAX_GROUP_NOTIFICATIONS = 7;

export const NOTIFICATION_DEFAULTS = {
  ANIMATION_DURATION: 300,
  AUTO_CLOSE_DELAY: 5000,
} as const;

export const NOTIFICATION_GROUPS = {
  CART: "cart",
} as const;

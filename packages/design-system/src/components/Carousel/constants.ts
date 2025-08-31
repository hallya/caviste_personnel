export const CAROUSEL_CONFIG = {
  MOBILE_BREAKPOINT: 600,
  WHEEL_DEBOUNCE: 150,
  SWIPE_THRESHOLD: 60,
  SWIPE_VELOCITY_THRESHOLD: 0.3,
  TRANSITION_DURATION: {
    MOBILE: 400,
    DESKTOP: 250,
  },
} as const;

export const VIDEO_CONFIG = {
  MAX_PLAY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000, // 1 second delay between play attempts
} as const;

export const CAROUSEL_LAYOUT = {
  MAX_WIDTH_PX: 1000, // Maximum width for carousel container
  PADDING_PX: 40, // Padding for mobile viewport calculation
} as const;

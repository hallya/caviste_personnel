/**
 * Z-Index System - Centralized scale to avoid conflicts
 * 
 * Best practices:
 * - Use intervals of 100 to leave space for future additions
 * - Document each level
 * - Avoid arbitrary values
 * 
 * Note: These values are also defined in tailwind.config.ts
 * for use with Tailwind classes like z-modal, z-notification, etc.
 */

export const Z_INDEX = {
  // Base layer (0-99)
  BASE: 0,
  
  // Content layers (100-999)
  CONTENT: 100,
  CARD: 200,
  TOOLTIP: 300,
  
  // Navigation layers (1000-1999)
  NAVIGATION: 1000,
  DROPDOWN: 1100,
  STICKY_HEADER: 1200,
  STICKY_FOOTER: 1300,
  
  // Overlay layers (2000-2999)
  OVERLAY: 2000,
  BACKDROP: 2100,
  
  // Modal layers (3000-3999)
  MODAL: 3000,
  MODAL_HEADER: 3100,
  MODAL_FOOTER: 3200,
  MODAL_CONTENT: 3300,
  
  // Notification layers (4000-4999)
  NOTIFICATION: 4000,
  TOAST: 4100,
  
  // Top priority layers (5000+)
  TOOLTIP_GLOBAL: 5000,
  LOADING_OVERLAY: 6000,
  DEBUG: 9999,
} as const;

/**
 * Recommended usage:
 * 
 * 1. Normal content: Z_INDEX.CONTENT
 * 2. Cards/floating elements: Z_INDEX.CARD
 * 3. Local tooltips: Z_INDEX.TOOLTIP
 * 4. Navigation: Z_INDEX.NAVIGATION
 * 5. Sticky headers/footers: Z_INDEX.STICKY_HEADER/STICKY_FOOTER
 * 6. Overlays: Z_INDEX.OVERLAY
 * 7. Modals: Z_INDEX.MODAL
 * 8. Notifications: Z_INDEX.NOTIFICATION
 * 9. Critical elements: Z_INDEX.LOADING_OVERLAY
 */

export type ZIndexKey = keyof typeof Z_INDEX; 
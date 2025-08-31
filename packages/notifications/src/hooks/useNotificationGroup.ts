import { useCallback, useState, useEffect } from "react";
import { useNotification } from "../context/NotificationContext";
import { NOTIFICATION_GROUPS } from "../constants";
import type { NotificationOptions, NotificationData, NotificationType } from "../types";

export function useNotificationGroup() {
  const { showNotification } = useNotification();

  const showGroupedNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      groupId: string,
      options?: NotificationOptions
    ) => {
      showNotification({
        type,
        title,
        message,
        groupId,
        autoClose: options?.autoClose,
        autoCloseDelay: options?.autoCloseDelay,
        ...(options?.id && { id: options.id }),
        ...(options?.replaceId && { replaceId: options.replaceId }),
      });
    },
    [showNotification]
  );

  const showCartNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      options?: NotificationOptions
    ) => {
      showNotification({
        type,
        title,
        message,
        groupId: NOTIFICATION_GROUPS.CART,
        autoClose: options?.autoClose,
        autoCloseDelay: options?.autoCloseDelay,
        ...(options?.id && { id: options.id }),
        ...(options?.replaceId && { replaceId: options.replaceId }),
      });
    },
    [showNotification]
  );

  return {
    showGroupedNotification,
    showCartNotification,
  };
}

export function useNotificationGroupLogic(
  notifications: NotificationData[],
  onCloseGroup: () => void,
  onCloseNotification: (id: string) => void,
  isVisible: boolean
) {
  const ANIMATION_DURATION = 250; // Duration of expand animation in milliseconds
  const MAX_STACKED_NOTIFICATIONS = 5; // Maximum number of notifications to show in stack
  const NOTIFICATION_HEIGHT = 80; // Height of each notification in pixels
  const VERTICAL_SPACING = 88; // Vertical spacing between expanded notifications
  const Z_INDEX_BASE = 10; // Base z-index for layering
  const BLUR_BASE = 0.6; // Base blur value for depth effect
  const OPACITY_MIN = 0.2; // Minimum opacity for distant notifications
  const OPACITY_DECREASE = 0.25; // Opacity decrease per notification level

  const NO_BLUR = "blur(0px)";
  const FULL_OPACITY = 1;
  const FULL_OPAQUE_BACKGROUND = "rgba(255, 255, 255, 1)";
  const STRONG_SHADOW = "0 4px 12px rgba(0, 0, 0, 0.15)";
  const NO_TRANSFORM = "translateZ(0px) translateY(0px)";

  const baseStyles = {
    width: "100%",
    minWidth: "100%",
    height: `${NOTIFICATION_HEIGHT}px`,
  };

  const firstNotificationStyles = {
    transform: NO_TRANSFORM,
    opacity: FULL_OPACITY,
    zIndex: Z_INDEX_BASE,
    filter: NO_BLUR,
    boxShadow: STRONG_SHADOW,
    backgroundColor: FULL_OPAQUE_BACKGROUND,
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const visibleNotifications = notifications.slice(
    0,
    MAX_STACKED_NOTIFICATIONS
  );

  const handleToggle = useCallback(() => {
    if (notifications.length < 2 || isAnimating || isExpanded) return;

    setIsAnimating(true);
    setIsExpanded(true);

    setTimeout(() => {
      setIsAnimating(false);
    }, ANIMATION_DURATION);
  }, [notifications.length, isAnimating, isExpanded]);

  const handleClose = useCallback(() => {
    onCloseGroup();
  }, [onCloseGroup]);

  const handleCloseNotification = useCallback(
    (id: string) => {
      onCloseNotification(id);

      if (notifications.length === 1) {
        onCloseGroup();
      }
    },
    [onCloseNotification, onCloseGroup, notifications.length]
  );

  useEffect(() => {
    if (!isVisible) {
      setIsExpanded(false);
      setIsAnimating(false);
    }
  }, [isVisible]);

  const getStackedStyle = (index: number) => {
    if (index === 0) {
      // First notification: fully visible, no offset, highest priority
      return { ...baseStyles, ...firstNotificationStyles };
    } else if (index === 1) {
      // Second notification: slight offset, reduced opacity, behind first
      const secondNotificationStyles = {
        transform: "translateZ(-2px) translateY(4px)", // 2px back in 3D, 4px down
        opacity: 0.9, // Slightly transparent
        zIndex: Z_INDEX_BASE - 1, // Behind first notification
        filter: "blur(0.3px)", // Slight blur for depth effect
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Medium shadow
        backgroundColor: "rgba(255, 255, 255, 0.95)", // Slightly transparent background
      };

      return { ...baseStyles, ...secondNotificationStyles };
    } else if (index === 2) {
      // Third notification: more offset, more transparency, further back
      const thirdNotificationStyles = {
        transform: "translateZ(-4px) translateY(8px)",
        opacity: 0.75,
        zIndex: Z_INDEX_BASE - 2,
        filter: `blur(${BLUR_BASE}px)`,
        boxShadow: "0 1px 6px rgba(0, 0, 0, 0.08)",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
      };

      return { ...baseStyles, ...thirdNotificationStyles };
    } else {
      // Subsequent notifications: progressive offset with diminishing visibility
      const offset = Math.min(index - 2, 3); // Limit offset to prevent excessive stacking
      const progressiveOffsetStyles = {
        transform: `translateZ(${-4 - offset * 2}px) translateY(${
          8 + offset * 2
        }px)`, // Progressive 3D and vertical offset
        opacity: Math.max(OPACITY_MIN, 0.75 - (index - 2) * OPACITY_DECREASE), // Gradually fade out, minimum 20% opacity
        zIndex: Z_INDEX_BASE - index, // Decreasing z-index for each layer
        filter: `blur(${BLUR_BASE + offset * 0.3}px)`, // Progressive blur increase
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)", // Minimal shadow for distant layers
        backgroundColor: "rgba(255, 255, 255, 0.85)", // More transparent background
      };

      return { ...baseStyles, ...progressiveOffsetStyles };
    }
  };

  const getExpandedStyle = (index: number) => {
    if (index === 0) {
      return { ...baseStyles, ...firstNotificationStyles };
    } else {
      // Subsequent notifications: slide down with 3D depth effect
      const expandedNotificationStyles = {
        transform: `translateZ(${-2 - (index - 1) * 2}px) translateY(${
          index * VERTICAL_SPACING
        }px)`, // Progressive 3D depth and vertical spacing
        opacity: FULL_OPACITY,
        zIndex: Z_INDEX_BASE - index, // Decreasing z-index for proper layering
        filter: NO_BLUR,
        boxShadow: STRONG_SHADOW,
        backgroundColor: FULL_OPAQUE_BACKGROUND,
      };

      return { ...baseStyles, ...expandedNotificationStyles };
    }
  };

  return {
    isExpanded,
    visibleNotifications,
    handleToggle,
    handleClose,
    handleCloseNotification,
    getStackedStyle,
    getExpandedStyle,
  };
}

"use client";

import React from "react";
import { NotificationData } from "../types";
import NotificationContent from "./NotificationContent";
import { CloseIcon } from "@pkg/design-system";

interface NotificationGroupViewProps {
  notifications: NotificationData[];
  isExpanded: boolean;
  onToggle: () => void;
  onClose: () => void;
  onCloseNotification: (id: string) => void;
  getStackedStyle: (index: number) => React.CSSProperties;
  getExpandedStyle: (index: number) => React.CSSProperties;
}

export default function NotificationGroupView({
  notifications,
  isExpanded,
  onToggle,
  onClose,
  onCloseNotification,
  getStackedStyle,
  getExpandedStyle,
}: NotificationGroupViewProps) {
  const notificationCount = notifications.length;
  const isPlural = notificationCount > 1;
  const ariaLabel = `Groupe de ${notificationCount} notification${
    isPlural ? "s" : ""
  }`;

  const containerHeight = isExpanded ? "h-auto" : "h-32";
  const minHeight = isExpanded ? `${notificationCount * 88 + 32}px` : "128px";

  return (
    <div
      className="relative transform transition-all duration-300 translate-x-0 opacity-100 w-full"
      role="region"
      aria-label={ariaLabel}
      style={{ perspective: "1000px" }}
    >
      <div
        className={`relative transition-all duration-200 ease-out ${containerHeight} transform-gpu w-full`}
        style={{
          minHeight,
        }}
      >
        {notifications.map((notification, index) => {
          const isFirstNotification = index === 0;
          const canToggle =
            isFirstNotification && !isExpanded && notificationCount >= 2;
          const isClickable = canToggle;
          const cursorClass = isClickable ? "cursor-pointer" : "";

          const notificationStyle = isExpanded
            ? getExpandedStyle(index)
            : getStackedStyle(index);
          const transitionDelay = isExpanded ? `${index * 25}ms` : "0ms";

          const ariaLive = isFirstNotification ? "polite" : "off";
          const notificationAriaLabel = `${notification.title}: ${notification.message}`;

          const showGroupCloseButton = !isExpanded && isFirstNotification;
          const showIndividualCloseButton = isExpanded;

          const groupCloseAriaLabel = `Fermer le groupe de ${notificationCount} notification${
            isPlural ? "s" : ""
          }`;
          const individualCloseAriaLabel = `Fermer la notification: ${notification.title}`;

          return (
            <div
              key={notification.id}
              className={`absolute inset-0 rounded-lg border-l-4 border-primary-600 p-4 transition-all duration-200 ease-out ${cursorClass} transform-gpu w-full min-w-full`}
              style={{
                ...notificationStyle,
                transitionDelay,
              }}
              onClick={isClickable ? onToggle : undefined}
              role="alert"
              aria-live={ariaLive}
              aria-label={notificationAriaLabel}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center flex-1 min-w-0">
                  <NotificationContent notification={notification} />
                </div>

                {showGroupCloseButton && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors ml-2"
                    aria-label={groupCloseAriaLabel}
                  >
                    <CloseIcon />
                  </button>
                )}

                {showIndividualCloseButton && (
                  <button
                    onClick={() => onCloseNotification(notification.id)}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors"
                    aria-label={individualCloseAriaLabel}
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

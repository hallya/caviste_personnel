"use client";

import React from 'react';
import { NotificationData } from './types';
import NotificationContent from './NotificationContent';
import { CloseIcon } from '../design-system/icons';

interface IndividualNotificationProps {
  notification: NotificationData;
  onClose: (id: string) => void;
}

export default function IndividualNotification({
  notification,
  onClose,
}: IndividualNotificationProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-lg border-l-4 border-primary-600 p-4 transform transition-all duration-200 ease-out"
      role="alert"
      aria-live="polite"
      aria-label={`${notification.title}: ${notification.message}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center flex-1 min-w-0">
          <NotificationContent notification={notification} />
        </div>
        <button
          onClick={() => onClose(notification.id)}
          className="text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label={`Fermer la notification: ${notification.title}`}
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
} 
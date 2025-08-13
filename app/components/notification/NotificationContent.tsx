import React from 'react';
import { NotificationData } from './types';
import { NotificationIcon } from '../design-system/icons';

interface NotificationContentProps {
  notification: NotificationData;
}

export default function NotificationContent({ notification }: NotificationContentProps) {
  return (
    <div className="flex items-center flex-1 min-w-0" data-testid="notification-content">
      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-primary-600/10">
        <NotificationIcon type={notification.type} className="text-primary-600" />
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <p className="text-button text-heading truncate">{notification.title}</p>
        <p className="text-sm text-body truncate">{notification.message}</p>
      </div>
    </div>
  );
} 
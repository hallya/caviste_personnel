import React from 'react';
import { NotificationData } from '../types';
import { useNotificationGroupLogic } from '../hooks/useNotificationGroup';
import NotificationGroupView from '../views/NotificationGroupView';

interface NotificationGroupContainerProps {
  notifications: NotificationData[];
  onCloseGroup: () => void;
  onCloseNotification: (id: string) => void;
  isVisible: boolean;
}

export default function NotificationGroupContainer({
  notifications,
  onCloseGroup,
  onCloseNotification,
  isVisible,
}: NotificationGroupContainerProps) {
  const {
    isExpanded,
    visibleNotifications,
    handleToggle,
    handleClose,
    handleCloseNotification,
    getStackedStyle,
    getExpandedStyle,
  } = useNotificationGroupLogic(notifications, onCloseGroup, onCloseNotification, isVisible);

  return (
    <NotificationGroupView
      notifications={visibleNotifications}
      isExpanded={isExpanded}
      onToggle={handleToggle}
      onClose={handleClose}
      onCloseNotification={handleCloseNotification}
      getStackedStyle={getStackedStyle}
      getExpandedStyle={getExpandedStyle}
    />
  );
} 
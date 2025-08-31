import { NotificationData } from '../types';
import { useNotificationGroupLogic } from '../hooks';
import { NotificationGroupView } from '../views';

interface NotificationGroupProps {
  notifications: NotificationData[];
  onCloseGroup: () => void;
  onCloseNotification: (id: string) => void;
  isVisible: boolean;
}

export default function NotificationGroup({
  notifications,
  onCloseGroup,
  onCloseNotification,
  isVisible,
}: NotificationGroupProps) {
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
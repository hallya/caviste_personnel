import { useNotification } from "../context/NotificationContext";

let globalNotificationContext: ReturnType<typeof useNotification> | null = null;
void globalNotificationContext;

export function setNotificationContext(
  context: ReturnType<typeof useNotification>
) {
  globalNotificationContext = context;
}

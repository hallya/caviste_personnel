"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import CartNotification from "../components/notification/CartNotification";

import type { NotificationData, NotificationContextType } from "../components/notification/types";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const showNotification = useCallback((notification: Omit<NotificationData, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notifications.map((notification) => (
        <CartNotification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => hideNotification(notification.id)}
          autoClose={notification.autoClose}
          autoCloseDelay={notification.autoCloseDelay}
          checkoutUrl={notification.checkoutUrl}
        />
      ))}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
} 
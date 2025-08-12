"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";

import type { NotificationData, NotificationContextType, NotificationGroup as NotificationGroupType } from "../components/notification/types";
import { LoadingIcon } from "../components/design-system/icons";

const LoadingNotification = () => (
  <div className="bg-white rounded-lg shadow-lg border-l-4 border-primary-600 p-4 transform transition-all duration-200 ease-out w-[calc(100vw-20px)] md:w-90">
    <div className="flex items-start justify-between">
      <div className="flex items-center flex-1 min-w-0">
        <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-primary-600/10">
          <LoadingIcon className="w-3 h-3 text-primary-600" />
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <p className="text-button text-heading truncate">
            En cours d&apos;ajout...
          </p>
          <p className="text-sm text-body truncate">
            Veuillez patienter
          </p>
        </div>
      </div>
    </div>
  </div>
);

const NotificationGroup = dynamic(() => import("../components/notification/containers/NotificationGroupContainer"), {
  ssr: false,
  loading: LoadingNotification
});

const IndividualNotification = dynamic(() => import("../components/notification/IndividualNotification"), {
  ssr: false,
  loading: LoadingNotification
});

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const MAX_GROUP_NOTIFICATIONS = 7;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const showNotification = useCallback((notification: Omit<NotificationData, "id" | "timestamp"> & { id?: string; replaceId?: string }) => {
    const id = notification.id || Math.random().toString(36).substr(2, 9);
    const timestamp = Date.now();
    const newNotification = { ...notification, id, timestamp };
    
    setNotifications(prev => {
      if (notification.replaceId) {
        return prev.map(n => n.id === notification.replaceId ? newNotification : n);
      }
      
      if (notification.groupId) {
        const existingGroupNotifications = prev.filter(n => n.groupId === notification.groupId);
        const otherNotifications = prev.filter(n => n.groupId !== notification.groupId);
        const recentGroupNotifications = [...existingGroupNotifications, newNotification]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, MAX_GROUP_NOTIFICATIONS);
        
        return [...otherNotifications, ...recentGroupNotifications];
      }
      
      return [...prev, newNotification];
    });
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const updatedNotifications = prev.filter(notification => notification.id !== id);
      
      const remainingGroups = new Map<string, NotificationData[]>();
      updatedNotifications.forEach(notification => {
        if (notification.groupId) {
          if (!remainingGroups.has(notification.groupId)) {
            remainingGroups.set(notification.groupId, []);
          }
          remainingGroups.get(notification.groupId)!.push(notification);
        }
      });
      
      const finalNotifications = updatedNotifications.map(notification => {
        if (notification.groupId && remainingGroups.get(notification.groupId)?.length === 1) {
          return { ...notification, groupId: undefined };
        }
        return notification;
      });
      
      return finalNotifications;
    });
  }, []);

  const hideNotificationGroup = useCallback((groupId: string) => {
    setNotifications(prev => prev.filter(notification => notification.groupId !== groupId));
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      newSet.delete(groupId);
      return newSet;
    });
  }, []);

  const groupedNotifications = useMemo(() => {
    const groups: Record<string, NotificationGroupType> = {};
    const ungrouped: NotificationData[] = [];

    notifications.forEach(notification => {
      if (notification.groupId) {
        if (!groups[notification.groupId]) {
          groups[notification.groupId] = {
            id: notification.groupId,
            notifications: [],
            isExpanded: expandedGroups.has(notification.groupId)
          };
        }
        groups[notification.groupId].notifications.push(notification);
      } else {
        ungrouped.push(notification);
      }
    });

    return { groups: Object.values(groups), ungrouped };
  }, [notifications, expandedGroups]);

  const contextValue = useMemo(() => ({
    showNotification,
    hideNotification,
    hideNotificationGroup
  }), [showNotification, hideNotification, hideNotificationGroup]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      <div className="fixed top-4 right-4 z-notification space-y-2 w-[calc(100vw-20px)] md:w-90">
        {groupedNotifications.ungrouped.map((notification) => (
          <IndividualNotification
            key={notification.id}
            id={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={() => hideNotification(notification.id)}
          />
        ))}
        
        {groupedNotifications.groups.map((group) => (
          <NotificationGroup
            key={group.id}
            notifications={group.notifications}
            onCloseGroup={() => hideNotificationGroup(group.id)}
            onCloseNotification={hideNotification}
            isVisible={true}
          />
        ))}
      </div>
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
'use client';

import React from 'react';
import { Notification } from '@/lib/hooks/useNotifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onClear?: (id: string) => void;
}

const typeConfig = {
  info: { bg: 'bg-blue-50', border: 'border-blue-300', icon: 'ℹ️', title: 'text-blue-900' },
  warning: { bg: 'bg-yellow-50', border: 'border-yellow-300', icon: '⚠️', title: 'text-yellow-900' },
  error: { bg: 'bg-red-50', border: 'border-red-300', icon: '❌', title: 'text-red-900' },
  success: { bg: 'bg-green-50', border: 'border-green-300', icon: '✅', title: 'text-green-900' },
};

export function NotificationItem({
  notification,
  onMarkAsRead,
  onClear,
}: NotificationItemProps) {
  const config = typeConfig[notification.type];

  return (
    <div className={`p-4 border rounded ${config.bg} ${config.border} flex gap-3`}>
      <span className="text-xl">{config.icon}</span>
      <div className="flex-1">
        <p className={`font-semibold ${config.title}`}>{notification.title}</p>
        <p className="text-sm mt-1">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(notification.created_at).toLocaleString()}
        </p>
      </div>
      <div className="flex gap-2">
        {!notification.read && onMarkAsRead && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="text-xs px-2 py-1 bg-white rounded border hover:bg-gray-100"
          >
            Mark as read
          </button>
        )}
        {onClear && (
          <button
            onClick={() => onClear(notification.id)}
            className="text-xs px-2 py-1 bg-white rounded border hover:bg-gray-100"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead?: (id: string) => void;
  onClear?: (id: string) => void;
}

export function NotificationPanel({
  notifications,
  unreadCount,
  onMarkAsRead,
  onClear,
}: NotificationPanelProps) {
  return (
    <div className="bg-white border rounded-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Notifications</h3>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto p-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No notifications</p>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onClear={onClear}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

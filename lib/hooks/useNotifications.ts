'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRealtime } from './useRealtime';

export interface Notification {
  id: string;
  user_id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Subscribe to real-time notifications
  useRealtime({
    table: 'notifications',
    event: 'INSERT',
    filter: userId ? `user_id=eq.${userId}` : undefined,
    onInsert: (payload) => {
      setNotifications((prev) => [payload, ...prev]);
      setUnreadCount((prev) => prev + 1);
    },
  });

  // Fetch existing notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      // Check for test mode
      const testMode = localStorage.getItem('test_mode');
      if (testMode === 'true') {
        // Return mock notifications for test mode
        const mockNotifications: Notification[] = [
          {
            id: '1',
            user_id: '550e8400-e29b-41d4-a716-446655440000',
            type: 'warning',
            title: 'High Priority Request',
            message: 'Server Hardware Upgrade request requires immediate attention',
            read: false,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            user_id: '550e8400-e29b-41d4-a716-446655440000',
            type: 'success',
            title: 'Request Completed',
            message: 'Software License Renewal has been approved and completed',
            read: true,
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '3',
            user_id: '550e8400-e29b-41d4-a716-446655440000',
            type: 'info',
            title: 'New Request Submitted',
            message: 'Network Infrastructure request has been submitted for review',
            read: false,
            created_at: new Date(Date.now() - 3600000).toISOString()
          }
        ];

        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
        return;
      }

      if (!userId) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.read).length);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    const supabase = createClient();
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const clearNotification = async (notificationId: string) => {
    const supabase = createClient();
    await supabase.from('notifications').delete().eq('id', notificationId);
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearNotification,
  };
}

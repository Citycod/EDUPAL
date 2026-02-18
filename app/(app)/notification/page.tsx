'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { supabase } from '@/lib/supabase';

interface Notification {
  id: number;
  type: 'course' | 'class' | 'community' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const Notifications: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          const formattedNotifications: Notification[] = data.map((n: any) => ({
            id: n.id,
            type: n.type || 'system',
            title: n.title,
            message: n.message,
            timestamp: new Date(n.created_at),
            read: n.is_read || false,
            actionUrl: n.action_url || '#'
          }));

          setNotifications(formattedNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'course':
        return 'school';
      case 'class':
        return 'class';
      case 'community':
        return 'forum';
      case 'system':
      default:
        return 'notifications';
    }
  };

  const getTimeAgo = (timestamp: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return timestamp.toLocaleDateString();
  };

  const markAsRead = async (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl && notification.actionUrl !== '#') {
      router.push(notification.actionUrl);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Loading Notifications...</div>;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-[100dvh]">
      <div className="relative flex h-auto min-h-[100dvh] w-full flex-col overflow-x-hidden pb-20">

        {/* Header */}
        <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-50 border-b border-white/5">
          <div className="w-12">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-12 w-12 rounded-full text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            Notifications
          </h2>
          <div className="w-12 flex justify-end">
            <button
              onClick={markAllAsRead}
              className="flex cursor-pointer items-center justify-center rounded-lg h-12 w-12 text-primary transition-colors hover:bg-primary/10"
              title="Mark all as read"
            >
              <span className="material-symbols-outlined">done_all</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Unread Badge */}
          {unreadCount > 0 && (
            <div className="mb-4 bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">mark_chat_unread</span>
              <p className="text-primary text-sm font-medium">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500">notifications_off</span>
              </div>
              <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-2">No notifications yet</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[250px]">
                We'll notify you when there are updates about your classes, assignments, or community posts.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${notification.read
                    ? 'bg-transparent hover:bg-slate-100 dark:hover:bg-white/5'
                    : 'bg-white dark:bg-white/5 border-l-4 border-primary shadow-sm'
                    }`}
                >
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.read ? 'bg-slate-100 dark:bg-white/10 text-slate-500' : 'bg-primary/20 text-primary'
                    }`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <p className={`text-sm font-medium leading-tight ${notification.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white font-bold'
                        }`}>
                        {notification.title}
                      </p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap pt-0.5">
                        {getTimeAgo(notification.timestamp)}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${notification.read ? 'text-slate-500 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'
                      }`}>
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}

      </div>
    </div>
  );
};

export default Notifications;

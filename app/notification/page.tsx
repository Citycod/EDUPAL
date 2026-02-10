'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
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

  const navItems = [
    {
      icon: "House",
      label: "Home",
      active: false,
      onClick: () => router.push('/home')
    },
    {
      icon: "BookOpen",
      label: "Study",
      active: false,
      onClick: () => router.push('/study')
    },
    {
      icon: "UsersThree",
      label: "Classes",
      active: false,
      onClick: () => router.push('/classes')
    },
    {
      icon: "Users",
      label: "Community",
      active: false,
      onClick: () => router.push('/community')
    },
    {
      icon: "User",
      label: "Profile",
      active: false,
      onClick: () => router.push('/profile')
    }
  ];

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'course':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h64a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z" />
          </svg>
        );
      case 'class':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M164.44,105.34l-48-32A8,8,0,0,0,104,80v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,129.05V95l25.58,17ZM216,40H40A16,16,0,0,0,24,56V168a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,128H40V56H216V168Zm16,40a8,8,0,0,1-8,8H32a8,8,0,0,1,0-16H224A8,8,0,0,1,232,208Z" />
          </svg>
        );
      case 'community':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z" />
          </svg>
        );
      case 'system':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
          </svg>
        );
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
    // Optimistic Update
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
    // Optimistic Update
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
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8fbfc] text-slate-500">Loading Notifications...</div>;
  }

  return (
    <div
      className="min-h-screen bg-[#f8fbfc]"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      {/* Header */}
      <Header
        title="Notifications"
        showBackButton={true}
        showAddButton={true}
        onBackClick={() => router.back()}
        onAddClick={markAllAsRead}
      />

      {/* Main Content */}
      <div className="pt-20 pb-24">
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <div className="px-4 py-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <p className="text-blue-800 text-sm font-medium">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="text-[#498a9c] mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,48H40A16,16,0,0,0,24,64V176a16,16,0,0,0,16,16H56v16a8,8,0,0,0,16,0V192h96v16a8,8,0,0,0,16,0V192h16a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM40,64H216v72H40Zm176,112H40v-24H216v24Z" />
              </svg>
            </div>
            <p className="text-[#498a9c] text-lg font-medium text-center mb-2">
              No notifications yet
            </p>
            <p className="text-[#498a9c] text-sm text-center">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-center gap-4 px-4 min-h-[72px] py-3 cursor-pointer transition-colors ${notification.read
                  ? 'bg-[#f8fbfc]'
                  : 'bg-secondary/10 border-l-4 border-l-primary'
                  } hover:bg-[#e7f1f4] active:bg-[#dde9ec]`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div
                  className={`flex items-center justify-center rounded-xl shrink-0 size-12 ${notification.read ? 'bg-[#e7f1f4]' : 'bg-primary bg-opacity-10'
                    }`}
                >
                  <div
                    className={
                      notification.read ? 'text-[#498a9c]' : 'text-primary'
                    }
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-base font-medium leading-normal line-clamp-1 ${notification.read ? 'text-[#0d191c]' : 'text-[#0d191c] font-semibold'
                        }`}
                    >
                      {notification.title}
                    </p>
                    <span className="text-xs text-[#498a9c] whitespace-nowrap">
                      {getTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                  <p
                    className={`text-sm font-normal leading-normal line-clamp-2 ${notification.read ? 'text-[#498a9c]' : 'text-[#498a9c]'
                      }`}
                  >
                    {notification.message}
                  </p>
                </div>

                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0 ml-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav navItems={navItems} />
    </div>
  );
};

export default Notifications;

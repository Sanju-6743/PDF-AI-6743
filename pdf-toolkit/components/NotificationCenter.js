"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { subscribeToPdfProcessing } from '../lib/supabase';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time PDF processing updates
    const subscription = subscribeToPdfProcessing(user.id, (payload) => {
      const { status, message, timestamp } = payload.payload;

      // Add notification
      const newNotification = {
        id: Date.now(),
        type: status === 'success' ? 'success' : status === 'error' ? 'error' : 'info',
        message,
        timestamp: new Date(timestamp),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev]);

      // Show toast notification
      if (status === 'success') {
        toast.success(message);
      } else if (status === 'error') {
        toast.error(message);
      } else {
        toast(message);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Notifications
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        notification.type === 'success' ? 'text-green-600 dark:text-green-400' :
                        notification.type === 'error' ? 'text-red-600 dark:text-red-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`}>
                        {notification.message}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notification.timestamp.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setNotifications([])}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

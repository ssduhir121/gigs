// context/NotificationContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch notifications
  const fetchNotifications = async (options = {}) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      if (options.unreadOnly) params.append('unreadOnly', 'true');

      const response = await axios.get(`/api/notifications?${params}`);
      
      if (response.data.success) {
        if (options.page && options.page > 1) {
          // Append to existing notifications for pagination
          setNotifications(prev => [...prev, ...response.data.data.notifications]);
        } else {
          // Replace notifications
          setNotifications(response.data.data.notifications);
        }
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count only (lightweight)
  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await axios.get('/api/notifications/unread-count');
      if (response.data.success) {
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(`/api/notifications/${notificationId}/read`);
      if (response.data.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await axios.put('/api/notifications/read-all');
      if (response.data.success) {
        // Update all notifications to read
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(`/api/notifications/${notificationId}`);
      if (response.data.success) {
        // Remove from local state
        setNotifications(prev => 
          prev.filter(notif => notif._id !== notificationId)
        );
        // Update unread count if needed
        const deletedNotif = notifications.find(n => n._id === notificationId);
        if (deletedNotif && !deletedNotif.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Set up polling for real-time updates
  useEffect(() => {
    if (isAuthenticated) {
      // Initial fetch
      fetchNotifications();
      
      // Set up polling every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount(); // Lightweight check for new notifications
      }, 30000);
      
      setPollingInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      // Clear state when user logs out
      setNotifications([]);
      setUnreadCount(0);
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    }
  }, [isAuthenticated]);

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
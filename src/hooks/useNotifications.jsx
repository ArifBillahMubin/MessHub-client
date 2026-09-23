import { useState, useEffect, useCallback } from 'react';
import useAuth from './useAuth';
import useCurrentUser from './useCurrentUser';
import useAxiosSecure from './useAxiosSecure';

const useNotifications = () => {
    const { user } = useAuth();
    const { currentUser } = useCurrentUser();
    const axiosSecure = useAxiosSecure();
    
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        if (!user?.email || !currentUser?.hasMess) {
            console.log('[Notifications Frontend] No email or no mess, skipping fetch')
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            console.log('[Notifications Frontend] Fetching notifications for:', user.email)
            const response = await axiosSecure.get(`/notifications?email=${user.email}`);
            console.log('[Notifications Frontend] Received:', response.data.length, 'notifications')
            setNotifications(response.data);
            
            // Count unread
            const unread = response.data.filter(n => !n.isRead).length;
            setUnreadCount(unread);
            console.log('[Notifications Frontend] Unread count:', unread)
            setError(null);
        } catch (err) {
            console.error('[Notifications Frontend] Failed to fetch notifications:', err);
            console.error('[Notifications Frontend] Error response:', err.response?.data);
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    }, [user?.email, currentUser?.hasMess, axiosSecure]);

    // Fetch unread count only
    const fetchUnreadCount = useCallback(async () => {
        if (!user?.email || !currentUser?.hasMess) {
            setUnreadCount(0);
            return;
        }

        try {
            console.log('[Notifications Frontend] Fetching unread count for:', user.email)
            const response = await axiosSecure.get(`/notifications/unread-count?email=${user.email}`);
            console.log('[Notifications Frontend] Unread count response:', response.data.unreadCount)
            setUnreadCount(response.data.unreadCount);
        } catch (err) {
            console.error('[Notifications Frontend] Failed to fetch unread count:', err);
        }
    }, [user?.email, currentUser?.hasMess, axiosSecure]);

    // Mark notification as read
    const markAsRead = useCallback(async (notificationId) => {
        if (!user?.email) return;

        try {
            await axiosSecure.patch(`/notifications/${notificationId}/read`, {
                email: user.email
            });
            
            // Update local state
            setNotifications(prev => 
                prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    }, [user?.email, axiosSecure]);

    // Mark all as read
    const markAllAsRead = useCallback(async () => {
        if (!user?.email) return;

        try {
            await axiosSecure.patch('/notifications/read-all', {
                email: user.email
            });
            
            // Update local state
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    }, [user?.email, axiosSecure]);

    // Initial fetch
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead
    };
};

export default useNotifications;

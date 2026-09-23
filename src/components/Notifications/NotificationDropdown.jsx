import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Bell, Check, Clock, X } from 'lucide-react';
import useNotifications from '../../hooks/useNotifications';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleNotificationClick = async (notification) => {
        // Mark as read
        if (!notification.isRead) {
            await markAsRead(notification._id);
        }
        
        // Close dropdown
        setIsOpen(false);
        
        // Navigate to link
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
    };

    const getRelativeTime = (date) => {
        const now = new Date();
        const notificationDate = new Date(date);
        const diffInMs = now - notificationDate;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        return notificationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getNotificationIcon = (type) => {
        // Return appropriate icon based on notification type
        return <Bell size={16} className="text-primary" />;
    };

    // Get latest 5 notifications for dropdown
    const recentNotifications = notifications.slice(0, 5);

    return (
        <div ref={dropdownRef} className="relative">
            {/* Bell Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-neutral/70 transition hover:bg-background hover:text-primary"
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-tertiary text-[10px] font-bold text-white ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-12 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-primary/10 bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <h3 className="text-sm font-bold text-neutral">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs font-semibold text-primary transition hover:text-primary/80"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            </div>
                        ) : recentNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Bell size={40} className="mb-3 text-neutral/20" />
                                <p className="text-sm font-semibold text-neutral/60">No notifications yet</p>
                                <p className="mt-1 text-xs text-neutral/40">You're all caught up!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {recentNotifications.map((notification) => (
                                    <button
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`flex w-full gap-3 px-4 py-3 text-left transition hover:bg-background/50 ${
                                            !notification.isRead ? 'bg-primary/5' : ''
                                        }`}
                                    >
                                        {/* Icon */}
                                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                            !notification.isRead ? 'bg-primary/10' : 'bg-background/70'
                                        }`}>
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            <p className={`text-sm font-semibold ${
                                                !notification.isRead ? 'text-neutral' : 'text-neutral/70'
                                            }`}>
                                                {notification.title}
                                            </p>
                                            <p className="mt-0.5 text-xs text-neutral/60 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-neutral/40">
                                                <Clock size={10} />
                                                {getRelativeTime(notification.createdAt)}
                                            </p>
                                        </div>

                                        {/* Unread indicator */}
                                        {!notification.isRead && (
                                            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {recentNotifications.length > 0 && (
                        <div className="border-t border-gray-100 px-4 py-3">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/dashboard/notifications');
                                }}
                                className="w-full rounded-lg bg-background/70 py-2 text-center text-xs font-bold text-primary transition hover:bg-primary/10"
                            >
                                View All Notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;

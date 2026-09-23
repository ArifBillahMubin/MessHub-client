import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { 
    Bell, 
    Check, 
    Clock, 
    ShoppingBag, 
    Wallet, 
    Users, 
    FileText,
    Home,
    Megaphone,
    Vote,
    CheckCircle2
} from 'lucide-react';
import useNotifications from '../../../hooks/useNotifications';
import Loading from '../../../components/Loading/Loading';

const NOTIFICATION_CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'join', label: 'Mess' },
    { id: 'bazar', label: 'Bazar' },
    { id: 'payment', label: 'Payments' },
    { id: 'report', label: 'Reports' },
];

const Notifications = () => {
    const navigate = useNavigate();
    const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead } = useNotifications();
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Filter notifications based on selected category
    const filteredNotifications = useMemo(() => {
        let filtered = notifications;

        if (selectedCategory === 'unread') {
            filtered = filtered.filter(n => !n.isRead);
        } else if (selectedCategory === 'join') {
            filtered = filtered.filter(n => 
                n.type.includes('join_request') || n.type.includes('member')
            );
        } else if (selectedCategory === 'bazar') {
            filtered = filtered.filter(n => n.type.includes('bazar'));
        } else if (selectedCategory === 'payment') {
            filtered = filtered.filter(n => n.type.includes('payment'));
        } else if (selectedCategory === 'report') {
            filtered = filtered.filter(n => n.type.includes('report'));
        }

        return filtered;
    }, [notifications, selectedCategory]);

    // Group notifications by date
    const groupedNotifications = useMemo(() => {
        const groups = {
            today: [],
            yesterday: [],
            thisWeek: [],
            older: []
        };

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        filteredNotifications.forEach(notification => {
            const notifDate = new Date(notification.createdAt);
            const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

            if (notifDay.getTime() === today.getTime()) {
                groups.today.push(notification);
            } else if (notifDay.getTime() === yesterday.getTime()) {
                groups.yesterday.push(notification);
            } else if (notifDate >= weekAgo) {
                groups.thisWeek.push(notification);
            } else {
                groups.older.push(notification);
            }
        });

        return groups;
    }, [filteredNotifications]);

    const handleNotificationClick = async (notification) => {
        // Mark as read
        if (!notification.isRead) {
            await markAsRead(notification._id);
        }

        // Navigate to link
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const getNotificationIcon = (type) => {
        if (type.includes('join')) return <Users size={18} className="text-primary" />;
        if (type.includes('bazar')) return <ShoppingBag size={18} className="text-secondary" />;
        if (type.includes('payment')) return <Wallet size={18} className="text-tertiary" />;
        if (type.includes('report')) return <FileText size={18} className="text-primary" />;
        if (type.includes('announcement')) return <Megaphone size={18} className="text-primary" />;
        if (type.includes('poll')) return <Vote size={18} className="text-secondary" />;
        return <Bell size={18} className="text-primary" />;
    };

    const formatTime = (date) => {
        const notifDate = new Date(date);
        return notifDate.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const formatDate = (date) => {
        const notifDate = new Date(date);
        return notifDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) return <Loading />;

    return (
        <div className="mx-auto max-w-4xl space-y-6 pb-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-extrabold text-neutral">Notifications</h1>
                <p className="mt-1 text-sm text-neutral/60">
                    Stay updated with activity in your mess
                </p>
            </div>

            {/* Stats and Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/10 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Bell size={24} className="text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral/60">Unread Notifications</p>
                        <p className="text-2xl font-extrabold text-primary">{unreadCount}</p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 rounded-lg border border-primary/20 bg-white px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary/5"
                    >
                        <CheckCircle2 size={16} />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
                {NOTIFICATION_CATEGORIES.map(category => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                            selectedCategory === category.id
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-white text-neutral/70 hover:bg-background hover:text-primary'
                        }`}
                    >
                        {category.label}
                        {category.id === 'unread' && unreadCount > 0 && (
                            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            <div className="space-y-6">
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
                        {error}
                    </div>
                )}

                {!loading && filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/10 bg-white py-16 text-center">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-background">
                            <Bell size={40} className="text-neutral/20" />
                        </div>
                        <p className="text-lg font-bold text-neutral">No notifications yet</p>
                        <p className="mt-2 text-sm text-neutral/60">
                            {selectedCategory === 'unread' 
                                ? "You're all caught up!" 
                                : "You'll see notifications here when there's activity in your mess"}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Today */}
                        {groupedNotifications.today.length > 0 && (
                            <NotificationGroup
                                title="Today"
                                notifications={groupedNotifications.today}
                                onNotificationClick={handleNotificationClick}
                                getNotificationIcon={getNotificationIcon}
                                formatTime={formatTime}
                            />
                        )}

                        {/* Yesterday */}
                        {groupedNotifications.yesterday.length > 0 && (
                            <NotificationGroup
                                title="Yesterday"
                                notifications={groupedNotifications.yesterday}
                                onNotificationClick={handleNotificationClick}
                                getNotificationIcon={getNotificationIcon}
                                formatTime={formatTime}
                            />
                        )}

                        {/* This Week */}
                        {groupedNotifications.thisWeek.length > 0 && (
                            <NotificationGroup
                                title="This Week"
                                notifications={groupedNotifications.thisWeek}
                                onNotificationClick={handleNotificationClick}
                                getNotificationIcon={getNotificationIcon}
                                formatDate={formatDate}
                                formatTime={formatTime}
                            />
                        )}

                        {/* Older */}
                        {groupedNotifications.older.length > 0 && (
                            <NotificationGroup
                                title="Older"
                                notifications={groupedNotifications.older}
                                onNotificationClick={handleNotificationClick}
                                getNotificationIcon={getNotificationIcon}
                                formatDate={formatDate}
                                formatTime={formatTime}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// NotificationGroup Component
const NotificationGroup = ({ 
    title, 
    notifications, 
    onNotificationClick, 
    getNotificationIcon,
    formatTime,
    formatDate
}) => {
    return (
        <div>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-neutral/40">
                {title}
            </h2>
            <div className="space-y-2">
                {notifications.map(notification => (
                    <button
                        key={notification._id}
                        onClick={() => onNotificationClick(notification)}
                        className={`flex w-full gap-4 rounded-xl border p-4 text-left transition hover:border-primary/20 hover:bg-background/50 ${
                            !notification.isRead
                                ? 'border-primary/10 bg-primary/5'
                                : 'border-gray-100 bg-white'
                        }`}
                    >
                        {/* Icon */}
                        <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                            !notification.isRead ? 'bg-primary/10' : 'bg-background/70'
                        }`}>
                            {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm font-bold ${
                                    !notification.isRead ? 'text-neutral' : 'text-neutral/70'
                                }`}>
                                    {notification.title}
                                </p>
                                <p className="shrink-0 text-xs font-medium text-neutral/40">
                                    {formatDate ? formatDate(notification.createdAt) : formatTime(notification.createdAt)}
                                </p>
                            </div>
                            <p className="mt-1 text-sm text-neutral/60">
                                {notification.message}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="flex items-center gap-1 text-xs font-medium text-neutral/40">
                                    <Clock size={12} />
                                    {formatTime(notification.createdAt)}
                                </span>
                                {!notification.isRead && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-primary">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        New
                                    </span>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Notifications;


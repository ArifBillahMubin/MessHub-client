import { NavLink, Link, Outlet, useNavigate } from "react-router";
import {
    Menu, X, LayoutDashboard, Home, CalendarDays, Users, Bell,
    UserCircle, Settings, ChevronLeft, ChevronRight, WalletCards,
    MessageCircle, ChevronDown, Megaphone, Vote, FileText,
    ShieldCheck, BarChart2, CreditCard, ClipboardList, MessagesSquare,
    UserCog, Building2, BookOpen, LogOut,
} from "lucide-react";
import logo from "../../assets/logo/logo.png";
import { useState } from "react";
import useRole from "../../hooks/useRole";
import useCurrentUser from "../../hooks/useCurrentUser";
import useMessRole from "../../hooks/useMessRole";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loading/Loading";
import { toast } from "react-hot-toast";

// ─── Sidebar menu configurations ──────────────────────────────────────────────

const memberMenu = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard, end: true },
    { name: "My Mess", path: "/dashboard/my-mess", icon: Home },
    {
        name: "Monthly Portal", icon: CalendarDays, group: true,
        children: [
            { name: "Meals", path: "/dashboard/monthly/meals" },
            { name: "Bazar", path: "/dashboard/monthly/bazar" },
            { name: "Expenses", path: "/dashboard/monthly/expenses" },
            { name: "My Calculation", path: "/dashboard/monthly/calculation" },
            { name: "Payments", path: "/dashboard/monthly/payments" },
            { name: "Settlement", path: "/dashboard/monthly/settlement" },
            { name: "Monthly Reports", path: "/dashboard/monthly/reports" },
        ],
    },
    { name: "Members", path: "/dashboard/members", icon: Users },
    { name: "Mess Chat", path: "/dashboard/chat", icon: MessageCircle },
    { name: "Announcements", path: "/dashboard/announcements", icon: Megaphone },
    { name: "Polls", path: "/dashboard/polls", icon: Vote },
    { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
    { name: "Profile / Settings", path: "/dashboard/profile", icon: UserCircle },
];

const managerMenu = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard, end: true },
    {
        name: "Mess Management", icon: Building2, group: true,
        children: [
            { name: "Members", path: "/dashboard/mess/members" },
            { name: "Join Requests", path: "/dashboard/mess/join-requests" },
            { name: "Public Mess Post", path: "/dashboard/mess/public-post" },
            { name: "Mess Settings", path: "/dashboard/mess/settings" },
        ],
    },
    {
        name: "Monthly Portal", icon: CalendarDays, group: true,
        children: [
            { name: "Current Month", path: "/dashboard/monthly/current" },
            { name: "Meals", path: "/dashboard/monthly/meals" },
            { name: "Bazar", path: "/dashboard/monthly/bazar" },
            { name: "Expenses", path: "/dashboard/monthly/expenses" },
            { name: "Payments", path: "/dashboard/monthly/payments" },
            { name: "Calculations", path: "/dashboard/monthly/calculations" },
            { name: "Settlement", path: "/dashboard/monthly/settlement" },
            { name: "Monthly Reports", path: "/dashboard/monthly/reports" },
        ],
    },
    {
        name: "Communication", icon: MessagesSquare, group: true,
        children: [
            { name: "Mess Chat", path: "/dashboard/chat" },
            { name: "Announcements", path: "/dashboard/announcements" },
            { name: "Polls", path: "/dashboard/polls" },
        ],
    },
    { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
    { name: "Service Plan", path: "/dashboard/service-plan", icon: CreditCard },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

const adminMenu = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard, end: true },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Messes", path: "/admin/messes", icon: Building2 },
    { name: "Managers", path: "/admin/managers", icon: UserCog },
    {
        name: "Public Posts", icon: FileText, group: true,
        children: [
            { name: "Post Moderation", path: "/admin/public-posts/moderation" },
        ],
    },
    { name: "Reports & Complaints", path: "/admin/reports", icon: ClipboardList },
    { name: "Audit Logs", path: "/admin/audit-logs", icon: BookOpen },
    { name: "Platform Analytics", path: "/admin/analytics", icon: BarChart2 },
    {
        name: "Pricing & Plans", icon: CreditCard, group: true,
        children: [
            { name: "Plans", path: "/admin/pricing" },
            { name: "Subscriptions", path: "/admin/subscriptions" },
            { name: "Custom Requests", path: "/admin/custom-requests" },
        ],
    },
    { name: "Contact Requests", path: "/admin/contact-requests", icon: MessagesSquare },
    { name: "Chat / Moderation", path: "/admin/moderation", icon: ShieldCheck },
    { name: "Notifications", path: "/admin/notifications", icon: Bell },
    { name: "Settings", path: "/admin/settings", icon: Settings },
];

// ─── Collapsible group item ────────────────────────────────────────────────────

const SidebarGroup = ({ item, isOpen, onMobileClose }) => {
    const [expanded, setExpanded] = useState(false);
    const Icon = item.icon;

    return (
        <li>
            <button
                type="button"
                onClick={() => setExpanded(prev => !prev)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 text-neutral/70 hover:bg-primary/5 hover:text-primary ${!isOpen ? "justify-center" : ""}`}
            >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background/70 text-primary transition-all duration-200 group-hover:bg-primary/10">
                    <Icon size={19} strokeWidth={2.2} />
                </span>
                {isOpen && (
                    <>
                        <span className="flex-1 truncate text-left">{item.name}</span>
                        <ChevronDown
                            size={15}
                            className={`shrink-0 text-neutral/40 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                        />
                    </>
                )}
            </button>

            {/* Children — only rendered when sidebar is expanded AND group is open */}
            {isOpen && expanded && (
                <ul className="ml-12 mt-1 space-y-1 border-l border-primary/10 pl-3">
                    {item.children.map(child => (
                        <li key={child.path}>
                            <NavLink
                                to={child.path}
                                onClick={onMobileClose}
                                className={({ isActive }) =>
                                    `block rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${isActive ? "bg-primary/10 text-primary" : "text-neutral/60 hover:bg-primary/5 hover:text-primary"}`
                                }
                            >
                                {child.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

// ─── Single nav link item ──────────────────────────────────────────────────────

const SidebarLink = ({ item, isOpen, onMobileClose }) => {
    const Icon = item.icon;
    return (
        <li>
            <NavLink
                to={item.path}
                end={item.end}
                onClick={onMobileClose}
                title={!isOpen ? item.name : undefined}
                className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${isActive ? "bg-primary text-white shadow-sm" : "text-neutral/70 hover:bg-primary/5 hover:text-primary"} ${!isOpen ? "justify-center" : ""}`
                }
            >
                {({ isActive }) => (
                    <>
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${isActive ? "bg-white/15 text-white" : "bg-background/70 text-primary group-hover:bg-primary/10"}`}>
                            <Icon size={19} strokeWidth={2.2} />
                        </span>
                        {isOpen && <span className="truncate">{item.name}</span>}
                    </>
                )}
            </NavLink>
        </li>
    );
};

// ─── DashboardLayout ───────────────────────────────────────────────────────────

const DashboardLayout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    const { user, logout } = useAuth();
    const [role, isRoleLoading] = useRole();                      // global account role (member | super_admin)
    const { currentUser, isUserLoading } = useCurrentUser();      // MongoDB user doc (hasMess etc.)
    const [messRole, isMessRoleLoading] = useMessRole();          // mess-level role (manager | member | null)
    const navigate = useNavigate();

    const isLoading = isRoleLoading || isUserLoading || isMessRoleLoading;

    // ── Sidebar menu selection ─────────────────────────────────────────────
    // super_admin always gets the admin menu regardless of mess state.
    // For all other users: if they have a mess and their messMembers role is
    // "manager", show the manager menu. Otherwise show the member menu.
    // While loading, default to memberMenu to avoid a flash of the wrong menu.
    const menuItems =
        role === "super_admin"
            ? adminMenu
            : messRole === "manager"
            ? managerMenu
            : memberMenu;

    // Role label shown in the sidebar badge
    const roleBadgeLabel =
        role === "super_admin"
            ? "Super Admin"
            : messRole === "manager"
            ? "Manager"
            : "Member";

    const handleLogout = () => {
        logout()
            .then(() => {
                toast.success("Logged out successfully.", {
                    duration: 2500,
                    style: { borderRadius: "12px", background: "#D5FBF9", color: "#173B3A", border: "1px solid #006B68", fontWeight: "600" },
                    iconTheme: { primary: "#006B68", secondary: "#ffffff" },
                });
                navigate("/");
            })
            .catch(console.error);
    };

    if (isLoading) return <Loading />;

    const displayName = user?.displayName || currentUser?.name || "User";
    const avatarInitial = displayName.charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-background">

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-neutral/40 backdrop-blur-[2px] lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 z-50 h-screen border-r border-primary/10 bg-white text-neutral shadow-[4px_0_20px_rgba(23,59,58,0.04)] transition-all duration-300 ease-in-out ${isOpen ? "w-64" : "w-18"} ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

                {/* Sidebar header */}
                <div className={`flex h-16 items-center border-b border-primary/10 ${isOpen ? "justify-between px-4" : "justify-center"}`}>
                    <Link to="/" onClick={() => setMobileOpen(false)} className="flex shrink-0 items-center">
                        <img src={logo} alt="MessHub" className={`${isOpen ? "h-9 w-auto" : "h-8 w-8"} object-contain`} />
                    </Link>

                    {/* Desktop collapse button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="hidden h-8 w-8 items-center justify-center rounded-lg border border-primary/10 bg-background text-primary transition-all duration-200 hover:bg-primary hover:text-white lg:flex"
                        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {isOpen ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
                    </button>

                    {/* Mobile close button */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral transition hover:bg-background hover:text-primary lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X size={21} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-3">
                    {/* Role badge */}
                    {isOpen && (role || messRole) && (
                        <div className="mb-3 px-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                                {roleBadgeLabel}
                            </span>
                        </div>
                    )}

                    <div className={`${isOpen ? "px-3" : "text-center"} mb-3`}>
                        {isOpen ? (
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-neutral/40">Main Menu</span>
                        ) : (
                            <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-tertiary" />
                        )}
                    </div>

                    <ul className="space-y-1.5">
                        {menuItems.map(item =>
                            item.group ? (
                                <SidebarGroup
                                    key={item.name}
                                    item={item}
                                    isOpen={isOpen}
                                    onMobileClose={() => setMobileOpen(false)}
                                />
                            ) : (
                                <SidebarLink
                                    key={item.path}
                                    item={item}
                                    isOpen={isOpen}
                                    onMobileClose={() => setMobileOpen(false)}
                                />
                            )
                        )}
                    </ul>

                    {/* Logout at bottom of sidebar */}
                    <div className="mt-6 border-t border-primary/10 pt-4">
                        <button
                            type="button"
                            onClick={handleLogout}
                            title={!isOpen ? "Logout" : undefined}
                            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral/70 transition-all duration-200 hover:bg-red-50 hover:text-red-600 ${!isOpen ? "justify-center" : ""}`}
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background/70 text-neutral/50 transition-all duration-200 group-hover:bg-red-50 group-hover:text-red-500">
                                <LogOut size={19} strokeWidth={2.2} />
                            </span>
                            {isOpen && <span className="truncate">Logout</span>}
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main content */}
            <div className={`min-h-screen transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-64" : "lg:ml-18"}`}>

                {/* Topbar */}
                <header className="sticky top-0 z-30 h-16 border-b border-primary/10 bg-white/95 backdrop-blur-md">
                    <div className="flex h-full items-center justify-between px-4 sm:px-6">

                        {/* Left side */}
                        <div className="flex items-center gap-3">
                            {/* Mobile menu button */}
                            <button
                                type="button"
                                onClick={() => setMobileOpen(true)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-background text-primary transition hover:bg-primary hover:text-white lg:hidden"
                                aria-label="Open sidebar"
                            >
                                <Menu size={21} />
                            </button>

                            <div>
                                <h1 className="text-lg font-extrabold text-neutral sm:text-xl">Dashboard</h1>
                                <p className="hidden text-xs font-medium text-neutral/50 sm:block">Manage your mess with ease</p>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-2">
                            {/* Notifications */}
                            <button
                                type="button"
                                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-neutral/70 transition hover:bg-background hover:text-primary"
                                aria-label="Notifications"
                            >
                                <Bell size={20} />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-tertiary ring-2 ring-white" />
                            </button>

                            {/* Profile avatar */}
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-primary/10">
                                {user?.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={displayName}
                                        referrerPolicy="no-referrer"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-bold text-primary">{avatarInitial}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-5 md:p-6 lg:p-7">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;

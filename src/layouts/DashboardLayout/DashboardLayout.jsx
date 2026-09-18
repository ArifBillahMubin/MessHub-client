import { NavLink, Link, Outlet } from "react-router";
import {
    Menu,
    X,
    LayoutDashboard,
    Home,
    CalendarDays,
    Users,
    Bell,
    UserCircle,
    Settings,
    ChevronLeft,
    ChevronRight,
    WalletCards,
    MessageCircle,
} from "lucide-react";

import logo from "../../assets/logo/logo.png";
import { useState } from "react";

const DashboardLayout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Temporary navigation
    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "My Mess", path: "/dashboard/my-mess", icon: Home },
        { name: "Monthly Portal", path: "/dashboard/monthly", icon: CalendarDays },
        { name: "Members", path: "/dashboard/members", icon: Users },
        { name: "Payments", path: "/dashboard/payments", icon: WalletCards },
        { name: "Mess Chat", path: "/dashboard/chat", icon: MessageCircle },
        { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
        { name: "Settings", path: "/dashboard/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-background">

            {/* Mobile overlay */}
            {mobileOpen && (
                <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-neutral/40 backdrop-blur-[2px] lg:hidden" />
            )}

             {/* Sidebar */}
            <aside className={`fixed left-0 top-0 z-50 h-screen border-r border-primary/10 bg-white text-neutral shadow-[4px_0_20px_rgba(23,59,58,0.04)] transition-all duration-300 ease-in-out ${isOpen ? "w-64" : "w-18"} ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

                {/* Sidebar header */}
                <div className={`flex h-16 items-center border-b border-primary/10 ${isOpen ? "justify-between px-4" : "justify-center"}`}>

                     {/* Logo */}
                    <Link to="/" onClick={() => setMobileOpen(false)} className="flex shrink-0 items-center">
                        <img src={logo} alt="MessHub" className={`${isOpen ? "h-9 w-auto" : "h-8 w-8"} object-contain`} />
                    </Link>

                     {/* Desktop collapse button */}
                    <button type="button" onClick={() => setIsOpen(!isOpen)} className="hidden h-8 w-8 items-center justify-center rounded-lg border border-primary/10 bg-background text-primary transition-all duration-200 hover:bg-primary hover:text-white lg:flex" aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}>
                        {isOpen ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
                    </button>

                     {/* Mobile close button */}
                    <button type="button" onClick={() => setMobileOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral transition hover:bg-background hover:text-primary lg:hidden" aria-label="Close sidebar">
                        <X size={21} />
                    </button>
                </div>

                 {/* Navigation */}
                <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-3">
                    <div className={`${isOpen ? "px-3" : "text-center"} mb-3`}>
                        {isOpen ? (
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-neutral/40">Main Menu</span>
                        ) : (
                            <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-tertiary" />
                        )}
                    </div>

                    <ul className="space-y-1.5">
                        {menuItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <li key={item.name}>
                                    <NavLink to={item.path} end={item.path === "/dashboard"} onClick={() => setMobileOpen(false)} title={!isOpen ? item.name : undefined} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${isActive ? "bg-primary text-white shadow-sm" : "text-neutral/70 hover:bg-primary/5 hover:text-primary"} ${!isOpen ? "justify-center" : ""}`}>
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
                        })}
                    </ul>
                </nav>
            </aside>

            {/* // Main content */}
            <div className={`min-h-screen transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-64" : "lg:ml-18"}`}>

                 {/* Topbar */}
                <header className="sticky top-0 z-30 h-16 border-b border-primary/10 bg-white/95 backdrop-blur-md">
                    <div className="flex h-full items-center justify-between px-4 sm:px-6">

                         {/* Left side */}
                        <div className="flex items-center gap-3">

                             {/* Mobile menu */}
                            <button type="button" onClick={() => setMobileOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-background text-primary transition hover:bg-primary hover:text-white lg:hidden" aria-label="Open sidebar">
                                <Menu size={21} />
                            </button>

                            {/* Page title */}
                            <div>
                                <h1 className="text-lg font-extrabold text-neutral sm:text-xl">Dashboard</h1>
                                <p className="hidden text-xs font-medium text-neutral/50 sm:block">Manage your mess with ease</p>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-2">

                            {/* Mess switcher */}
                            <button type="button" className="hidden items-center gap-2 rounded-xl border border-primary/10 bg-background px-3 py-2 text-left transition hover:border-primary/20 hover:bg-primary/5 sm:flex">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                                    <Home size={15} className="text-primary" />
                                </span>

                                <span className="max-w-32 truncate text-xs font-bold text-neutral">My Mess</span>

                                <ChevronRight size={14} className="rotate-90 text-neutral/40" />
                            </button>

                            {/* Notification */}
                            <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-xl text-neutral/70 transition hover:bg-background hover:text-primary" aria-label="Notifications">
                                <Bell size={20} />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-tertiary ring-2 ring-white" />
                            </button>

                             {/* Profile */}
                            <button type="button" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary transition hover:bg-primary hover:text-white" aria-label="Profile">
                                <UserCircle size={22} />
                            </button>
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
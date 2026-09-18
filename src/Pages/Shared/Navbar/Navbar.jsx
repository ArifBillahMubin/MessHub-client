import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";
import logo from "../../../assets/logo/logo.png";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Find a Mess", path: "/find-mess" },
        { name: "How It Works", path: "/how-it-works" },
        { name: "Pricing", path: "/pricing" },
        { name: "About", path: "/about" },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const handleLogout = () => {
        logout()
            .then(() => {
                setIsDropdownOpen(false);
                setIsMenuOpen(false);
                toast.success("Logged out successfully.", {
                    duration: 2500,
                    style: {
                        borderRadius: "12px",
                        background: "#D5FBF9",
                        color: "#173B3A",
                        border: "1px solid #006B68",
                        fontWeight: "600",
                    },
                    iconTheme: { primary: "#006B68", secondary: "#ffffff" },
                });
                navigate("/");
            })
            .catch((error) => {
                console.error(error);
                toast.error("Logout failed. Please try again.", {
                    duration: 3000,
                    style: {
                        borderRadius: "12px",
                        background: "#ffffff",
                        color: "#173B3A",
                        border: "1px solid #FF8A00",
                        fontWeight: "600",
                    },
                    iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
                });
            });
    };

    // Resolved display values
    const displayName = user?.displayName || "User";
    const displayEmail = user?.email || "";
    const avatarInitial = displayName.charAt(0).toUpperCase();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white backdrop-blur-md">
            <div className="px-4 sm:px-6 lg:px-8">

                {/* Main Navbar */}
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <NavLink
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="shrink-0"
                    >
                        <img
                            src={logo}
                            alt="MessHub"
                            className="h-9 w-auto object-contain md:h-13"
                        />
                    </NavLink>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-1 lg:flex">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? "bg-background text-primary"
                                            : "text-neutral hover:bg-background hover:text-primary"
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Desktop Right Side */}
                    <div className="hidden items-center gap-3 lg:flex">

                        {user ? (
                            /* ── Authenticated: profile + dropdown ── */
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    aria-haspopup="true"
                                    aria-expanded={isDropdownOpen}
                                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                                    className="flex items-center gap-2.5 rounded-full border border-gray-200 bg-white py-1.5 pl-1.5 pr-3 transition-all duration-200 hover:border-primary/40 hover:bg-background hover:shadow-sm"
                                >
                                    {/* Avatar */}
                                    {user.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={displayName}
                                            referrerPolicy="no-referrer"
                                            className="h-7 w-7 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                            {avatarInitial}
                                        </span>
                                    )}

                                    {/* Name */}
                                    <span className="max-w-[110px] truncate text-sm font-semibold text-neutral">
                                        {displayName}
                                    </span>

                                    {/* Chevron */}
                                    <ChevronDown
                                        size={14}
                                        strokeWidth={2.5}
                                        className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                                            isDropdownOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {/* Dropdown */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 top-[calc(100%+8px)] w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-neutral/10">

                                        {/* Profile card */}
                                        <div className="flex items-center gap-3 bg-background/60 px-4 py-4">
                                            {user.photoURL ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt={displayName}
                                                    referrerPolicy="no-referrer"
                                                    className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20"
                                                />
                                            ) : (
                                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white ring-2 ring-primary/20">
                                                    {avatarInitial}
                                                </span>
                                            )}
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-neutral">
                                                    {displayName}
                                                </p>
                                                <p className="truncate text-[11px] text-slate-500">
                                                    {displayEmail}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px bg-gray-100" />

                                        {/* Logout */}
                                        <div className="p-2">
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral transition-colors hover:bg-red-50 hover:text-red-600"
                                            >
                                                <LogOut size={16} strokeWidth={2} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* ── Unauthenticated: Login + Get Started + profile placeholder ── */
                            <>
                                <NavLink
                                    to="/login"
                                    className="px-3 py-2 text-sm font-medium text-neutral transition-colors hover:text-primary"
                                >
                                    Login
                                </NavLink>

                                <NavLink
                                    to="/register"
                                    className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    Get Started
                                </NavLink>

                                <button
                                    type="button"
                                    aria-label="Profile"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <User size={17} strokeWidth={2} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral transition-colors hover:bg-background hover:text-primary lg:hidden"
                    >
                        {isMenuOpen ? (
                            <X size={23} strokeWidth={2} />
                        ) : (
                            <Menu size={23} strokeWidth={2} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`overflow-hidden transition-all duration-300 lg:hidden ${
                        isMenuOpen ? "max-h-[600px] pb-4 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="rounded-2xl bg-gray-50 p-3">

                        {/* Mobile Navigation */}
                        <div className="flex flex-col gap-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                            isActive
                                                ? "bg-background text-primary"
                                                : "text-neutral hover:bg-background hover:text-primary"
                                        }`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>

                        {/* Mobile Actions */}
                        <div className="mt-3 border-t border-gray-200 pt-3">
                            {user ? (
                                /* ── Mobile authenticated ── */
                                <div className="space-y-1">

                                    {/* Profile info row */}
                                    <div className="flex items-center gap-3 rounded-xl bg-background/60 px-4 py-3">
                                        {user.photoURL ? (
                                            <img
                                                src={user.photoURL}
                                                alt={displayName}
                                                referrerPolicy="no-referrer"
                                                className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20"
                                            />
                                        ) : (
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                                                {avatarInitial}
                                            </span>
                                        )}
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-neutral">
                                                {displayName}
                                            </p>
                                            <p className="truncate text-[11px] text-slate-500">
                                                {displayEmail}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Logout */}
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-neutral transition-colors hover:bg-red-50 hover:text-red-600"
                                    >
                                        <LogOut size={16} strokeWidth={2} />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                /* ── Mobile unauthenticated ── */
                                <div className="flex items-center gap-2">
                                    <NavLink
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex-1 rounded-xl px-4 py-3 text-center text-sm font-semibold text-neutral transition-colors hover:bg-background hover:text-primary"
                                    >
                                        Login
                                    </NavLink>

                                    <NavLink
                                        to="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex-1 rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:shadow-md"
                                    >
                                        Get Started
                                    </NavLink>

                                    <button
                                        type="button"
                                        aria-label="Profile"
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white"
                                    >
                                        <User size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;

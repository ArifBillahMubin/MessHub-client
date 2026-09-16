import { useState } from "react";
import { NavLink } from "react-router";
import { Menu, X, User } from "lucide-react";
import logo from '../../../assets/logo/logo.png'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Find a Mess", path: "/find-mess" },
        { name: "How It Works", path: "/how-it-works" },
        { name: "Pricing", path: "/pricing" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];

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
                            className="h-9 md:h-13 w-auto object-contain"
                        />
                    </NavLink>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-1 lg:flex">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${isActive
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
                    className={`overflow-hidden transition-all duration-300 lg:hidden ${isMenuOpen
                            ? "max-h-[500px] pb-4 opacity-100"
                            : "max-h-0 opacity-0"
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
                                        `rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive
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
                        </div>
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
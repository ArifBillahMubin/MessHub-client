
import { NavLink, Outlet, useLocation } from "react-router";
import logo from '../../assets/logo/logo.png'
import VisitorChatbot from "../../chatbot";
import {
    UtensilsCrossed,
    ShoppingBasket,
    MessageSquare,
    Users,
    PlusCircle,
    Wallet,
    BarChart3,
    ArrowRight,
} from "lucide-react";

/*  SHARED SUB-COMPONENTS
   All colors use the Tailwind custom tokens defined in index.css @theme:
   primary / secondary / tertiary / neutral / background */

/** Tiny pill badge — primary variant */
const BadgePrimary = ({ children }) => (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase text-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
        {children}
    </span>
);

/** Tiny pill badge — secondary variant */
const BadgeSecondary = ({ children }) => (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase text-secondary">
        <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
        {children}
    </span>
);

/** Section heading — neutral base, primary accent word */
const Heading = ({ line1, line2 }) => (
    <h2 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-neutral xl:text-[2.4rem]">
        {line1}{" "}
        <span className="text-primary">{line2}</span>
    </h2>
);

/** Feature row card — primary icon bg */
const FeatureRowPrimary = ({ icon: Icon, title, desc }) => (
    <div className="flex items-start gap-4 rounded-2xl bg-white px-4 py-4 shadow-[0_1px_6px_rgba(0,107,104,0.07)]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Icon size={18} className="text-primary" strokeWidth={2} />
        </div>
        <div>
            <p className="text-sm font-semibold text-neutral">{title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{desc}</p>
        </div>
    </div>
);

/** Feature row card — secondary icon bg */
const FeatureRowSecondary = ({ icon: Icon, title, desc }) => (
    <div className="flex items-start gap-4 rounded-2xl bg-white px-4 py-4 shadow-[0_1px_6px_rgba(0,107,104,0.07)]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
            <Icon size={18} className="text-secondary" strokeWidth={2} />
        </div>
        <div>
            <p className="text-sm font-semibold text-neutral">{title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{desc}</p>
        </div>
    </div>
);

/* 
   LOGIN PANEL  — returning user / dashboard focus
*/
const LoginPanel = () => (
    <div className="relative flex h-full flex-col justify-center px-10 py-16 xl:px-14">

        {/* Background */}
        <div className="pointer-events-none absolute inset-0 bg-background" />

        {/* Top-right geometric accent */}
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-bl-[80px] bg-primary opacity-40" />

        {/* Bottom-left soft circle */}
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-secondary/10" />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-sm space-y-8 xl:max-w-md">

            <BadgePrimary>Welcome Back</BadgePrimary>

            <div className="space-y-3">
                <Heading line1="Welcome Back to" line2="MessHub" />
                <p className="text-sm leading-relaxed text-slate-500">
                    Log in and pick up right where you left off. Your mess dashboard — meals,
                    bazar, expenses and payments — is waiting for you.
                </p>
            </div>

            {/* Divider */}
            <div className="h-px w-12 rounded-full bg-primary/25" />

            {/* Features */}
            <div className="space-y-3">
                <FeatureRowPrimary
                    icon={UtensilsCrossed}
                    title="Meal Tracking"
                    desc="View and update daily meal counts in seconds."
                />
                <FeatureRowSecondary
                    icon={ShoppingBasket}
                    title="Bazar Management"
                    desc="Review bazar logs and track shared purchase costs."
                />
                <FeatureRowPrimary
                    icon={BarChart3}
                    title="Expense Tracking"
                    desc="See a clear breakdown of all mess expenses."
                />
                <FeatureRowSecondary
                    icon={MessageSquare}
                    title="Mess Communication"
                    desc="Stay in sync with your mess members."
                />
            </div>

            {/* Footer note */}
            <div className="flex items-center gap-2">
                <span className="h-px flex-1 rounded-full bg-primary/15" />
                <span className="text-[11px] font-medium text-primary/60">
                    Manage Your Mess, All in One Place
                </span>
                <span className="h-px flex-1 rounded-full bg-primary/15" />
            </div>

        </div>
    </div>
);

/* REGISTER PANEL  — new user / getting started focus */
const RegisterPanel = () => (
    <div className="relative flex h-full flex-col justify-center px-10 py-16 xl:px-14">

        {/* Background — slightly warmer green tint vs login */}
        <div className="pointer-events-none absolute inset-0 bg-[#f0fdf9]" />

        {/* Left accent strip */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-r-full bg-secondary" />

        {/* Top-right soft circle */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-secondary opacity-20" />

        {/* Bottom-right tertiary dot cluster */}
        <div className="pointer-events-none absolute bottom-12 right-12 h-3 w-3 rounded-full bg-tertiary/70" />
        <div className="pointer-events-none absolute bottom-20 right-20 h-2 w-2 rounded-full bg-tertiary/70" />
        <div className="pointer-events-none absolute bottom-8 right-24 h-1.5 w-1.5 rounded-full bg-tertiary/70" />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-sm space-y-8 xl:max-w-md">

            <BadgeSecondary>Get Started</BadgeSecondary>

            <div className="space-y-3">
                <Heading line1="Welcome to" line2="MessHub" />
                <p className="text-sm leading-relaxed text-slate-500">
                    Create your free account and start managing your mess the smart way.
                    Set up a new mess or join an existing one — it only takes a minute.
                </p>
            </div>

            {/* Divider */}
            <div className="h-px w-12 rounded-full bg-secondary/30" />

            {/* Features */}
            <div className="space-y-3">
                <FeatureRowSecondary
                    icon={PlusCircle}
                    title="Create or Join a Mess"
                    desc="Start fresh or jump into an existing mess community."
                />
                <FeatureRowPrimary
                    icon={Users}
                    title="Manage Members"
                    desc="Invite members and manage roles with ease."
                />
                <FeatureRowSecondary
                    icon={UtensilsCrossed}
                    title="Track Meals"
                    desc="Automate daily meal recording and cost splits."
                />
                <FeatureRowPrimary
                    icon={Wallet}
                    title="Manage Expenses"
                    desc="Log, split, and settle every shared expense clearly."
                />
            </div>

            {/* CTA hint */}
            <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3">
                <span className="text-xs font-semibold text-primary">
                    Start Managing Your Mess Smarter
                </span>
                <ArrowRight size={14} className="text-primary" strokeWidth={2.5} />
            </div>

        </div>
    </div>
);

/*  LAYOUT */
const AuthLayout = () => {
    const { pathname } = useLocation();
    const isLogin = pathname === "/login";

    return (
        <div className="h-screen overflow-hidden bg-gray-100">
            <div className="grid h-screen grid-cols-1 lg:grid-cols-2">

                {/*  Left Side */}
                <div className="h-screen overflow-y-auto bg-white">

                    {/* Top Header */}
                    <div className="flex items-center justify-between px-6 py-6 sm:px-10 lg:px-12">

                        {/* Logo */}
                        <NavLink to="/" className="shrink-0">
                            <img
                                src={logo}
                                alt="MessHub"
                                className="h-10 w-auto object-contain"
                            />
                        </NavLink>

                        {/* Register / Login Toggle */}
                        <div className="flex items-center rounded-xl bg-gray-100 p-1 text-sm font-medium">

                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    `rounded-lg px-4 py-2 transition-all duration-200 ${isActive
                                        ? "bg-white text-primary shadow-sm"
                                        : "text-gray-500 hover:text-primary"
                                    }`
                                }
                            >
                                Register
                            </NavLink>

                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `rounded-lg px-4 py-2 transition-all duration-200 ${isActive
                                        ? "bg-white text-primary shadow-sm"
                                        : "text-gray-500 hover:text-primary"
                                    }`
                                }
                            >
                                Login
                            </NavLink>

                        </div>
                    </div>

                    {/* Auth Content */}
                    <main className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
                        <div className="w-full max-w-[420px]">
                            <Outlet />
                        </div>
                    </main>

                </div>

                {/* Right Side — switches between Login and Register panels */}
                <div className="sticky top-0 hidden h-screen overflow-hidden lg:block">
                    {isLogin ? <LoginPanel /> : <RegisterPanel />}
                </div>

            </div>
            <VisitorChatbot />
        </div>
    );
};

export default AuthLayout;
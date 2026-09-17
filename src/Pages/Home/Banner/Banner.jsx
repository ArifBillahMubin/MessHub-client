
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router";
import {
    ArrowRight,
    MapPin,
    Star,
    Home,
    UtensilsCrossed,
    ShoppingBasket,
    Wallet,
    MessageCircle,
    CheckCircle,
    CalendarDays,
    Banknote,
    HandCoins,
} from "lucide-react";

/* 
   SHARED PRIMITIVES
 */

const Badge = ({ children, bgClass = "bg-primary/10 text-primary border-primary/20" }) => (
    <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-extrabold tracking-[0.20em] uppercase ${bgClass}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
        {children}
    </span>
);

const PrimaryBtn = ({ to, children }) => (
    <Link
        to={to}
        className="inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(0,107,104,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,107,104,0.38)] active:translate-y-0"
    >
        {children}
        <ArrowRight size={16} strokeWidth={2.5} />
    </Link>
);

const SecondaryBtn = ({ to, children }) => (
    <Link
        to={to}
        className="inline-flex items-center gap-2 rounded-full border-2 border-neutral/20 bg-white/80 px-7 py-3.5 text-sm font-bold text-neutral backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:text-primary active:scale-[0.98]"
    >
        {children}
    </Link>
);

/* ─────────────────────────────────────────────────────────────────────────────
   VISUAL 1 — Find a Mess
   Scene: a stylized building / home with location elements and member avatars.
   All built with SVG shapes + Tailwind-positioned layers.
───────────────────────────────────────────────────────────────────────────── */
const Visual1 = () => (
    <div className="relative flex h-full w-full select-none items-center justify-center">

        {/* ── Background blobs ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-secondary/12 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/80 blur-2xl" />
        </div>

        {/* ── Main scene container ── */}
        <div className="relative z-10 flex flex-col items-center gap-4 py-6">

            {/* Building illustration */}
            <div className="relative">
                {/* Building SVG */}
                <svg width="220" height="200" viewBox="0 0 220 200" fill="none" className="drop-shadow-xl">
                    {/* Sky background */}
                    <rect width="220" height="200" rx="24" fill="#D5FBF9" />

                    {/* Decorative circles in sky */}
                    <circle cx="32" cy="36" r="12" fill="#006B68" opacity="0.15" />
                    <circle cx="188" cy="28" r="8" fill="#2E9B45" opacity="0.20" />
                    <circle cx="160" cy="48" r="5" fill="#FF8A00" opacity="0.30" />

                    {/* Ground */}
                    <rect x="0" y="158" width="220" height="42" rx="0" fill="#006B68" opacity="0.12" />

                    {/* Main building body */}
                    <rect x="54" y="72" width="112" height="92" rx="8" fill="white" stroke="#006B68" strokeWidth="1.5" />

                    {/* Roof */}
                    <path d="M44 76 L110 36 L176 76 Z" fill="#006B68" />
                    <path d="M44 76 L110 36 L176 76 Z" fill="none" stroke="#005554" strokeWidth="1" />

                    {/* Roof window / chimney accent */}
                    <rect x="98" y="44" width="24" height="16" rx="3" fill="#D5FBF9" opacity="0.6" />

                    {/* Windows row 1 */}
                    <rect x="70" y="90" width="28" height="22" rx="5" fill="#D5FBF9" stroke="#006B68" strokeWidth="1" />
                    <rect x="122" y="90" width="28" height="22" rx="5" fill="#D5FBF9" stroke="#006B68" strokeWidth="1" />
                    {/* Window cross bars */}
                    <line x1="84" y1="90" x2="84" y2="112" stroke="#006B68" strokeWidth="0.8" opacity="0.5" />
                    <line x1="70" y1="101" x2="98" y2="101" stroke="#006B68" strokeWidth="0.8" opacity="0.5" />
                    <line x1="136" y1="90" x2="136" y2="112" stroke="#006B68" strokeWidth="0.8" opacity="0.5" />
                    <line x1="122" y1="101" x2="150" y2="101" stroke="#006B68" strokeWidth="0.8" opacity="0.5" />

                    {/* Door */}
                    <rect x="94" y="128" width="32" height="36" rx="5" fill="#006B68" />
                    <circle cx="121" cy="148" r="2" fill="white" opacity="0.7" />

                    {/* Small green shrubs */}
                    <circle cx="60" cy="158" r="10" fill="#2E9B45" opacity="0.7" />
                    <circle cx="160" cy="158" r="10" fill="#2E9B45" opacity="0.7" />
                    <circle cx="54" cy="162" r="7" fill="#2E9B45" opacity="0.5" />
                    <circle cx="166" cy="162" r="7" fill="#2E9B45" opacity="0.5" />
                </svg>

                {/* Location pin floating above */}
                <div
                    className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-tertiary px-3.5 py-1.5 shadow-lg"
                    style={{ animation: "floatY 3s ease-in-out infinite" }}
                >
                    <MapPin size={12} className="text-white" strokeWidth={2.5} />
                    <span className="text-[10px] font-extrabold text-white">Mirpur-10, Dhaka</span>
                </div>
            </div>

            {/* Info strip */}
            <div className="flex w-full max-w-[280px] items-center gap-3 rounded-2xl border border-primary/15 bg-white px-4 py-3 shadow-[0_4px_20px_rgba(0,107,104,0.10)]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary">
                    <Home size={18} className="text-white" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-neutral">Green Valley Mess</p>
                    <div className="mt-0.5 flex items-center gap-2">
                        <Star size={10} className="text-tertiary" fill="currentColor" strokeWidth={0} />
                        <span className="text-[10px] font-bold text-neutral">4.8</span>
                        <span className="text-[10px] text-slate-400">· 2 seats left</span>
                    </div>
                </div>
                <span className="rounded-xl bg-secondary/15 px-2.5 py-1 text-[10px] font-extrabold text-secondary">Open</span>
            </div>

            {/* Member avatars */}
            <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                    {[
                        { bg: "#006B68", label: "A" },
                        { bg: "#2E9B45", label: "R" },
                        { bg: "#FF8A00", label: "S" },
                        { bg: "#173B3A", label: "M" },
                    ].map(({ bg, label }, i) => (
                        <span
                            key={i}
                            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-extrabold text-white shadow-sm"
                            style={{ background: bg }}
                        >
                            {label}
                        </span>
                    ))}
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-background text-[10px] font-extrabold text-primary shadow-sm">
                        +4
                    </span>
                </div>
                <p className="text-xs font-semibold text-neutral/60">8 members living here</p>
            </div>

        </div>

        <style>{`
            @keyframes floatY {
                0%, 100% { transform: translateX(-50%) translateY(0); }
                50%       { transform: translateX(-50%) translateY(-6px); }
            }
        `}</style>
    </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   VISUAL 2 — Manage Your Mess
   Scene: a stylized meal / grocery / finance composition.
   Central plate, surrounding orbit elements: bazar bag, wallet, calendar.
───────────────────────────────────────────────────────────────────────────── */
const Visual2 = () => (
    <div className="relative flex h-full w-full select-none items-center justify-center">

        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-10 top-10 h-60 w-60 rounded-full bg-secondary/12 blur-3xl" />
            <div className="absolute -bottom-10 right-0 h-52 w-52 rounded-full bg-primary/12 blur-3xl" />
            <div className="absolute right-10 top-10 h-24 w-24 rounded-full bg-tertiary/12 blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4 py-6">

            {/* Central composition */}
            <div className="relative flex h-[230px] w-[280px] items-center justify-center">

                {/* Outer ring decoration */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/15" />

                {/* Central plate card */}
                <div className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full bg-primary shadow-[0_8px_32px_rgba(0,107,104,0.30)]"
                    style={{ animation: "pulse-soft 3s ease-in-out infinite" }}
                >
                    <UtensilsCrossed size={28} className="text-white" strokeWidth={1.8} />
                    <p className="mt-1 text-[10px] font-extrabold text-white">24 Meals</p>
                    <p className="text-[8px] text-white/60">Today</p>
                </div>

                {/* Orbit: Bazar — top */}
                <div className="absolute left-1/2 top-1 flex -translate-x-1/2 flex-col items-center gap-1 rounded-2xl bg-white px-3 py-2.5 shadow-[0_4px_16px_rgba(0,107,104,0.12)]"
                    style={{ animation: "floatSlow 4s ease-in-out infinite" }}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary">
                        <ShoppingBasket size={16} className="text-white" strokeWidth={2} />
                    </div>
                    <p className="text-[9px] font-extrabold text-neutral">৳ 1,240</p>
                    <p className="text-[8px] text-slate-400">Bazar</p>
                </div>

                {/* Orbit: Expense — left */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 rounded-2xl bg-white px-3 py-2.5 shadow-[0_4px_16px_rgba(0,107,104,0.12)]"
                    style={{ animation: "floatSlow 4.5s ease-in-out infinite 0.5s" }}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral">
                        <Wallet size={16} className="text-white" strokeWidth={2} />
                    </div>
                    <p className="text-[9px] font-extrabold text-neutral">৳ 12,800</p>
                    <p className="text-[8px] text-slate-400">Monthly</p>
                </div>

                {/* Orbit: Balance — right */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 rounded-2xl bg-white px-3 py-2.5 shadow-[0_4px_16px_rgba(0,107,104,0.12)]"
                    style={{ animation: "floatSlow 3.8s ease-in-out infinite 1s" }}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-tertiary">
                        <Banknote size={16} className="text-white" strokeWidth={2} />
                    </div>
                    <p className="text-[9px] font-extrabold text-neutral">৳ 3,400</p>
                    <p className="text-[8px] text-slate-400">Balance</p>
                </div>

                {/* Orbit: Calendar — bottom */}
                <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 rounded-2xl bg-white px-3 py-2.5 shadow-[0_4px_16px_rgba(0,107,104,0.12)]"
                    style={{ animation: "floatSlow 5s ease-in-out infinite 0.2s" }}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/80">
                        <CalendarDays size={16} className="text-white" strokeWidth={2} />
                    </div>
                    <p className="text-[9px] font-extrabold text-neutral">Sep 2026</p>
                    <p className="text-[8px] text-slate-400">Schedule</p>
                </div>

            </div>

            {/* Bottom summary strip */}
            <div className="flex w-full max-w-[280px] items-center justify-between rounded-2xl bg-neutral px-5 py-3 shadow-[0_4px_20px_rgba(23,59,58,0.18)]">
                <div>
                    <p className="text-[10px] font-semibold text-white/50">Meal Rate</p>
                    <p className="text-base font-extrabold text-white">৳ 65 / meal</p>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle size={15} className="text-secondary" strokeWidth={2} />
                    <span className="text-xs font-bold text-secondary">All settled</span>
                </div>
            </div>

        </div>

        <style>{`
            @keyframes floatSlow {
                0%, 100% { transform: translateY(0) translateX(var(--tw-translate-x, 0)); }
                50%       { transform: translateY(-5px) translateX(var(--tw-translate-x, 0)); }
            }
            @keyframes pulse-soft {
                0%, 100% { box-shadow: 0 8px 32px rgba(0,107,104,0.30); }
                50%       { box-shadow: 0 12px 40px rgba(0,107,104,0.45); }
            }
        `}</style>
    </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   VISUAL 3 — Community / Better Living
   Scene: a social/community composition — member group, chat, expense sharing.
───────────────────────────────────────────────────────────────────────────── */
const Visual3 = () => (
    <div className="relative flex h-full w-full select-none items-center justify-center">

        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-12 top-8 h-64 w-64 rounded-full bg-secondary/12 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4 py-6">

            {/* Community banner card */}
            <div className="w-full max-w-[300px] overflow-hidden rounded-[22px] shadow-[0_8px_36px_rgba(23,59,58,0.14)]">

                {/* Header */}
                <div className="bg-primary px-5 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-semibold text-white/55">Mess Community</p>
                            <p className="mt-0.5 text-sm font-extrabold text-white">Green Valley Mess</p>
                        </div>
                        <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-[10px] font-bold text-white">
                            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                            8 Online
                        </span>
                    </div>

                    {/* Avatar row */}
                    <div className="mt-3 flex -space-x-3">
                        {[
                            { bg: "#D5FBF9", text: "#006B68", l: "A" },
                            { bg: "#2E9B45", text: "#fff",    l: "R" },
                            { bg: "#FF8A00", text: "#fff",    l: "S" },
                            { bg: "#173B3A", text: "#fff",    l: "M" },
                            { bg: "#D5FBF9", text: "#006B68", l: "T" },
                        ].map(({ bg, text, l }, i) => (
                            <span
                                key={i}
                                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary text-xs font-extrabold"
                                style={{ background: bg, color: text }}
                            >
                                {l}
                            </span>
                        ))}
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-white/20 text-[10px] font-extrabold text-white">
                            +3
                        </span>
                    </div>
                </div>

                {/* Expense split */}
                <div className="bg-white px-5 py-4">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-extrabold text-neutral">Monthly Settlement</p>
                        <p className="text-[10px] font-medium text-slate-400">September</p>
                    </div>
                    <div className="space-y-2.5">
                        {[
                            { name: "Arif",  amount: "৳ 1,600", paid: true },
                            { name: "Rakib", amount: "৳ 1,450", paid: false },
                            { name: "Sumon", amount: "৳ 1,600", paid: true },
                        ].map(({ name, amount, paid }) => (
                            <div key={name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[9px] font-extrabold text-primary">
                                        {name[0]}
                                    </span>
                                    <span className="text-xs font-semibold text-neutral">{name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-neutral">{amount}</span>
                                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${
                                        paid ? "bg-secondary/15 text-secondary" : "bg-tertiary/15 text-tertiary"
                                    }`}>
                                        {paid ? "Paid" : "Due"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat strip */}
                <div className="flex items-center gap-3 border-t border-gray-100 bg-background/60 px-5 py-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                        <MessageCircle size={14} className="text-white" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-semibold text-neutral">Arif: "Bazar done for today ✅"</p>
                        <p className="text-[9px] text-slate-400">just now · Mess Chat</p>
                    </div>
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[9px] font-extrabold text-white">
                        3
                    </span>
                </div>
            </div>

            {/* Floating expense share pill */}
            <div
                className="flex items-center gap-2.5 rounded-full border border-secondary/20 bg-white px-4 py-2.5 shadow-[0_4px_16px_rgba(46,155,69,0.12)]"
                style={{ animation: "floatY 3.5s ease-in-out infinite" }}
            >
                <HandCoins size={15} className="text-secondary" strokeWidth={2} />
                <span className="text-xs font-bold text-neutral">Shared expenses settled</span>
                <CheckCircle size={13} className="text-secondary" strokeWidth={2.5} />
            </div>

        </div>

        <style>{`
            @keyframes floatY {
                0%, 100% { transform: translateY(0); }
                50%       { transform: translateY(-6px); }
            }
        `}</style>
    </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   SLIDE BACKGROUNDS — each slide gets its own color story
───────────────────────────────────────────────────────────────────────────── */
const slideBg = [
    // Slide 1: warm teal + soft background
    "from-background via-white to-white",
    // Slide 2: very soft green tint
    "from-[#edfdf4] via-white to-white",
    // Slide 3: soft primary tint
    "from-[#e8f8f8] via-white to-white",
];

const rightBg = [
    "bg-background",
    "bg-[#edfdf4]",
    "bg-[#e8f8f8]",
];

/* ─────────────────────────────────────────────────────────────────────────────
   SLIDE DATA
───────────────────────────────────────────────────────────────────────────── */
const slides = [
    {
        badge: "FIND YOUR MESS",
        badgeBg: "bg-tertiary/10 text-tertiary border-tertiary/20",
        line1: "Find a Mess That",
        line2: "Feels Like Home.",
        accentColor: "text-primary",
        desc: "Discover suitable messes, connect with members, and find a comfortable place to live with MessHub.",
        primary:   { label: "Find a Mess",     to: "/find-mess" },
        secondary: { label: "Create Your Mess", to: "/register" },
        Visual: Visual1,
    },
    {
        badge: "SMART MESS MANAGEMENT",
        badgeBg: "bg-secondary/10 text-secondary border-secondary/20",
        line1: "Everything Your Mess Needs,",
        line2: "In One Place.",
        accentColor: "text-secondary",
        desc: "Manage meals, bazar, expenses, payments and monthly mess activities from one simple platform.",
        primary:   { label: "Get Started",  to: "/register" },
        secondary: { label: "How It Works", to: "/how-it-works" },
        Visual: Visual2,
    },
    {
        badge: "BETTER MESS LIVING",
        badgeBg: "bg-primary/10 text-primary border-primary/20",
        line1: "Better Mess Management.",
        line2: "Better Living.",
        accentColor: "text-primary",
        desc: "Stay connected with your mess members, manage shared expenses and keep everyday mess life organized.",
        primary:   { label: "Join MessHub",     to: "/register" },
        secondary: { label: "Explore Features", to: "/how-it-works" },
        Visual: Visual3,
    },
];

/* ─────────────────────────────────────────────────────────────────────────────
   BANNER
───────────────────────────────────────────────────────────────────────────── */
const Banner = () => (
    <section className="w-full overflow-x-hidden">

        <style>{`
            /* Swiper pagination dots */
            .mh-hero .swiper-pagination {
                bottom: 20px;
            }
            .mh-hero .swiper-pagination-bullet {
                width: 7px;
                height: 7px;
                background: #006B68;
                opacity: 0.20;
                border-radius: 999px;
                transition: all 0.4s ease;
                margin: 0 3px !important;
            }
            .mh-hero .swiper-pagination-bullet-active {
                width: 24px;
                opacity: 1;
                background: #006B68;
            }
        `}</style>

        <Swiper
            className="mh-hero"
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop
            speed={800}
            pagination={{ clickable: true }}
            grabCursor
        >
            {slides.map(({ badge, badgeBg, line1, line2, accentColor, desc, primary, secondary, Visual }, idx) => (
                <SwiperSlide key={idx}>
                    <div className={`flex min-h-[600px] flex-col bg-gradient-to-br ${slideBg[idx]} lg:min-h-[680px] lg:flex-row`}>

                        {/* ── LEFT — text ── */}
                        <div className="relative flex w-full flex-col justify-center overflow-hidden px-6 pb-6 pt-16 sm:px-10 lg:w-1/2 lg:px-14 lg:py-0 xl:px-20">

                            {/* Decorative corner blob */}
                            <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-primary/6" />
                            <div className="pointer-events-none absolute -bottom-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-secondary/4" />

                            <div className="relative z-10 max-w-xl">

                                {/* Badge */}
                                <Badge bgClass={badgeBg}>{badge}</Badge>

                                {/* Heading — large */}
                                <h1 className="mt-5 font-extrabold leading-[1.10] tracking-tight text-neutral"
                                    style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)" }}
                                >
                                    <span className="block">{line1}</span>
                                    <span className={`block ${accentColor}`}>{line2}</span>
                                </h1>

                                {/* Description */}
                                <p className="mt-5 max-w-[440px] text-[15px] leading-[1.8] text-slate-500">
                                    {desc}
                                </p>

                                {/* CTAs */}
                                <div className="mt-8 flex flex-wrap items-center gap-3 pb-10 lg:pb-0">
                                    <PrimaryBtn to={primary.to}>{primary.label}</PrimaryBtn>
                                    <SecondaryBtn to={secondary.to}>{secondary.label}</SecondaryBtn>
                                </div>

                                {/* Social proof strip */}
                                <div className="mt-6 hidden items-center gap-3 lg:flex">
                                    <div className="flex -space-x-2">
                                        {["#006B68", "#2E9B45", "#FF8A00"].map((c, i) => (
                                            <span
                                                key={i}
                                                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[9px] font-extrabold text-white"
                                                style={{ background: c }}
                                            >
                                                {["M", "A", "H"][i]}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs font-semibold text-slate-500">
                                        Trusted by <span className="font-extrabold text-neutral">1,200+</span> mess members
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* ── RIGHT — visual ── */}
                        <div className={`relative flex w-full items-center justify-center overflow-hidden ${rightBg[idx]} px-6 py-10 lg:w-1/2 lg:min-h-full lg:py-12`}>

                            {/* Decorative dot grid */}
                            <div
                                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                                style={{
                                    backgroundImage: "radial-gradient(#006B68 1.5px, transparent 1.5px)",
                                    backgroundSize: "24px 24px",
                                }}
                            />

                            {/* Decorative ring */}
                            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/10" />

                            <Visual />
                        </div>

                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    </section>
);

export default Banner;

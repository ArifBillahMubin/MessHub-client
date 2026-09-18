import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
    Utensils,
    ShoppingCart,
    ReceiptText,
    Users,
    Calculator,
    FileText,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   Feature data
───────────────────────────────────────────────────────────────────────────── */
const features = [
    {
        id: "meals",
        Icon: Utensils,
        title: "Meals",
        highlight: "Manage your meals effortlessly.",
        description:
            "Turn meals on or off with one tap, keep daily counts accurate, and avoid wasted food or accidental charges.",
        accentBg:   "bg-primary/10",
        accentText: "text-primary",
    },
    {
        id: "bazar",
        Icon: ShoppingCart,
        title: "Bazar",
        highlight: "Who bought what? No more guessing.",
        description:
            "Instantly enter bazar expenses, upload receipt photos, categorize grocery purchases, and maintain complete transparency.",
        accentBg:   "bg-secondary/10",
        accentText: "text-secondary",
    },
    {
        id: "expenses",
        Icon: ReceiptText,
        title: "Expenses",
        highlight: "Rent, gas, wifi & electricity tracked.",
        description:
            "Track recurring rent, gas, wifi, electricity, repair, and other shared expenses accurately across all occupants.",
        accentBg:   "bg-primary/10",
        accentText: "text-primary",
    },
    {
        id: "members",
        Icon: Users,
        title: "Member Management",
        highlight: "Everyone in the mess, organized.",
        description:
            "Manage active members, vacant seats, roles, join requests, and member information from one organized place.",
        accentBg:   "bg-tertiary/10",
        accentText: "text-tertiary",
    },
    {
        id: "settlement",
        Icon: Calculator,
        title: "Settlement",
        highlight: "Monthly settlement, ready.",
        description:
            "Automatically calculate each member's final balance, shared expenses, meal costs, and monthly dues without manual calculation errors.",
        accentBg:   "bg-secondary/10",
        accentText: "text-secondary",
    },
    {
        id: "reports",
        Icon: FileText,
        title: "Reports",
        highlight: "Close the month and keep the history.",
        description:
            "Downloadable monthly reports and permanent cloud records keep your mess history organized and easy to review.",
        accentBg:   "bg-primary/10",
        accentText: "text-primary",
    },
];

/* ─────────────────────────────────────────────────────────────────────────────
   SVG PATHS — OPEN lines only, never closed loops

   Desktop viewBox 600 × 440.
   Grid mapped to this viewBox (3 cols × 2 rows, gap ≈ 24 units):
     col-1  x: 0   – 188      col-2  x: 212 – 388      col-3  x: 412 – 600
     row-1  y: 0   – 196      row-2  y: 220 – 440
     horizontal gap centre y: 208
     row-1 vertical midpoint:  y = 98
     row-2 vertical midpoint:  y = 330

   Path goes (OPEN — never returns to start):
     ① Start at centre of col-1 right edge row-1: (188, 98)
     ② Across gap to col-2 left edge:              (212, 98)
     ③ Across col-2 right edge:                    (388, 98)
     ④ Across gap to col-3 left edge:              (412, 98)
     ⑤ Right edge of col-3 row-1 → small curve:   (600, 98)
     ⑥ Down the right side through the row gap:   (600, 220) via Q corner
     ⑦ Continue down into row-2:                  (600, 330)
     ⑧ Left across row-2 col-3 → col-2 gap:       (412, 330)
     ⑨ Cross gap:                                  (388, 330)
     ⑩ Across col-2 → col-1 gap:                  (212, 330)
     ⑪ End at col-1 left edge:                     (0,   330)

   Q bezier only at the right-side corner (⑤→⑦).
   This produces an open "S-bend" / hook shape, not a rectangle.
───────────────────────────────────────────────────────────────────────────── */
const DESKTOP_PATH =
    // row-1: left to right
    "M 188 98 L 212 98 L 388 98 L 412 98 L 600 98 " +
    // round corner going down on the right
    "Q 624 98 624 122 L 624 306 Q 624 330 600 330 " +
    // row-2: right to left  (OPEN — no return to start)
    "L 412 330 L 388 330 L 212 330 L 0 330";

/* Mobile: simple vertical open line down the left side */
const MOBILE_PATH = "M 24 0 L 24 2000";

/* Measure a path's total length using a hidden temporary SVG */
const measurePath = (d) => {
    if (typeof document === "undefined") return 2000;
    const ns   = "http://www.w3.org/2000/svg";
    const svg  = document.createElementNS(ns, "svg");
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", d);
    svg.setAttribute("style", "position:absolute;visibility:hidden;width:0;height:0");
    svg.appendChild(path);
    document.body.appendChild(svg);
    const len = path.getTotalLength();
    document.body.removeChild(svg);
    return len;
};

/* ─────────────────────────────────────────────────────────────────────────────
   MessFeatures
───────────────────────────────────────────────────────────────────────────── */
const MessFeatures = () => {
    const sectionRef    = useRef(null);
    const headerRef     = useRef(null);
    const desktopSvgRef = useRef(null);
    const mobileSvgRef  = useRef(null);
    // individual card refs stored in a stable array
    const cardRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* ── Pre-set initial states so there is NO flash of invisible content
               if the observer fires slowly.  We use gsap.set() only after the
               timeline is about to play (inside the observer callback). ── */

            const headerEls = Array.from(headerRef.current?.children ?? []);
            const cards     = cardRefs.current.filter(Boolean);

            // Build timeline — DO NOT use .from() which immediately sets opacity:0.
            // Use .fromTo() so the final "to" state is always explicit.
            const tl = gsap.timeline({
                paused: true,
                defaults: { ease: "power3.out" },
            });

            // 1. Header children
            if (headerEls.length) {
                tl.fromTo(
                    headerEls,
                    { opacity: 0, y: 22 },
                    { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 },
                );
            }

            // 2. Cards — stagger upward
            if (cards.length) {
                tl.fromTo(
                    cards,
                    { opacity: 0, y: 26 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.09 },
                    "-=0.2",
                );
            }

            // 3. Desktop SVG line draw
            const dPath = desktopSvgRef.current?.querySelector("path");
            if (dPath) {
                const len = measurePath(DESKTOP_PATH);
                dPath.style.strokeDasharray  = len;
                dPath.style.strokeDashoffset = len;
                tl.to(
                    dPath,
                    { strokeDashoffset: 0, duration: 2.6, ease: "power2.inOut" },
                    "-=0.35",
                );
            }

            // 3b. Mobile SVG line draw
            const mPath = mobileSvgRef.current?.querySelector("path");
            if (mPath) {
                const len = measurePath(MOBILE_PATH);
                mPath.style.strokeDasharray  = len;
                mPath.style.strokeDashoffset = len;
                tl.to(
                    mPath,
                    { strokeDashoffset: 0, duration: 2.6, ease: "power2.inOut" },
                    "<",
                );
            }

            /* ── IntersectionObserver: play once when section enters viewport ── */
            let played = false;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !played) {
                        played = true;
                        tl.play();
                        observer.disconnect();
                    }
                },
                { threshold: 0.08 },
            );

            if (sectionRef.current) observer.observe(sectionRef.current);

            return () => observer.disconnect();
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        /* NO background color on the section — transparent, inherits page bg */
        <section
            ref={sectionRef}
            className="relative w-full px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
        >
            <div className="mx-auto max-w-7xl">

                {/* ── Section header ── */}
                <div ref={headerRef} className="mb-12">
                    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-secondary">
                        Complete Peace of Mind
                    </p>
                    <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-neutral sm:text-4xl lg:text-5xl">
                        Goodbye, messy calculations.
                    </h2>
                    <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-slate-500">
                        Mess life is fun when the accounts don't end up in arguments.
                    </p>
                </div>

                {/* ── Grid + SVG wrapper ── */}
                <div className="relative">

                    {/* DESKTOP SVG — z-0, behind cards, open path only */}
                    <svg
                        ref={desktopSvgRef}
                        viewBox="0 0 648 440"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full md:block"
                    >
                        <path
                            d={DESKTOP_PATH}
                            fill="none"
                            stroke="#006B68"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.18"
                        />
                    </svg>

                    {/* MOBILE SVG — z-0, behind cards */}
                    <svg
                        ref={mobileSvgRef}
                        viewBox="0 0 48 2000"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 left-0 z-0 block w-6 md:hidden"
                        style={{ height: "100%" }}
                    >
                        <path
                            d={MOBILE_PATH}
                            fill="none"
                            stroke="#006B68"
                            strokeWidth="3"
                            strokeLinecap="round"
                            opacity="0.18"
                        />
                    </svg>

                    {/* CARDS — z-10, always on top of SVG */}
                    <div className="relative  z-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map(({ id, Icon, title, highlight, description, accentBg, accentText }, idx) => (
                            <div
                                key={id}
                                ref={(el) => { cardRefs.current[idx] = el; }}
                                className="
                                    bg-background group flex flex-col gap-3
                                    rounded-2xl border border-gray-100 p-6
                                    shadow-[0_2px_14px_rgba(23,59,58,0.06)]
                                    transition-all duration-300 ease-out
                                    hover:-translate-y-1.5
                                    hover:shadow-[0_10px_32px_rgba(23,59,58,0.13)]
                                "
                            >
                                {/* Icon container */}
                                <div
                                    className={`
                                        inline-flex h-11 w-11 items-center justify-center
                                        rounded-xl ${accentBg}
                                        transition-transform duration-300 group-hover:scale-110
                                    `}
                                >
                                    <Icon
                                        size={20}
                                        className={`${accentText} transition-transform duration-300 group-hover:scale-105`}
                                        strokeWidth={1.9}
                                    />
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-extrabold text-neutral">
                                    {title}
                                </h3>

                                {/* Highlight */}
                                <p className={` font-bold italic leading-snug ${accentText}`}>
                                    {highlight}
                                </p>

                                {/* Description */}
                                <p className="text-sm leading-[1.75] text-gray-700">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MessFeatures;

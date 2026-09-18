import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SearchCheck, Send, UserCheck, Handshake } from "lucide-react";

/*  data  */
const steps = [
    {
        number: "01",
        Icon: SearchCheck,
        title: "Find a Mess",
        description:
            "Browse verified bachelor flats with genuine photos, exact vacancy details, and real monthly meal cost estimates.",
        iconBg:    "bg-primary/10",
        iconColor: "text-primary",
        numColor:  "text-primary/10",
    },
    {
        number: "02",
        Icon: Send,
        title: "Show Interest",
        description:
            "Send a direct digital join request to the Mess Manager with your student or professional profile in one click.",
        iconBg:    "bg-secondary/10",
        iconColor: "text-secondary",
        numColor:  "text-secondary/10",
    },
    {
        number: "03",
        Icon: UserCheck,
        title: "Get Confirmed",
        description:
            "Chat with the Manager in real-time, visit the flat in person, and lock your seat before moving in.",
        iconBg:    "bg-primary/10",
        iconColor: "text-primary",
        numColor:  "text-primary/10",
    },
    {
        number: "04",
        Icon: Handshake,
        title: "Join the Mess",
        description:
            "Seamlessly onboard, log daily meals, upload bazar slips, and settle monthly accounts on MessHub effortlessly.",
        iconBg:    "bg-tertiary/10",
        iconColor: "text-tertiary",
        numColor:  "text-tertiary/10",
    },
];

const HowItWorks = () => {
    const sectionRef = useRef(null);
    const headerRef  = useRef(null);
    const lineRef    = useRef(null);
    // card refs — one per step
    const cardRefs   = useRef([]);

    useEffect(() => {
        const section = sectionRef.current;

        // build the GSAP timeline (paused until IO fires) 
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ paused: true });

            // 1. Header fades up
            tl.from(headerRef.current, {
                opacity: 0,
                y: 28,
                duration: 0.65,
                ease: "power3.out",
            });

            // 2. Centre line reveals top  bottom
            tl.from(
                lineRef.current,
                {
                    scaleY: 0,
                    transformOrigin: "top center",
                    duration: 0.9,
                    ease: "power2.inOut",
                },
                "-=0.3",   // overlap slightly with header
            );

            // 3. Cards appear in top-to-bottom order with stagger
            tl.from(
                cardRefs.current,
                {
                    opacity: 0,
                    y: 32,
                    duration: 0.65,
                    ease: "power3.out",
                    stagger: 0.18,
                },
                "-=0.5",   // start while line is still drawing
            );

            // --- IntersectionObserver — play once when section visible ---
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        tl.play();
                        observer.disconnect();
                    }
                },
                { threshold: 0.12 },
            );
            observer.observe(section);

            return () => observer.disconnect();
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-full overflow-hidden bg-background px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
        >
            <div className="mx-auto max-w-5xl">

                {/*  Section header  */}
                <div ref={headerRef} className="mb-14 text-center">
                    <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">
                        Step-by-Step Flow
                    </p>
                    <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-neutral sm:text-4xl">
                        Finding a mess is easier than finding a roommate.
                    </h2>
                    <p className="mx-auto mt-4 max-w-lg text-[14px] leading-relaxed text-slate-500">
                        Zero brokerage, zero middleman awkwardness. Fully digitized bachelor living.
                    </p>
                </div>

              
                <div className="relative">

                    {/*  Centre vertical line (desktop) / left line (mobile)  */}
                    <div
                        ref={lineRef}
                        className="
                            absolute top-0 h-full w-0.5 bg-primary/20
                            /* mobile: line sits at left-5 (20px) */
                            left-5
                            /* md+: line snaps to horizontal centre */
                            md:left-1/2 md:-translate-x-px
                        "
                    />

                    {/*  Steps  */}
                    <div className="flex flex-col gap-10 md:gap-14">
                        {steps.map(({ number, Icon, title, description, iconBg, iconColor, numColor }, idx) => {
                            const isLeft = idx % 2 === 0; // 01,03 → left; 02,04 → right

                            return (
                                <div
                                    key={number}
                                    ref={(el) => { cardRefs.current[idx] = el; }}
                                    className={`
                                        relative flex items-center
                                        /* mobile: always left-to-right, card starts after the left line */
                                        pl-16
                                        /* md+: alternating alignment */
                                        md:pl-0
                                        ${isLeft
                                            ? "md:justify-start"
                                            : "md:justify-end"}
                                    `}
                                >
                                    {/*  Timeline node  */}
                                    <div
                                        className="
                                            /* mobile: node on the left line */
                                            absolute left-5 -translate-x-1/2
                                            /* md+: node on the centre line */
                                            md:left-1/2 md:-translate-x-1/2
                                            z-10
                                            flex h-5 w-5 items-center justify-center
                                            rounded-full bg-primary
                                            ring-4 ring-primary/20
                                        "
                                        aria-hidden="true"
                                    >
                                        <span className="h-2 w-2 rounded-full bg-white" />
                                    </div>

                                    {/*  Card  */}
                                    <div
                                        className="
                                            group relative overflow-hidden
                                            w-full
                                            md:w-5/12
                                            rounded-2xl bg-white p-6
                                            shadow-[0_2px_16px_rgba(23,59,58,0.08)]
                                            transition-all duration-300
                                            hover:-translate-y-1.5
                                            hover:shadow-[0_10px_32px_rgba(23,59,58,0.14)]
                                        "
                                    >
                                        {/* Large ghost step number */}
                                        <span
                                            className={`pointer-events-none absolute right-4 top-2 select-none text-7xl font-extrabold leading-none ${numColor}`}
                                            aria-hidden="true"
                                        >
                                            {number}
                                        </span>

                                        {/* Icon */}
                                        <div
                                            className={`
                                                relative z-10 mb-4 inline-flex h-11 w-11
                                                items-center justify-center rounded-xl
                                                ${iconBg}
                                                transition-transform duration-300
                                                group-hover:scale-110
                                            `}
                                        >
                                            <Icon
                                                size={20}
                                                className={`${iconColor} transition-transform duration-300 group-hover:scale-105`}
                                                strokeWidth={1.9}
                                            />
                                        </div>

                                        {/* Title */}
                                        <h3 className="relative z-10 mb-2 text-lg font-extrabold text-neutral">
                                            {title}
                                        </h3>

                                        {/* Description */}
                                        <p className="relative z-10 text-sm leading-[1.75] text-gray-700">
                                            {description}
                                        </p>

                                        {/* Step number pill — bottom left */}
                                        <span className="mt-4 inline-block rounded-full bg-primary/8 px-3 py-0.5 text-[10px] font-extrabold tracking-wider text-primary">
                                            Step {number}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HowItWorks;

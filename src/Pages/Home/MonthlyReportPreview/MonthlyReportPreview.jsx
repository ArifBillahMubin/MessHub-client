import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
    CheckCircle2,
    LockKeyhole,
    Download,
    Mail,
} from "lucide-react";

/* Static mock data — replace with backend data later */
const reportSummary = [
    { label: "Total Bazar",  value: "৳34,686", accent: false },
    { label: "Total Meals",  value: "820",      accent: false },
    { label: "Meal Rate",    value: "৳42.30",   accent: true  },
];

const memberLines = [
    { label: "54 Meals @ ৳42.30",              value: "৳2,284.20",   negative: false },
    { label: "Room Rent Share",                 value: "৳4,500.00",   negative: false },
    { label: "Utilities (Wifi, Gas, Khala Bill)", value: "৳850.00",   negative: false },
    { label: "Advance Deposit Paid",            value: "- ৳7,000.00", negative: true  },
];

const benefits = [
    "Verified Calculations with Zero Discrepancy",
    "Meal rate auto-split based on real bazar expenditure",
    "Transparency guaranteed for both managers and roommates",
];

const MonthlyReportPreview = () => {
    const sectionRef    = useRef(null);
    const leftRef       = useRef(null);
    const cardRef       = useRef(null);

    /* internal card section refs — animated in sequence */
    const cardHeaderRef  = useRef(null);
    const cardStatsRef   = useRef(null);
    const cardMemberRef  = useRef(null);
    const cardBalanceRef = useRef(null);
    const cardFooterRef  = useRef(null);
    const badgeRef       = useRef(null); /* "Settlement Ready" — micro-pulse */

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

            /* 1. Left content slides in from left */
            tl.fromTo(
                leftRef.current,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.7 },
            );

            /* 2. Card enters from the right */
            tl.fromTo(
                cardRef.current,
                { opacity: 0, x: 40 },
                { opacity: 1, x: 0, duration: 0.75 },
                "-=0.45",
            );

            /* 3. Internal card sections stagger upward */
            const internalEls = [
                cardHeaderRef.current,
                cardStatsRef.current,
                cardMemberRef.current,
                cardBalanceRef.current,
                cardFooterRef.current,
            ].filter(Boolean);

            tl.fromTo(
                internalEls,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
                "-=0.5",
            );

            /* 4. Micro-pulse on "Settlement Ready" badge — runs once after card settles */
            if (badgeRef.current) {
                tl.fromTo(
                    badgeRef.current,
                    { scale: 1 },
                    {
                        scale: 1.06,
                        duration: 0.22,
                        ease: "power1.inOut",
                        yoyo: true,
                        repeat: 1,
                    },
                    "+=0.15",
                );
            }

            /* IntersectionObserver — play once */
            let played = false;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !played) {
                        played = true;
                        tl.play();
                        observer.disconnect();
                    }
                },
                { threshold: 0.1 },
            );
            if (sectionRef.current) observer.observe(sectionRef.current);
            return () => observer.disconnect();
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-full px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-14">

                    {/* LEFT — text content*/}
                    <div ref={leftRef} className="w-full lg:w-[42%]">

                        {/* Eyebrow badge */}
                        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-secondary/25 bg-secondary/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-secondary">
                            <Mail size={12} strokeWidth={2.5} />
                            Automated Email Dispatch
                        </span>

                        {/* Heading */}
                        <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-neutral sm:text-5xl">
                            Month closed?<br />
                            <span className="text-primary">Report handled.</span>
                        </h2>

                        {/* Subtitle */}
                        <p className="mt-5 max-w-md  leading-[1.8] text-gray-800">
                            Once the Mess Manager closes the monthly portal, MessHub generates
                            the final comprehensive statement and automatically sends it to
                            every active member's registered email.
                        </p>

                        {/* Benefit points */}
                        <ul className="mt-6 space-y-3">
                            {benefits.map((b) => (
                                <li key={b} className="flex items-start gap-3">
                                    <CheckCircle2
                                        size={17}
                                        className="mt-0.5 shrink-0 text-secondary"
                                        strokeWidth={2}
                                    />
                                    <span className="text-sm leading-relaxed text-gray-700">
                                        {b}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* RIGHT — report preview card */}
                    <div
                        ref={cardRef}
                        className="
                            w-full lg:w-[58%]
                            rounded-2xl border border-gray-200 bg-white
                            shadow-[0_4px_32px_rgba(23,59,58,0.10)]
                            transition-all duration-300 ease-out
                            hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(23,59,58,0.15)]
                        "
                    >
                        {/*  Card header  */}
                        <div
                            ref={cardHeaderRef}
                            className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5"
                        >
                            <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-extrabold text-white">
                                    MH
                                </div>
                                <div>
                                    <p className="text-[13px] font-extrabold text-neutral">
                                        MessHub Automated Statement
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                        To: sakib.ahmed@student.edu
                                    </p>
                                </div>
                            </div>
                            <span className="mt-0.5 shrink-0 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-extrabold text-primary">
                                September 2026
                            </span>
                        </div>

                        {/*  Summary stats  */}
                        <div
                            ref={cardStatsRef}
                            className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100"
                        >
                            {reportSummary.map(({ label, value, accent }) => (
                                <div
                                    key={label}
                                    className={`px-5 py-4 ${accent ? "bg-secondary/8" : ""}`}
                                >
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                        {label}
                                    </p>
                                    <p className={`mt-1 text-xl font-extrabold ${accent ? "text-secondary" : "text-neutral"}`}>
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/*  Member statement  */}
                        <div ref={cardMemberRef} className="px-6 py-5">

                            {/* Member row header */}
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <p className="text-[13px] font-extrabold text-neutral">
                                    Sakib Ahmed (Room 302)
                                </p>
                                <span
                                    ref={badgeRef}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[10px] font-extrabold text-white"
                                >
                                    Settlement Ready
                                </span>
                            </div>

                            {/* Line items */}
                            <div className="space-y-2.5">
                                {memberLines.map(({ label, value, negative }) => (
                                    <div key={label} className="flex items-center justify-between">
                                        <p className="text-[12px] text-slate-500">{label}</p>
                                        <p className={`text-[12px] font-bold ${negative ? "text-secondary" : "text-neutral"}`}>
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/*  Net final position  */}
                        <div
                            ref={cardBalanceRef}
                            className="mx-6 mb-5 flex items-center justify-between rounded-xl bg-primary/6 px-5 py-3.5"
                        >
                            <p className="text-[12px] font-extrabold text-neutral">
                                Net Final Position:
                            </p>
                            <p className="text-[15px] font-extrabold text-primary">
                                ৳634.20 Refundable
                            </p>
                        </div>

                        {/*  Card footer  */}
                        <div
                            ref={cardFooterRef}
                            className="flex items-center justify-between border-t border-gray-100 px-6 py-4"
                        >
                            <div className="flex items-center gap-2 text-slate-400">
                                <LockKeyhole size={13} strokeWidth={2} />
                                <span className="text-[11px] font-semibold">
                                    Digitally signed report
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-primary">
                                <Download size={13} strokeWidth={2} />
                                <span className="text-[11px] font-bold">
                                    Download PDF Slip
                                </span>
                            </div>
                        </div>

                    </div>
                    {/* end right card */}

                </div>
            </div>
        </section>
    );
};

export default MonthlyReportPreview;

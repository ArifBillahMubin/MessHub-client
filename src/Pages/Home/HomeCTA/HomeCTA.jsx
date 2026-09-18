import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router";
import { Rocket, MapPin, Sparkles } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   HomeCTA
───────────────────────────────────────────────────────────────────────────── */
const HomeCTA = () => {
    const sectionRef = useRef(null);
    const badgeRef = useRef(null);
    const headingRef = useRef(null);
    const subRef = useRef(null);
    const btnsRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                paused: true,
                defaults: { ease: "power3.out" },
            });

            tl.fromTo(badgeRef.current,
                { opacity: 0, y: 18 },
                { opacity: 1, y: 0, duration: 0.55 },
            );
            tl.fromTo(headingRef.current,
                { opacity: 0, y: 22 },
                { opacity: 1, y: 0, duration: 0.65 },
                "-=0.3",
            );
            tl.fromTo(subRef.current,
                { opacity: 0, y: 18 },
                { opacity: 1, y: 0, duration: 0.55 },
                "-=0.35",
            );
            tl.fromTo(btnsRef.current,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.55 },
                "-=0.3",
            );

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
                { threshold: 0.15 },
            );
            if (sectionRef.current) observer.observe(sectionRef.current);
            return () => observer.disconnect();
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        /* Section wrapper — transparent, no background */
        <section
            ref={sectionRef}
            className="w-full px-4 py-10 sm:px-6 lg:px-8"
        >
            {/* CTA container — vibrant multi-tone gradient + rounded + compact */}
            <div
                className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl px-8 py-10 text-center shadow-[0_8px_48px_rgba(0,107,104,0.28)] sm:px-14 md:py-12"
                style={{
                    background:
                        "linear-gradient(130deg, #005450 0%, #006B68 25%, #007d50 55%, #2E9B45 80%, #1a7a2e 100%)",
                }}
            >
                {/* ── Decorative blobs — behind content ── */}
                <div className="pointer-events-none absolute inset-0 z-0">
                    {/* Primary teal glow — top-left */}
                    <div
                        className="absolute -left-20 -top-20 h-80 w-80 rounded-full opacity-30 blur-3xl"
                        style={{ background: "#006B68" }}
                    />
                    {/* Secondary green glow — bottom-right */}
                    <div
                        className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full opacity-35 blur-3xl"
                        style={{ background: "#2E9B45" }}
                    />
                    {/* Tertiary orange accent — top-right, very subtle */}
                    <div
                        className="absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-20 blur-2xl"
                        style={{ background: "#FF8A00" }}
                    />
                    {/* Centre soft light glow */}
                    <div
                        className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.10] blur-3xl"
                        style={{ background: "#D5FBF9" }}
                    />
                    {/* Decorative rings */}
                    <div
                        className="absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07]"
                        style={{ border: "1.5px solid #ffffff" }}
                    />
                    <div
                        className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.05]"
                        style={{ border: "1.5px solid #ffffff" }}
                    />
                    {/* Small tertiary dot accent — bottom-left */}
                    <div
                        className="absolute bottom-8 left-12 h-5 w-5 rounded-full opacity-40 blur-sm"
                        style={{ background: "#FF8A00" }}
                    />
                    <div
                        className="absolute bottom-14 left-20 h-3 w-3 rounded-full opacity-30"
                        style={{ background: "#FF8A00" }}
                    />
                </div>

                {/* ── Content ── */}
                <div className="relative z-10 flex flex-col items-center gap-2">

                    {/* Badge */}
                    <span
                        ref={badgeRef}
                        className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-bold tracking-[0.12em] text-white/90 backdrop-blur-sm"
                    >
                        <Sparkles size={12} strokeWidth={2.5} />
                        Built for Dhaka &amp; Nationwide Bachelor Flats
                    </span>

                    {/* Heading — large */}
                    <h2
                        ref={headingRef}
                        className="max-w-6xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-3xl md:text-5xl lg:text-5xl"
                    >
                        Ready to make mess life<br className="hidden sm:block" /> a little less messy?
                    </h2>

                    {/* Subtitle */}
                    <p
                        ref={subRef}
                        className="mt-1 max-w-2xl text-base font-medium leading-relaxed text-gray-300 md:text-lg"
                    >
                        Create your mess, invite your members and let MessHub handle the
                        rest. Free forever for up to 8 members.
                    </p>

                    {/* Buttons */}
                    <div
                        ref={btnsRef}
                        className="mt-3 flex flex-wrap items-center justify-center gap-3"
                    >
                        {/* Primary */}
                        <Link
                            to="/register"
                            className="
                                inline-flex items-center gap-2.5
                                rounded-full bg-white px-7 py-3.5
                                text-sm font-bold text-primary
                                shadow-[0_4px_18px_rgba(0,0,0,0.18)]
                                transition-all duration-200
                                hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.22)]
                                active:translate-y-0
                            "
                        >
                            <Rocket size={16} strokeWidth={2.5} />
                            Get Started Free
                        </Link>

                        {/* Secondary */}
                        <Link
                            to="/find-mess"
                            className="
                                inline-flex items-center gap-2.5
                                rounded-full border border-white/30 bg-white/10 px-7 py-3.5
                                text-sm font-bold text-white
                                backdrop-blur-sm
                                transition-all duration-200
                                hover:-translate-y-0.5 hover:bg-white/20
                                active:translate-y-0
                            "
                        >
                            <MapPin size={16} strokeWidth={2.5} />
                            Find a Mess
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HomeCTA;

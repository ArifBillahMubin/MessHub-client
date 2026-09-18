/**
 * Loading.jsx
 * Full-screen centered loader for MessHub.
 * Uses only Tailwind CSS utility classes + MessHub @theme tokens.
 * No external libraries, no DaisyUI, no separate CSS file.
 */

const Loading = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">

            {/* ── Spinner ring cluster ─────────────────────────────────────── */}
            <div className="relative flex items-center justify-center">

                {/* Outer ring — primary, slow spin */}
                <span
                    className="absolute h-20 w-20 rounded-full border-[3px] border-transparent border-t-primary animate-spin"
                    style={{ animationDuration: "1.1s" }}
                />

                {/* Middle ring — secondary, reverse medium spin */}
                <span
                    className="absolute h-14 w-14 rounded-full border-[3px] border-transparent border-t-secondary animate-spin"
                    style={{ animationDuration: "0.75s", animationDirection: "reverse" }}
                />

                {/* Inner ring — tertiary, fast spin */}
                <span
                    className="absolute h-8 w-8 rounded-full border-[2px] border-transparent border-t-tertiary animate-spin"
                    style={{ animationDuration: "0.5s" }}
                />

                {/* Centre dot */}
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />

            </div>

            {/* ── Brand label ─────────────────────────────────────────────── */}
            <div className="mt-10 flex flex-col items-center gap-1.5">
                <p className="text-[15px] font-bold tracking-[0.18em] uppercase text-neutral">
                    MessHub
                </p>
                <p className="text-xs font-medium tracking-wide text-primary/60 animate-pulse">
                    Loading, please wait…
                </p>
            </div>

            {/* ── Progress bar ─────────────────────────────────────────────── */}
            <div className="mt-6 h-0.5 w-32 overflow-hidden rounded-full bg-primary/15">
                <div
                    className="h-full w-1/2 rounded-full bg-primary animate-[shimmer_1.4s_ease-in-out_infinite]"
                    style={{
                        backgroundImage:
                            "linear-gradient(90deg, transparent 0%, #006B68 40%, #2E9B45 60%, transparent 100%)",
                        animation: "shimmer 1.4s ease-in-out infinite",
                    }}
                />
            </div>

            {/* ── Keyframe (injected inline via a <style> tag) ─────────────── */}
            <style>{`
                @keyframes shimmer {
                    0%   { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
            `}</style>

        </div>
    );
};

export default Loading;

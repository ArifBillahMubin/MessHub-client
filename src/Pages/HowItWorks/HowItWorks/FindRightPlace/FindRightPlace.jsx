import {   FiCheck } from "react-icons/fi";
import {   TbMessages } from "react-icons/tb";

const phases = [
  {
    number: 1,
    title: "Interest",
    desc: "Member browses post & taps apply",
  },
  {
    number: 2,
    title: "Join Request",
    desc: "Profile shared with seat preference",
  },
  {
    number: 3,
    title: "Manager Review",
    desc: "Current manager verifies vacancy",
  },
  {
    number: 4,
    title: "Confirmation",
    desc: "Security deposit & rules verified",
  },
];

const FindRightPlace = () => {
  return (
    <section className="mx-auto max-w-7xl  px-4 py-14 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">

        <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Found the right place?
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          A seamless digital onboarding journey from application to
          community onboarding.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {phases.map((phase) => (
          <div
            key={phase.number}
            className="group relative overflow-hidden rounded-2xl border border-cyan-100 bg-cyan-50 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Fill overlay that rises from the bottom on hover */}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-green-300 transition-all duration-500 ease-out group-hover:h-full" />

            {/* Content (must stay above the overlay) */}
            <div className="relative z-10">
              <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white transition-colors duration-500 group-hover:bg-emerald-700">
                {phase.number}
              </div>

              <h3 className="text-sm font-bold text-slate-900">
                {phase.title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {phase.desc}
              </p>
            </div>
          </div>
        ))}

        {/* Final "You're In!" card - same initial color + same hover fill/lift as the rest */}
        <div className="group relative overflow-hidden rounded-2xl border border-cyan-100 bg-cyan-50 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          {/* Fill overlay that rises from the bottom on hover */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-green-300 transition-all duration-500 ease-out group-hover:h-full" />

          {/* Content (must stay above the overlay) */}
          <div className="relative z-10">
            <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-white transition-colors duration-500 group-hover:bg-emerald-700">
              <FiCheck className="h-4 w-4" />
            </div>

            <h3 className="text-sm font-bold text-slate-900">
              You're In!
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Full member ledger access unlocked
            </p>
          </div>
        </div>
      </div>

      {/* Bottom banner */}
      <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
            <TbMessages className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">
              Instant Community Access
            </p>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Once confirmed, members get instant access to the mess ledger,
              daily meal toggles, and the dedicated flat group chat.
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-white">
          Zero Onboarding Delay
        </span>
      </div>
    </section>
  );
};

export default FindRightPlace;
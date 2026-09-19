import { FiSearch, FiPlusCircle } from "react-icons/fi";

const FooterBanner = () => {
  return (
    <section className="px-5 py-10 sm:px-8 bg-white">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-900 px-6 py-14 text-center sm:px-10">
        {/* Decorative blurred blobs */}
        <div className="pointer-events-none absolute -left-10 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />

        {/* Content */}
        <div className="relative">
          <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-bold tracking-wide text-white/90 backdrop-blur">
            ZERO FRICTION LIVING
          </span>

          <h2 className="mt-5 text-2xl font-extrabold leading-tight text-white sm:text-4xl">
            Ready to make mess life easier?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-teal-50/80 sm:text-base">
            Create your mess or find a place that feels like home. Join
            hundreds of students and bachelors who ditched the pen-and-paper
            hassles.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button className="inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-900">
              <FiSearch className="h-4 w-4" />
              Find a Mess
            </button>

            <button className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-6 py-3 text-sm font-bold text-emerald-900 transition hover:bg-cyan-200">
              <FiPlusCircle className="h-4 w-4" />
              Create Your Mess
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterBanner;
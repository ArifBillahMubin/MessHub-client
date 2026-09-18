import {
  FiSearch,
  FiMapPin,
  FiNavigation,
} from "react-icons/fi";
import { MdOutlineMessage } from "react-icons/md";
import { PiBuildingApartmentDuotone } from "react-icons/pi";
import {   TbCurrencyTaka } from "react-icons/tb";

const steps = [
  {
    tag: "Step 01",
    tagColor: "bg-orange-100 text-orange-600",
    icon: <FiSearch className="h-5 w-5" />,
    title: "Browse Messes",
    desc: "Browse public mess posts, filter by budget, location, and explore available bachelor seats without middleman fees.",
  },
  {
    tag: "Step 02",
    tagColor: "bg-emerald-100 text-emerald-600",
    icon: <PiBuildingApartmentDuotone className="h-5 w-5" />,
    title: "Check Details",
    desc: "View rent, estimated daily meal cost, cook (বুয়া) schedule, Wi-Fi, electricity provisions, and exact seat allocation.",
  },
  {
    tag: "Step 03",
    tagColor: "bg-emerald-100 text-emerald-600",
    icon: <MdOutlineMessage className="h-5 w-5" />,
    title: "Show Interest",
    desc: "Send a join request directly and communicate securely with the active Mess Manager in one click.",
  },
];

const FindMess = () => {
  return (
    <section className="bg-white mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Looking for a mess?
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Discover available bachelor messes and shared flats around your
            preferred area without broker hassles.
          </p>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-cyan-50 px-3.5 py-1.5 text-xs font-semibold text-cyan-700">
          <FiMapPin className="h-3.5 w-3.5" />
          Dhaka, Ctg, Sylhet &amp; more
        </span>
      </div>

      {/* Content */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* ===== Left: Info Card ===== */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live Seat Radar
            </span>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              Mirpur 10 • Dhanmondi
            </span>
          </div>

          <div className="rounded-2xl bg-green-100 p-4">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                  <PiBuildingApartmentDuotone className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Green Garden Flat 4B
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <FiMapPin className="h-3 w-3" />
                    Road 7, Sector 3, Uttara
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-black">
                2 Seats Vacant
              </span>
            </div>

            {/* Stats row */}
            <div className="mt-4 grid grid-cols-3 divide-x divide-slate-200 rounded-xl bg-white/70 py-3">
              <div className="text-center">
                <p className="text-[11px] text-slate-500">Seat Rent</p>
                <p className="flex mt-1 text-sm font-bold text-slate-900 ml-9">
                  <TbCurrencyTaka size={20} />3,800
                </p>
              </div>

              <div className="text-center">
                <p className="text-[11px] text-slate-500">Est. Meal</p>
                <p className="flex mt-1 text-sm font-bold text-slate-900 ml-9">
                  <TbCurrencyTaka size={20} />42/meal
                </p>
              </div>

              <div className="text-center">
                <p className="text-[11px] text-slate-500">Attached Bath</p>
                <p className="mt-1 text-sm font-bold text-orange-500">
                  Yes (1)
                </p>
              </div>
            </div>
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-xs text-black">
            <FiNavigation className="h-3.5 w-3.5 text-[#934D00]" />
            Filtered by varsity distance &amp; metro line proximity
          </p>
        </div> 

        {/* ===== Right: Steps ===== */}
        <div className="flex flex-col gap-6">
          {steps.map((step) => (
            <div key={step.tag} className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                {step.icon}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${step.tagColor}`}
                  >
                    {step.tag}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    {step.title}
                  </h3>
                </div>

                <p className="mt-1.5 text-sm leading-6 text-slate-500">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FindMess;
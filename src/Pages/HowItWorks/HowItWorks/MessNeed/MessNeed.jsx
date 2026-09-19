import { FaUtensils } from "react-icons/fa";
import {
  FiShoppingCart,
  FiFileText,
  FiFile,
} from "react-icons/fi";
import { BsCashCoin } from "react-icons/bs";
import { FaRegHandshake } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const features = [
  {
    icon: <FaUtensils className="h-8 w-8" />,
    title: "Meals",
    desc: "Daily headcounts & meal off cutoffs",
  },
  {
    icon: <FiShoppingCart className="h-8 w-8" />,
    title: "Bazar",
    desc: "Itemized lists & expense bills",
  },
  {
    icon: <FiFileText className="h-8 w-8" />,
    title: "Expenses",
    desc: "Gas, wifi, cook bill (৳) split",
  },
  {
    icon: <BsCashCoin className="h-8 w-8" />,
    title: "Payments",
    desc: "bKash/Nagad member deposits",
  },
  {
    icon: <FaRegHandshake className="h-8 w-8" />,
    title: "Settlement",
    desc: "Auto balanced individual totals",
  },
  {
    icon: <FiFile className="h-8 w-8" />,
    title: "Monthly Report",
    desc: "Exportable archive for peace of mind",
  },
];

const MessNeed = () => {
  return (
    <section className="border-l-4 border-blue-600 bg-white px-5 py-10 sm:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
        <div>
          <h2 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
            Everything your mess needs, every month.
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            All daily routines—from morning bazar receipts to dinner
            headcount—synced smoothly in one shared registry.
          </p>
        </div>

        <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-slate-700 bg-white shadow-sm w-60 h-10 rounded-full">
          <span className="h-2 w-2 rounded-full bg-emerald-500 ml-2" />
          Current Month: Active Tracking
        </span>
      </div>

      {/* Feature icons row */}
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col w-full items-center rounded-xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
          >
            <div className="mb-3 flex h-13 w-13 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              {feature.icon}
            </div>

            <h3 className="text-sm font-bold text-slate-900">
              {feature.title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Workstation banner */}
      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl bg-emerald-50 p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-white">
            <HiSparkles className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">
              Dedicated Monthly Workstation
            </p>
            <p className="mt-1 text-xs leading-6 text-slate-600 sm:text-sm">
              Each mess gets a separate monthly portal, keeping meals,
              expenses, payments, calculations, settlements, and reports
              organized without data bleeding into next month.
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-sm">
          Strict Accountability
        </span>
      </div>
    </section>
  );
};

export default MessNeed;
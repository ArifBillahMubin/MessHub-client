import { FiMail, FiLock } from "react-icons/fi";

const steps = [
  {
    number: "01",
    title: "Monthly Data Frozen",
    desc: "Last midnight meal and final bazar entered.",
    active: false,
  },
  {
    number: "02",
    title: "Calculation & Meal Rate",
    desc: "System computes precise meal rate down to poisha.",
    active: false,
  },
  {
    number: "03",
    title: "Settlement & Balances",
    desc: "Deposits subtracted from individual food & shared bills.",
    active: false,
  },
  {
    number: "04",
    title: "Month Closed & Archived",
    desc: "Manager locks ledger with one decisive click.",
    active: true,
  },
  {
    number: "05",
    title: "Members Receive Email",
    desc: "PDF statement delivered to all registered email inboxes.",
    active: false,
  },
];

const lineItems = [
  { label: "Personal Meals (52.0 x ৳44.20)", value: "৳2,298.40" },
  { label: "Fixed Share (Cook + Wifi + Utilities)", value: "৳1,450.00" },
  { label: "Total Month Cost", value: "৳3,748.40" },
  { label: "Deposit Deposited (bKash)", value: "- ৳4,000.00" },
];

const CloseTheMonth = () => {
  return (
    <section className=" px-5 py-14 sm:px-8">
      {/* Header */}
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Close the month. Keep the history.
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-black">
          Wrap up finances transparently so everyone starts the upcoming
          month on a clean, honest slate.
        </p>

        {/* Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* ===== Left: Lifecycle Flow ===== */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Portal Lifecycle Flow
              </h3>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-black">
                Automatic Monthly Report
              </span>
            </div>

            {/* Timeline */}
            <ol className="relative mt-6 space-y-6 border-l border-slate-100 pl-6">
              {steps.map((step) => (
                <li key={step.number} className="relative ">
                  <span
                    className={`absolute -left-[33px] flex h-8 w-8 items-center justify-center rounded-full text-[15px] font-bold  ${
                      step.active
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {step.number}
                  </span>

                  <h4 className="font-bold text-slate-900 ml-4 ">
                    {step.title}
                  </h4>
                  <p className="mt-0.5 text-sm leading-5 text-slate-700 ml-4 ">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>

            {/* Footer note */}
            <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm leading-5 text-black">
              When the Manager closes the monthly portal, MessHub generates
              the final report and sends it automatically to active
              members' registered emails.
            </div>
          </div>

          {/* ===== Right: Statement Card ===== */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-white">
                  <FiMail className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[11px] text-black">
                    Auto-Generated Email Report
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    October 2025 Statement
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-full bg-emerald-200 px-3 py-1 text-[10px] font-bold text-slate-600">
                AUDITED
              </span>
            </div>

            {/* Stat boxes */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs text-slate-500">Total Mess Meals</p>
                <p className="mt-1 text-lg font-extrabold text-slate-900">
                  842.5
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs text-black">Final Meal Rate</p>
                <p className="mt-1 text-lg font-extrabold text-slate-900">
                  ৳44.20
                </p>
              </div>
            </div>

            {/* Line items */}
            <div className="mt-5 space-y-3 text-sm bg-emerald-50 pt-5 pb-5 rounded-2xl">
              {lineItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-black px-3 "
                >
                  <span>{item.label}</span>
                  <span className="font-semibold text-slate-800">
                    {item.value}
                  </span>
                </div>
              ))}

              {/* Refundable highlight */}
              <div className="flex items-center justify-between rounded-lg bg-emerald-300 px-3 py-2.5 ml-4 mr-4">
                <span className="text-sm font-bold text-black">
                  Refundable to Member
                </span>
                <span className="text-sm font-extrabold text-emerald-800">
                  ৳251.60
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <FiLock className="h-3.5 w-3.5" />
                Permanent Cryptographic Hash
              </span>
              <span>Sent to 8 Flatmates</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CloseTheMonth;
import { Link } from "react-router";
import {
  BellRing,
  Calculator,
  CheckCircle2,
  CheckSquare,
  MessagesSquare,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  Utensils,
  Wallet,
} from "lucide-react";

const pillars = [
  {
    title: "Simple Management",
    badge: "Zero Excel Chaos",
    Icon: Calculator,
    description:
      "Manage meals, daily bazar receipts, shared overhead utilities, payments, and monthly calculations effortlessly with one organized system.",
    footer: "Automatic Daily Meal Stepper",
    FooterIcon: CheckCircle2,
    iconStyle: "bg-background text-primary",
    badgeStyle: "bg-background text-primary",
    footerStyle: "text-primary",
  },
  {
    title: "Financial Transparency",
    badge: "Crystal Clear",
    Icon: Wallet,
    description:
      "Help every member clearly understand their individual daily meal rates, advance deposits, and automated final settlements with mathematical clarity.",
    footer: "Dynamic Real-Time Meal Rate",
    FooterIcon: CheckCircle2,
    iconStyle: "bg-secondary/10 text-secondary",
    badgeStyle: "bg-secondary/15 text-secondary",
    footerStyle: "text-secondary",
  },
  {
    title: "Better Communication",
    badge: "Happier Flatmates",
    Icon: MessagesSquare,
    description:
      "Foster harmony among flatmates and managers with dedicated meal cutoff reminders, bazar alerts, and automated monthly statement breakdowns.",
    footer: "Meal Cutoff Reminders",
    FooterIcon: BellRing,
    iconStyle: "bg-tertiary/15 text-neutral",
    badgeStyle: "bg-tertiary/15 text-neutral",
    footerStyle: "text-neutral",
  },
];

const steps = [
  {
    title: "Meals",
    Icon: Utensils,
    description: "Daily tap-to-count lunch, dinner, and guest meals.",
  },
  {
    title: "Bazar",
    Icon: ShoppingCart,
    description: "Member market entries with itemized receipts.",
  },
  {
    title: "Expenses",
    Icon: Receipt,
    description: "Cook, Wi-Fi, water, spices, and shared costs logged.",
  },
  {
    title: "Payments",
    Icon: Wallet,
    description: "Advance deposits recorded via bKash, Nagad, or cash.",
  },
  {
    title: "Settlement",
    Icon: CheckCircle2,
    description: "Review net refunds or dues in a clear monthly ledger.",
  },
];

const highlights = [
  "Auto Meal Rate Formula",
  "Manager Rotation Tracking",
  "Multi-device Access",
];

const Mission = () => {
  return (
    <div className="space-y-7 px-4 py-6 font-sans sm:px-8 sm:py-8 lg:px-10">
      {/* Core Purpose */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-background px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-16 -z-10 h-64 w-64 rounded-full bg-secondary/15 blur-3xl"
        />

        <p className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-primary">
          <ShieldCheck size={14} aria-hidden="true" />
          Core Purpose
        </p>

        <h2 className="mx-auto mt-4 max-w-3xl text-2xl font-extrabold leading-tight tracking-tight text-primary sm:text-3xl lg:text-4xl">
          &ldquo;Making everyday mess management simple for everyone.&rdquo;
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-neutral/75">
          Communal meal accounting shouldn&apos;t ruin friendships. We
          engineer clarity, fairness, and mutual peace of mind into every
          morning bazar run and month-end settlement.
        </p>
      </section>

      {/* Mission Pillars */}
      <section
        aria-label="Our mission pillars"
        className="grid gap-5 md:grid-cols-3"
      >
        {pillars.map(
          ({
            title,
            badge,
            Icon,
            description,
            footer,
            FooterIcon,
            iconStyle,
            badgeStyle,
            footerStyle,
          }) => (
            <article
              key={title}
              className="flex flex-col rounded-2xl border border-primary/5 bg-white p-5 shadow-sm lg:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className={`inline-flex rounded-xl p-3 ${iconStyle}`}
                >
                  <Icon size={22} aria-hidden="true" />
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${badgeStyle}`}
                >
                  {badge}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-neutral">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-neutral/75">
                {description}
              </p>

              <div
                className={`mt-auto flex items-center gap-2 pt-7 text-xs font-semibold ${footerStyle}`}
              >
                <FooterIcon
                  size={15}
                  className="shrink-0"
                  aria-hidden="true"
                />
                <span>{footer}</span>
              </div>
            </article>
          ),
        )}
      </section>

      {/* Monthly Lifecycle */}
      <section
        aria-labelledby="lifecycle-title"
        className="rounded-3xl bg-primary/10 p-5 sm:p-6"
      >
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
              Lifecycle Protocol
            </p>

            <h2
              id="lifecycle-title"
              className="mt-1 text-lg font-bold text-neutral"
            >
              How MessHub Closes the Month Without Friction
            </h2>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            Automatic Month-End Close
          </span>
        </header>

        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map(({ title, Icon, description }, index) => {
            const isLast = index === steps.length - 1;

            return (
              <li key={title} className="rounded-2xl bg-white p-4">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    isLast
                      ? "bg-secondary/20 text-secondary"
                      : "bg-background text-primary"
                  }`}
                >
                  {index + 1}
                </span>

                <h3
                  className={`mt-3 flex items-center gap-1.5 text-sm font-bold ${
                    isLast ? "text-secondary" : "text-primary"
                  }`}
                >
                  <Icon
                    size={15}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                  {title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-neutral/75">
                  {description}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Local Experience and Demo */}
      <section
        aria-labelledby="experience-title"
        className="grid items-center gap-7 rounded-3xl bg-background p-5 sm:p-6 lg:grid-cols-[1.3fr_1fr]"
      >
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
            Real Bangladesh Bachelor Experience
          </p>

          <h2
            id="experience-title"
            className="mt-3 text-xl font-bold leading-snug text-neutral sm:text-2xl"
          >
            Crafted for Dhanmondi, Farmgate, Mirpur, Chawkbazar & Beyond
          </h2>

          <p className="mt-3 text-sm leading-6 text-neutral/75">
            Whether managing a university roommate setup or a larger
            professional bachelor flat, MessHub aims to remove month-end
            tension. Keep grocery purchases, meal updates, and shared
            bills organized so everyone knows where the money goes.
          </p>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
            {highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral"
              >
                <CheckSquare
                  size={14}
                  className="shrink-0 text-secondary"
                  aria-hidden="true"
                />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-lg shadow-primary/10 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-sm font-bold text-primary">
              <Receipt size={16} aria-hidden="true" />
              Monthly Transparency
            </h3>

            <span className="rounded-full bg-background px-2.5 py-1 text-[10px] font-bold text-primary">
              Demo Preview
            </span>
          </div>

          <dl className="mt-4 space-y-2">
            <div className="flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-3">
              <dt className="text-xs text-neutral/75">
                Active Mess Members
              </dt>
              <dd className="text-sm font-bold text-neutral">
                8 Flatmates
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-3">
              <dt className="text-xs text-neutral/75">
                Current Meal Rate
              </dt>
              <dd className="text-lg font-extrabold text-secondary">
                ৳62.40
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-3">
              <dt className="text-xs text-neutral/75">
                Shared Treasury
              </dt>
              <dd className="text-lg font-extrabold text-primary">
                ৳18,500
              </dd>
            </div>
          </dl>

          <p className="mt-3 rounded-lg bg-primary/10 px-3 py-2 text-center text-[10px] font-medium text-primary">
            Illustrative figures — your mess data will appear here.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="flex flex-col gap-5 rounded-2xl bg-primary/10 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral">
            Ready to bring peace to your flat?
          </h2>

          <p className="mt-1 text-xs leading-6 text-neutral/75">
            Start your mess with MessHub. Free for up to 8 active members.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/pricing"
            className="rounded-full px-4 py-2.5 text-xs font-bold text-primary transition hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            View Pricing Plans
          </Link>

          <Link
            to="/dashboard/create-mess"
            className="rounded-full bg-primary px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Create Your Mess
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Mission;
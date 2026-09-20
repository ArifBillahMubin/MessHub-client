import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router";

const freeFeatures = [
  "Mess management",
  "Member management",
  "Monthly portal",
  "Meal management",
  "Bazar management",
  "Expense management",
  "Payment tracking",
  "Settlement",
  "Mess group chat",
  "Public mess recruitment",
  "Basic monthly reports",
  "Automatic monthly report email",
];

const standardFeatures = [
  "Flexible pricing and billing periods managed by MessHub",
  "Expanded capacity for up to 12 active members",
  "Full monthly portal and automated calculations",
  "Multi-manager administrative support",
  "Priority email report delivery",
  "Custom expense split rules",
];

const customFeatures = [
  "Large bachelor messes with 13+ flatmates",
  "University student hostels and shared flats",
  "Hall accommodations and dorm wings",
  "Institutional and corporate shared housing",
  "Dedicated account support and custom data export",
];

const plans = [
  {
    name: "Free",
    featured: true,
    members: "1–8 Active Members",
    title: "Free",
    suffix: "/ forever",
    description: "Everything a small mess needs to stay organized.",
    label: "Included with Free",
    features: freeFeatures,
    button: "Get Started",
    to: "/register",
    badgeClass: "bg-secondary/10 text-secondary",
    iconClass: "text-secondary",
    buttonClass:
      "bg-gradient-to-r from-secondary to-primary text-white",
  },
  {
    name: "Standard",
    members: "9–12 Active Members",
    title: "Paid Plan",
    subtitle: "Pricing managed by MessHub",
    description: "For growing messes with more active members.",
    label: "Plan capabilities",
    features: standardFeatures,
    button: "View Plan Details",
    href: "#member-thresholds",
    badgeClass: "bg-background text-primary",
    iconClass: "text-primary",
    buttonClass: "bg-primary text-white",
  },
  {
    name: "Custom",
    members: "13+ Active Members",
    title: "Custom",
    subtitle: "Tailored volume agreement",
    description:
      "Need a larger setup? Talk to us about a custom service plan.",
    label: "Ideal setup for",
    features: customFeatures,
    button: "Contact Us",
    href: "#pricing-support",
    badgeClass: "bg-tertiary/15 text-neutral",
    iconClass: "text-tertiary",
    buttonClass: "bg-tertiary text-neutral",
  },
];

// Display order: Paid on the left, Free in the center, Custom on the right.
const orderedPlans = [plans[1], plans[0], plans[2]];

const PricingPlans = () => {
  return (
    <section
      aria-labelledby="pricing-title"
      className="relative isolate overflow-hidden px-4 pb-12 pt-12 sm:px-6 lg:px-8"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-background/60 to-white"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-8 -z-10 h-48 w-48 rounded-full bg-secondary/15 blur-3xl"
      />

      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            Pricing & Service Plans
          </span>

          <h1
            id="pricing-title"
            className="mt-5 text-3xl font-extrabold tracking-tight text-neutral sm:text-4xl lg:text-5xl"
          >
            Simple Plans for Every Mess.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-neutral/75 sm:text-base">
            Choose the plan that matches your mess size. Your pricing
            category is based on active members.
          </p>

          <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-neutral shadow-sm">
            <ShieldCheck
              size={16}
              className="shrink-0 text-secondary"
              aria-hidden="true"
            />
            <span>
              No hidden fees • Transparent calculations • Start without
              commitment
            </span>
          </div>
        </header>

        <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-3 lg:gap-6">
          {orderedPlans.map((plan) => {
            const buttonClass = `
              inline-flex w-full items-center justify-center gap-2
              rounded-xl px-5 py-3.5 text-sm font-bold shadow-sm
              transition hover:brightness-95
              focus-visible:outline-2 focus-visible:outline-offset-4
              focus-visible:outline-primary
              ${plan.buttonClass}
            `;

            return (
              <article
                key={plan.name}
                className={`relative flex min-w-0 flex-col rounded-3xl border p-6 transition-shadow duration-200 sm:p-7 ${
                  plan.featured
                    ? "border-primary/40 bg-gradient-to-b from-background/70 via-white to-white shadow-xl shadow-primary/10"
                    : "border-primary/10 bg-white shadow-sm hover:shadow-lg hover:shadow-primary/5"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-white">
                    <Star size={13} aria-hidden="true" />
                    Start with Free
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-primary">
                    {plan.name}
                  </h2>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${plan.badgeClass}`}
                  >
                    <Users size={12} aria-hidden="true" />
                    {plan.members}
                  </span>
                </div>

                <div className="mt-6 lg:min-h-[168px]">
                  <p className="text-4xl font-extrabold tracking-tight text-neutral sm:text-5xl lg:text-4xl xl:text-5xl">
                    {plan.title}
                    {plan.suffix && (
                      <span className="ml-1 text-xs font-medium tracking-normal">
                        {plan.suffix}
                      </span>
                    )}
                  </p>

                  {plan.subtitle && (
                    <p className="mt-2 text-xs font-medium text-neutral">
                      {plan.subtitle}
                    </p>
                  )}

                  <p className="mt-3 text-sm leading-6 text-neutral/75">
                    {plan.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-primary/10 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-primary">
                    {plan.label}
                  </h3>

                  <ul className={`mt-5 grid gap-x-4 gap-y-3.5 ${plan.featured ? "sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" : "grid-cols-1"}`}>
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-[13px] leading-6 text-neutral/85"
                      >
                        {plan.name === "Custom" ? (
                          <Building2
                            size={16}
                            className={`mt-0.5 shrink-0 ${plan.iconClass}`}
                            aria-hidden="true"
                          />
                        ) : (
                          <CheckCircle2
                            size={16}
                            className={`mt-0.5 shrink-0 ${plan.iconClass}`}
                            aria-hidden="true"
                          />
                        )}
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-8">
                {plan.to ? (
                  <Link to={plan.to} className={buttonClass}>
                    {plan.button}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                ) : (
                  <a href={plan.href} className={buttonClass}>
                    {plan.button}
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};


export default PricingPlans;
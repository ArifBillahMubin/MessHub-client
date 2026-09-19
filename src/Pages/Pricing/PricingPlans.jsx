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
    featured: true,
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

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan) => {
            const buttonClass = `
              mt-7 inline-flex w-full items-center justify-center gap-2
              rounded-full px-5 py-3 text-sm font-semibold shadow-md
              transition hover:brightness-95
              focus-visible:outline-2 focus-visible:outline-offset-4
              focus-visible:outline-primary
              ${plan.buttonClass}
            `;

            return (
              <article
                key={plan.name}
                className={`relative rounded-3xl bg-white p-6 shadow-lg shadow-neutral/5 ring-1 sm:p-7 ${
                  plan.featured
                    ? "ring-primary/15"
                    : "ring-neutral/5"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-white">
                    <Star size={13} aria-hidden="true" />
                    Most popular for flats
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

                <div className="mt-6">
                  <p className="text-4xl font-extrabold tracking-tight text-neutral">
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

                <div className="mt-7 border-t border-primary/15 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-primary">
                    {plan.label}
                  </h3>

                  <ul className="mt-4 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm leading-5 text-neutral"
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
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
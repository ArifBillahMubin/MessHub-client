import { Building2, ShieldCheck, Users } from "lucide-react";

const thresholds = [
  {
    label: "Small & Simple",
    members: "1–8 Members",
    plan: "Free Plan",
    Icon: Users,
    color: "bg-secondary/10 text-secondary",
  },
  {
    label: "Growing Mess",
    members: "9–12 Members",
    plan: "Standard Plan",
    Icon: Users,
    color: "bg-background text-primary",
  },
  {
    label: "Bigger Setup",
    members: "13+ Members",
    plan: "Custom Plan",
    Icon: Building2,
    color: "bg-tertiary/15 text-neutral",
  },
];

const MemberThresholds = () => {
  return (
    <section
      id="member-thresholds"
      aria-labelledby="thresholds-title"
      className="scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl rounded-3xl bg-background p-6 sm:p-10">
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Clear Categorization
          </p>
          <h2
            id="thresholds-title"
            className="mt-3 text-2xl font-extrabold text-neutral sm:text-3xl"
          >
            Active Member Thresholds
          </h2>
          <p className="mt-3 text-sm leading-6 text-neutral/75">
            Your plan category depends on the number of active members
            in your mess.
          </p>
        </header>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {thresholds.map(({ label, members, plan, Icon, color }) => (
            <article
              key={plan}
              className="rounded-2xl bg-white p-6 text-center"
            >
              <span
                className={`inline-flex rounded-full p-3 ${color}`}
              >
                <Icon size={22} aria-hidden="true" />
              </span>
              <p className="mt-3 text-xs font-medium text-neutral/65">
                {label}
              </p>
              <h3 className="mt-2 text-xl font-bold text-neutral">
                {members}
              </h3>
              <p
                className={`mt-4 rounded-full px-3 py-2 text-xs font-bold ${color}`}
              >
                {plan}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl bg-white/80 p-4">
          <ShieldCheck
            size={19}
            className="mt-0.5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p className="text-xs leading-6 text-neutral/80">
            <strong className="text-neutral">
              Fair, member-based categories.
            </strong>{" "}
            Check your current active-member count when choosing a plan.
            Contact MessHub for Standard pricing or a Custom agreement.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MemberThresholds;
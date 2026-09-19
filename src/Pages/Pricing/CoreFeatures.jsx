import {
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  MessageCircle,
  Receipt,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";

const features = [
  {
    title: "Meal Management",
    description:
      "Track daily meals and keep everyone's meal records organized.",
    Icon: ClipboardList,
  },
  {
    title: "Bazar Records",
    description:
      "Record grocery purchases and keep shared shopping costs clear.",
    Icon: ShoppingCart,
  },
  {
    title: "Expense Management",
    description:
      "Organize rent, utilities, groceries, and other shared expenses.",
    Icon: Receipt,
  },
  {
    title: "Payment Tracking",
    description:
      "Keep a clear record of member payments and outstanding balances.",
    Icon: Wallet,
  },
  {
    title: "Instant Settlement",
    description:
      "Review calculated balances and understand who owes what.",
    Icon: ChartNoAxesCombined,
  },
  {
    title: "Monthly Reports",
    description:
      "Review meals, payments, and expenses in one monthly summary.",
    Icon: CalendarDays,
  },
  {
    title: "Mess Group Chat",
    description:
      "Keep mess discussions and day-to-day coordination together.",
    Icon: MessageCircle,
  },
  {
    title: "Mess Recruitment",
    description:
      "Share available seats and connect with potential mess members.",
    Icon: Users,
  },
];

const CoreFeatures = () => {
  return (
    <section
      aria-labelledby="features-title"
      className="px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Common Features
          </p>
          <h2
            id="features-title"
            className="mt-3 text-2xl font-extrabold text-neutral sm:text-3xl"
          >
            Core MessHub Features
          </h2>
          <p className="mt-3 text-sm leading-6 text-neutral/75">
            Everyday tools that help your mess stay organized and make
            shared living easier.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description, Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-primary/10 p-5 transition hover:border-primary/25 hover:bg-background/30"
            >
              <span className="inline-flex rounded-xl bg-background p-3 text-primary">
                <Icon size={21} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-sm font-bold text-neutral">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral/70">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreFeatures;
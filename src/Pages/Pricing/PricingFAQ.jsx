import { Plus } from "lucide-react";

const faqs = [
  {
    question: "How is my plan determined?",
    answer:
      "Your plan category is based on your active-member count: Free for 1–8 members, Standard for 9–12 members, and Custom for 13 or more members.",
  },
  {
    question: "Are former members counted?",
    answer:
      "The thresholds shown here are based on active members. Former members who are no longer active are not included in that count.",
  },
  {
    question: "Can I create a mess without buying a plan?",
    answer:
      "The Free plan supports messes with 1–8 active members. You can begin with that category and discuss another plan as your mess grows.",
  },
  {
    question: "What if my mess has 13+ members?",
    answer:
      "Contact MessHub to discuss a Custom plan for your member capacity and service requirements.",
  },
];

const PricingFAQ = () => {
  return (
    <section
      aria-labelledby="faq-title"
      className="px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Have Questions?
          </p>

          <h2
            id="faq-title"
            className="mt-3 text-2xl font-extrabold text-neutral sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>

          <p className="mt-3 text-sm leading-6 text-neutral/75">
            Clear answers about plans and member categories.
          </p>
        </header>

        <div className="mt-8 space-y-3">
          {faqs.map(({ question, answer }) => (
            <details
              key={question}
              className="group rounded-2xl border border-primary/10 bg-white open:bg-background/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-5 text-sm font-semibold text-neutral focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                {question}
                <Plus
                  size={18}
                  className="shrink-0 text-primary transition-transform group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>

              <p className="px-5 pb-5 text-sm leading-7 text-neutral/75">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingFAQ;
import { ArrowRight, Headphones } from "lucide-react";

const PricingSupport = ({ supportEmail }) => {
  return (
    <section
      id="pricing-support"
      aria-labelledby="support-title"
      className="scroll-mt-24 px-4 pb-16 pt-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-3xl rounded-3xl bg-background/40 px-6 py-10 text-center">
        <span className="inline-flex rounded-full bg-background p-4 text-primary">
          <Headphones size={26} aria-hidden="true" />
        </span>

        <h2
          id="support-title"
          className="mt-4 text-xl font-extrabold text-neutral sm:text-2xl"
        >
          Not sure which plan fits?
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-neutral/75">
          Tell us about your mess and we’ll help you understand the
          available options.
        </p>

        {supportEmail ? (
          <a
            href={`mailto:${supportEmail}?subject=MessHub%20plan%20enquiry`}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Contact Us
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        ) : (
          <p className="mt-5 text-sm font-medium text-primary">
            Support contact details will be available soon.
          </p>
        )}
      </div>
    </section>
  );
};

export default PricingSupport;
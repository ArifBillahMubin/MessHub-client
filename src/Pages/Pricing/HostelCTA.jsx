import { ArrowRight, Building2 } from "lucide-react";

const HostelCTA = () => {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary p-7 sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 -z-10 h-72 w-72 rounded-full bg-secondary/30 blur-3xl"
        />

        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80">
              <Building2 size={16} aria-hidden="true" />
              Institutional Solutions
            </p>

            <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
              Running a larger mess or hostel?
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/85">
              Tell us about your setup. We can discuss member capacity,
              reporting, and a service plan suited to your organization.
            </p>
          </div>

          <a
            href="#pricing-support"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-white px-6 py-3 text-sm font-bold text-primary transition hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:self-auto"
          >
            Contact Us
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HostelCTA;
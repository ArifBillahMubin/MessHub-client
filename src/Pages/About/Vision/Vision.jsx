import { Link } from "react-router";
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Eye,
    Globe,
    MessageCircle,
    ReceiptText,
    Search,
    Users,
} from "lucide-react";
import visionImage from "../../../assets/About/VisionImage.png";

const principles = [
    {
        number: "01",
        title: "Connected",
        icon: Users,
        description:
            "Better communication, timely meal updates, and clear records shared between mess managers and flat members.",
        tone: "bg-secondary/15 text-secondary",
    },
    {
        number: "02",
        title: "Organized",
        icon: ReceiptText,
        description:
            "A structured, auditable record for every month, helping prevent missing expenses and awkward financial conversations.",
        tone: "bg-background text-primary",
    },
    {
        number: "03",
        title: "Accessible",
        icon: MessageCircle,
        description:
            "Purpose-built for Bangladeshi students, bachelors, and job holders across Dhaka, Chattogram, Sylhet, and beyond.",
        tone: "bg-tertiary/15 text-neutral",
    },
];

// Vision goals, not measured product usage or performance statistics.
const goals = [
    { value: "Clarity", label: "In every shared expense", tone: "text-primary" },
    { value: "64", label: "Districts in our nationwide vision", tone: "text-secondary" },
    { value: "One", label: "Platform for everyday mess life", tone: "text-neutral" },
    { value: "Trust", label: "Through transparent records", tone: "text-primary" },
];

// AboutLayout already supplies the header, tabs, navbar, and footer.
const Vision = () => {
    return (
        <div className="space-y-7 px-5 py-10 sm:px-8 md:px-10 lg:px-12 lg:py-14">
            {/* SECTION HEADING */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-neutral">
                        <span className="h-1.5 w-8 rounded-full bg-secondary" />
                        Section 03
                    </p>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral sm:text-4xl">
                        Our Vision
                    </h2>
                    <p className="mt-2 text-[14px] font-medium leading-6 text-neutral/75">
                        Building a smarter and more connected future for shared living.
                    </p>
                </div>
                <span className="self-start rounded-xl bg-background px-4 py-2 text-[11px] font-bold text-primary sm:self-auto">
                    Bangladeshi Flats &amp; Student Messes
                </span>
            </header>

            {/* VISION STATEMENT */}
            <section aria-label="Our vision statement" className="flex items-start gap-4 rounded-2xl bg-background p-5 sm:items-center sm:p-6">
                <span className="inline-flex shrink-0 rounded-xl bg-primary p-3 text-white">
                    <Eye size={22} aria-hidden="true" />
                </span>
                <blockquote className="text-base font-bold leading-7 text-primary sm:text-lg">
                    &ldquo;We envision a future where managing a shared home is as simple as using one connected platform.&rdquo;
                </blockquote>
            </section>

            {/* PRINCIPLES AND IMAGE */}
            <section aria-label="A connected future for shared living" className="grid items-stretch gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="flex flex-col gap-3">
                    {principles.map(({ number, title, icon: Icon, description, tone }) => (
                        <article key={number} className="rounded-2xl border border-primary/5 bg-white p-4 shadow-sm sm:p-5">
                            <div className="flex items-center gap-2.5">
                                <span className={`inline-flex shrink-0 rounded-full p-2 ${tone}`}>
                                    <Icon size={17} aria-hidden="true" />
                                </span>
                                <h3 className="text-base font-bold text-neutral">{title}</h3>
                                <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-extrabold ${tone}`}>{number}</span>
                            </div>
                            <p className="mt-2 text-[13px] font-medium leading-6 text-neutral/75 sm:pl-11">
                                {description}
                            </p>
                        </article>
                    ))}
                    <div className="relative mt-auto rounded-2xl bg-primary/10 p-5 pl-7">
                        <span aria-hidden="true" className="absolute bottom-5 left-4 top-5 w-1 rounded-full bg-gradient-to-b from-tertiary to-secondary" />
                        <p className="text-[10px] font-extrabold uppercase tracking-wide text-primary">Our Core Tenet</p>
                        <p className="mt-1 text-sm font-bold leading-6 text-neutral">
                            One platform. Shared responsibility. Simpler living.
                        </p>
                    </div>
                </div>

                <figure className="relative isolate flex min-h-[380px] flex-col justify-between overflow-hidden rounded-2xl bg-neutral p-4 shadow-sm sm:min-h-[440px]">
                    <img
                        src={visionImage}
                        alt="Flatmates sharing a meal and organizing their shared home together"
                        className="absolute inset-0 -z-20 h-full w-full object-cover"
                        loading="lazy"
                    />
                    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral/35 via-transparent to-neutral/65" />
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-primary shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                            Connected Flatmates
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold text-white">
                            <Globe size={12} aria-hidden="true" />
                            A Nationwide Vision
                        </span>
                    </div>
                    <figcaption className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/95 p-3">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold text-neutral">
                            <CheckCircle2 size={20} className="shrink-0 text-secondary" aria-hidden="true" />
                            Shared meals. Clear records.
                        </span>
                        <Link to="/how-it-works" className="inline-flex items-center gap-1 rounded text-[11px] font-bold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                            Explore MessHub <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                    </figcaption>
                </figure>
            </section>

            {/* CALL TO ACTION */}
            <section className="flex flex-col gap-6 rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 shadow-sm sm:p-7 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-xl">
                    <p className="inline-block rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                        Ready to transform your mess?
                    </p>
                    <h2 className="mt-3 text-xl font-extrabold leading-snug text-white sm:text-2xl">
                        Help shape a simpler future for shared living.
                    </h2>
                    <p className="mt-2 text-[13px] font-medium leading-6 text-white/90">
                        Connect with flatmates, organize shared groceries, and keep month-end calculations clear in one place.
                    </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-3">
                    <Link to="/dashboard/join-mess" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-primary transition hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                        <Search size={15} aria-hidden="true" />Join a Mess
                    </Link>
                    <Link to="/how-it-works" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/15 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                        <BookOpen size={15} aria-hidden="true" />Read Complete Guide
                    </Link>
                </div>
            </section>

            {/* VISION GOALS */}
            <section aria-label="What we are working toward" className="rounded-2xl bg-background/60 p-4 sm:p-5">
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">What we are working toward</p>
                <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {goals.map(({ value, label, tone }) => (
                        <div key={value} className="flex flex-col rounded-2xl bg-white p-5">
                            <dt className="order-2 mt-2 text-xs font-medium leading-5 text-neutral/75">{label}</dt>
                            <dd className={`text-3xl font-extrabold tracking-tight ${tone}`}>{value}</dd>
                        </div>
                    ))}
                </dl>
            </section>
        </div>
    );
};

export default Vision;

import { useState } from "react";
import {
  Globe,
  Users,
  Headphones,
  Mail,
  Code,
  Database,
  Palette,
} from "lucide-react";

import {
  FaGithub as Github,
  FaLinkedinIn as Linkedin,
} from "react-icons/fa";

const teamMembers = [
    {
        id: "founder",
        name: "Arif Billah Mubin",
        role: "Founder & Full Stack Developer",
        description: "Architecting scalable solutions to make student and bachelor mess life simpler across Bangladesh.",
        initials: "AM",
        photo: "",
        icon: Code,
        accent: "bg-primary text-white",
        ring: "ring-primary/20",
        socials: { linkedin: "", github: "", website: "" },
    },
    {
        id: "frontend",
        name: "Frontend Engineer",
        role: "Frontend Developer",
        description: "Crafting responsive interfaces, clear interactions, and mobile-first experiences for everyday shared living.",
        initials: "FE",
        photo: "",
        icon: Code,
        accent: "bg-secondary text-white",
        ring: "ring-secondary/20",
        socials: { linkedin: "", github: "", website: "" },
    },
    {
        id: "backend",
        name: "Backend Engineer",
        role: "Backend Developer",
        description: "Engineering reliable data models, automated calculations, and secure authentication for connected messes.",
        initials: "BE",
        photo: "",
        icon: Database,
        accent: "bg-tertiary text-neutral",
        ring: "ring-tertiary/25",
        socials: { linkedin: "", github: "", website: "" },
    },
    {
        id: "design",
        name: "Product Designer",
        role: "UI/UX Designer",
        description: "Designing thoughtful, accessible interfaces around the needs of Bangladeshi flatmates and mess managers.",
        initials: "PD",
        photo: "",
        icon: Palette,
        accent: "bg-secondary text-white",
        ring: "ring-secondary/20",
        socials: { linkedin: "", github: "", website: "" },
    },
];

const socialPlatforms = [
    { key: "linkedin", label: "LinkedIn", icon: Linkedin },
    { key: "github", label: "GitHub", icon: Github },
    { key: "website", label: "Website", icon: Globe },
];

// Address shown in your reference design; confirm it before publishing.
const supportEmail = "support@messhub.app";

const Team = () => {
    const [failedPhotos, setFailedPhotos] = useState({});

    return (
        <div className="space-y-8 px-5 py-10 sm:px-8 md:px-10 lg:px-12 lg:py-14">
            {/* HEADING */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-neutral sm:text-4xl">
                        Meet the Team
                    </h2>
                    <p className="mt-2 text-[14px] font-medium leading-6 text-neutral/75">
                        People building a simpler experience for shared living.
                    </p>
                </div>
                <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-background px-4 py-2 text-[11px] font-bold text-primary sm:self-auto">
                    <Users size={14} aria-hidden="true" />
                    {teamMembers.length} Team Profiles
                </span>
            </header>

            {/* TEAM CARDS */}
            <section aria-label="MessHub team profiles" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {teamMembers.map((member) => {
                    const BadgeIcon = member.icon;
                    const hasPhoto = member.photo && !failedPhotos[member.id];
                    return (
                        <article key={member.id} className="flex min-w-0 flex-col items-center rounded-2xl border border-primary/5 bg-white px-5 py-7 text-center shadow-sm transition-shadow hover:shadow-md">
                            <div className="relative">
                                <div className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-background ring-4 ${member.ring}`}>
                                    {hasPhoto ? (
                                        <img
                                            src={member.photo}
                                            alt={member.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                            onError={() => setFailedPhotos((previous) => ({ ...previous, [member.id]: true }))}
                                        />
                                    ) : (
                                        <span aria-label={`${member.name} initials`} className="text-2xl font-extrabold tracking-wide text-primary">
                                            {member.initials}
                                        </span>
                                    )}
                                </div>
                                <span className={`absolute -bottom-1 right-0 inline-flex rounded-full border-[3px] border-white p-1.5 ${member.accent}`}>
                                    <BadgeIcon size={13} aria-hidden="true" />
                                </span>
                            </div>

                            <h3 className="mt-6 text-[17px] font-extrabold leading-6 text-neutral">
                                {member.name}
                            </h3>
                            <p className="mt-2 rounded-full bg-background px-3 py-1 text-[10px] font-bold leading-4 text-primary">
                                {member.role}
                            </p>
                            <p className="mt-4 text-[13px] font-medium leading-6 text-neutral/75">
                                {member.description}
                            </p>

                            {socialPlatforms.some(({ key }) => member.socials[key]) && (
                                <div className="mt-auto flex items-center justify-center gap-2 pt-5">
                                    {socialPlatforms.map(({ key, label, icon: Icon }) => (
                                        member.socials[key] ? (
                                            <a
                                                key={key}
                                                href={member.socials[key]}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`${member.name} on ${label} (opens in a new tab)`}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                                            >
                                                <Icon size={16} aria-hidden="true" />
                                            </a>
                                        ) : null
                                    ))}
                                </div>
                            )}
                        </article>
                    );
                })}
            </section>

            {/* CONTACT */}
            <section aria-labelledby="team-contact-title" className="flex flex-col gap-6 rounded-2xl border border-primary/5 bg-background p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary">
                        <Headphones size={15} aria-hidden="true" />
                        Always Here for Bachelors &amp; Managers
                    </p>
                    <h2 id="team-contact-title" className="mt-2 text-xl font-extrabold tracking-tight text-neutral sm:text-2xl">
                        Have a question about MessHub?
                    </h2>
                    <p className="mt-2 text-[13px] font-medium leading-6 text-neutral/75">
                        We&apos;d love to hear your feedback, feature ideas, or help your flat get onboarded without hassle.
                    </p>
                </div>
                <div className="flex min-w-0 flex-col items-start gap-3 lg:items-end">
                    <a
                        href={`mailto:${supportEmail}?subject=MessHub%20Enquiry`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                        <Mail size={15} aria-hidden="true" />Contact Us
                    </a>
                    <p className="text-xs leading-6 text-neutral/75 lg:text-right">
                        Or email us directly at{" "}
                        <a href={`mailto:${supportEmail}`} className="break-all rounded font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary">
                            {supportEmail}
                        </a>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Team;

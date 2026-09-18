import { Link } from "react-router";
import {
    ArrowRight,
    CheckCircle2,
    Users,
    Utensils,
    ReceiptText,
    MessageCircle,
} from "lucide-react";

import storyImg from "../../../assets/About/StoryImageAbout.png";

// Story cards
const storyCards = [
    {
        num: "01",
        icon: ReceiptText,
        title: "The Problem",
        desc: "Managing meals, bazar expenses, shared costs, and monthly calculations manually can become confusing and time-consuming.",
    },
    {
        num: "02",
        icon: Users,
        title: "The Idea",
        desc: "Bring mess members, meals, expenses, monthly records, and shared living into one organized platform.",
    },
    {
        num: "03",
        icon: Utensils,
        title: "MessHub Platform",
        desc: "Manage daily meals, bazar, shared expenses, monthly calculations, settlements, members, and reports from one place.",
    },
    {
        num: "04",
        icon: MessageCircle,
        title: "A Simpler Way",
        desc: "Create a more organized and transparent mess experience where everyone can clearly understand what is happening.",
    },
];

const benefits = [
    "Keep meals, bazar, and shared expenses organized in one place",
    "Automatically calculate meal rates and monthly member costs",
    "Keep monthly records, settlements, and reports clear and accessible",
];

const About = () => {
    return (
        <div className="px-5 py-10 sm:px-8 md:px-10 lg:px-12 lg:py-14">

            {/* =========================================
                STORY SECTION
            ========================================== */}
            <section>
                <div className="grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">

                    {/* =================================
                        LEFT — STORY CONTENT
                    ================================= */}
                    <div className="lg:pr-2">

                        {/* Eyebrow */}
                        <div className="mb-3 inline-flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-tertiary" />

                            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-tertiary">
                                Genesis
                            </span>
                        </div>

                        {/* Heading */}
                        <h2 className="max-w-xl text-3xl font-extrabold leading-[1.12] tracking-tight text-neutral sm:text-4xl lg:text-[42px]">
                            Making shared living
                            <span className="text-primary"> simpler.</span>
                        </h2>

                        {/* Subtitle */}
                        <p className="mt-3 max-w-xl text-[15px] font-semibold leading-6 text-neutral/80">
                            Built around the everyday challenges of managing a
                            bachelor mess and living together.
                        </p>

                        {/* Story */}
                        <div className="mt-6 max-w-2xl space-y-4 text-[15px] font-medium leading-7 text-neutral/85">

                            <p>
                                Shared living comes with its own set of challenges —
                                keeping track of daily meals, managing bazar
                                expenses, sharing rent and utility costs, and
                                settling monthly calculations with everyone in
                                the flat.
                            </p>

                            <p>
                                MessHub was created to bring these everyday
                                responsibilities into one{" "}
                                <span className="font-extrabold text-primary">
                                    simple and transparent platform.
                                </span>{" "}
                                Instead of relying on scattered notes,
                                spreadsheets, and manual calculations, mess
                                members can manage their shared living
                                experience from one place.
                            </p>

                            <p>
                                Our goal is simple: make mess management more
                                organized, make monthly হিসাব easier to
                                understand, and give every member a clearer
                                view of their shared living expenses and
                                activities.
                            </p>

                        </div>

                        {/* =================================
                            BENEFITS
                        ================================= */}
                        <ul className="mt-7 space-y-3.5">

                            {benefits.map((benefit) => (
                                <li
                                    key={benefit}
                                    className="flex items-start gap-3"
                                >
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                                        <CheckCircle2
                                            size={14}
                                            className="text-secondary"
                                            strokeWidth={2.7}
                                        />
                                    </span>

                                    <span className="text-[14px] font-semibold leading-6 text-neutral/85">
                                        {benefit}
                                    </span>
                                </li>
                            ))}

                        </ul>
                    </div>


                    {/* =================================
                        RIGHT — BLENDED IMAGE
                    ================================= */}
                    <div className="relative flex items-center justify-center lg:-mr-6">

                        {/* Soft ambient glow behind image */}
                        <div
                            className="
                                pointer-events-none
                                absolute
                                -inset-8
                                rounded-full
                                bg-primary/5
                                blur-3xl
                            "
                        />

                        {/* 
                            No card
                            No border
                            No shadow
                            No background

                            The PNG itself should visually blend
                            with the page.
                        */}
                        <img
                            src={storyImg}
                            alt="MessHub shared living experience"
                            className="
                                relative
                                block
                                h-auto
                                w-full
                                max-w-[720px]
                                object-contain
                                transition-transform
                                duration-500
                                ease-out
                                hover:scale-[1.015]
                            "
                        />
                    </div>

                </div>
            </section>


            {/* =========================================
                STORY CARDS
            ========================================== */}
            <section className="mt-14">

                {/* Small section heading */}
                <div className="mb-6">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary">
                        Why MessHub
                    </span>

                    <h3 className="mt-1.5 text-2xl font-extrabold tracking-tight text-neutral sm:text-3xl">
                        From everyday mess to organized living.
                    </h3>
                </div>


                {/* Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    {storyCards.map(
                        ({ num, icon: Icon, title, desc }) => (
                            <div
                                key={num}
                                className="
                                    group
                                    relative
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-primary/10
                                    bg-background
                                    p-5
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-primary/20
                                    hover:shadow-[0_12px_30px_rgba(23,59,58,0.10)]
                                "
                            >

                                {/* Decorative accent */}
                                <div
                                    className="
                                        absolute
                                        right-0
                                        top-0
                                        h-16
                                        w-16
                                        rounded-bl-full
                                        bg-primary/5
                                        transition-all
                                        duration-300
                                        group-hover:bg-primary/10
                                    "
                                />

                                <div className="relative">

                                    {/* Top row */}
                                    <div className="flex items-center justify-between">

                                        {/* Icon */}
                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-white
                                                text-primary
                                                shadow-sm
                                                transition-transform
                                                duration-300
                                                group-hover:scale-105
                                            "
                                        >
                                            <Icon
                                                size={19}
                                                strokeWidth={2.2}
                                            />
                                        </div>

                                        {/* Number */}
                                        <span className="text-[11px] font-extrabold tracking-[0.18em] text-primary/35">
                                            {num}
                                        </span>

                                    </div>


                                    {/* Content */}
                                    <h4 className="mt-4 text-[16px] font-extrabold text-neutral">
                                        {title}
                                    </h4>

                                    <p className="mt-2 text-[13px] font-medium leading-6 text-neutral/75">
                                        {desc}
                                    </p>

                                </div>
                            </div>
                        )
                    )}

                </div>
            </section>


            {/* =========================================
                BOTTOM CTA
            ========================================== */}
            <section className="mt-10">

                <div
                    className="
                        flex
                        flex-col
                        gap-5
                        rounded-2xl
                        border
                        border-primary/10
                        bg-background
                        px-5
                        py-5
                        sm:px-6
                        sm:py-6
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >

                    {/* CTA text */}
                    <div className="max-w-2xl">

                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-secondary" />

                            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-secondary">
                                Built for shared living
                            </span>
                        </div>

                        <h4 className="mt-2 text-[18px] font-extrabold text-neutral">
                            Ready to make your mess life simpler?
                        </h4>

                        <p className="mt-1 text-[13px] font-medium leading-5 text-neutral/75">
                            Find a mess, explore how MessHub works, and
                            experience a more organized way to manage shared
                            living.
                        </p>

                    </div>


                    {/* CTA buttons */}
                    <div className="flex shrink-0 flex-wrap gap-2.5">

                        <Link
                            to="/how-it-works"
                            className="
                                group
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-primary
                                px-5
                                py-2.5
                                text-xs
                                font-bold
                                text-white
                                shadow-sm
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:bg-primary/90
                                hover:shadow-md
                            "
                        >
                            How It Works

                            <ArrowRight
                                size={14}
                                strokeWidth={2.5}
                                className="
                                    transition-transform
                                    duration-300
                                    group-hover:translate-x-1
                                "
                            />
                        </Link>


                        <Link
                            to="/find-mess"
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-primary/20
                                bg-white
                                px-5
                                py-2.5
                                text-xs
                                font-bold
                                text-primary
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:border-primary/40
                                hover:bg-background
                            "
                        >
                            Find a Mess
                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default About;
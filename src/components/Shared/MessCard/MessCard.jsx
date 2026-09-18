import { MapPin, Star, ArrowRight, BadgeCheck } from "lucide-react";

/**
 * MessCard — reusable mess listing card.
 *
 * Props (mess object):
 *   id           number
 *   name         string
 *   location     string
 *   image        string   (URL)
 *   availableSeats number
 *   rating       number
 *   price        number   (BDT / month)
 *   mealCost     number   (estimated BDT / month)
 *   features     string[]
 *   verified     boolean
 */
const MessCard = ({ mess }) => {
    const {
        name,
        location,
        image,
        availableSeats,
        rating,
        price,
        mealCost,
        features = [],
        verified = false,
    } = mess;

    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(23,59,58,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_32px_rgba(23,59,58,0.14)]">

            {/* ── Image block ── */}
            <div className="relative overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Seat availability badge — bottom-left over image */}
                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-extrabold text-white shadow-sm">
                    {availableSeats} {availableSeats === 1 ? "Seat" : "Seats"} Available
                </span>

                {/* Rating badge — top-right */}
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-extrabold text-neutral shadow-sm backdrop-blur-sm">
                    <Star size={11} className="text-tertiary" fill="currentColor" strokeWidth={0} />
                    {rating.toFixed(1)}
                </span>

                {/* Verified ribbon — bottom-left corner, only when verified */}
                {verified && (
                    <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                        <BadgeCheck size={11} strokeWidth={2.5} />
                        Verified
                    </span>
                )}
            </div>

            {/* ── Card body ── */}
            <div className="flex flex-1 flex-col gap-3 p-4">

                {/* Name */}
                <h3 className="line-clamp-2 text-[15px] font-extrabold leading-snug text-neutral">
                    {name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
                    <MapPin size={13} className="shrink-0 text-primary" strokeWidth={2} />
                    <span className="truncate">{location}</span>
                </div>

                {/* Feature tags */}
                {features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {features.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full border border-primary/15 bg-background px-2.5 py-0.5 text-[10px] font-semibold text-primary"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Spacer so price always hugs the bottom */}
                <div className="flex-1" />

                {/* ── Price row ── */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <div>
                        {/* Main price */}
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-xl font-extrabold text-primary">
                                ৳{price.toLocaleString("en-BD")}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">/mo</span>
                        </div>
                        {/* Estimated meal cost */}
                        <p className="mt-0.5 text-[11px] text-slate-400">
                            Est. Meal: ৳{mealCost.toLocaleString("en-BD")}
                        </p>
                    </div>

                    {/* Arrow action button */}
                    <button
                        type="button"
                        aria-label={`View details for ${name}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-white group-hover:shadow-md"
                    >
                        <ArrowRight size={16} strokeWidth={2.5} />
                    </button>
                </div>

            </div>
        </article>
    );
};

export default MessCard;

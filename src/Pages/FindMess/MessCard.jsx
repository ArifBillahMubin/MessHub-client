import { MapPin, BedDouble, Utensils, ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router";

const ROOM_LABEL = { single: "Single Room", shared: "Shared Room", mixed: "Mixed" };
const FOOD_LABEL = { meal_system: "Meal System", self_cooking: "Self Cooking", both: "Both" };
const MESS_LABEL = { student: "Student", job_holder: "Job Holder", mixed: "Mixed" };

// Public card — seat badge MUST use advertisedSeats, not actualAvailableSeats
// Entire card is clickable — navigates to /find-mess/:id
const MessCard = ({ post, isSelected, cardRef }) => {
    const navigate    = useNavigate();
    const location    = post.mess?.location;
    const locationStr =
        [location?.area, location?.city].filter(Boolean).join(", ") ||
        location?.address ||
        "—";

    const goToDetails = () => navigate(`/find-mess/${post._id}`);

    return (
        <div
            ref={cardRef}
            onClick={goToDetails}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && goToDetails()}
            className={`group flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                isSelected ? "border-primary ring-2 ring-primary/20" : "border-gray-200"
            }`}
        >
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-background">
                {post.images?.[0] ? (
                    <img
                        src={post.images[0]}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <BedDouble size={36} className="text-primary/15" strokeWidth={1} />
                    </div>
                )}
                {/* Seat badge — always uses advertisedSeats */}
                <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                        <Users size={11} />
                        {post.advertisedSeats} Seat{post.advertisedSeats !== 1 ? "s" : ""} Available
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-4">
                {/* Mess name */}
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary/60">
                    {post.mess?.name || "Mess"}
                </p>

                {/* Post title */}
                <h3 className="text-sm font-bold text-neutral line-clamp-2 leading-snug">
                    {post.title || "Untitled"}
                </h3>

                {/* Location */}
                <div className="mt-1.5 flex items-center gap-1 text-xs text-neutral/60">
                    <MapPin size={11} className="shrink-0 text-primary/50" />
                    <span className="truncate">{locationStr}</span>
                </div>

                {/* Price */}
                {post.approximateMonthlyCost > 0 ? (
                    <p className="mt-2 text-lg font-extrabold text-neutral">
                        ৳{post.approximateMonthlyCost.toLocaleString()}
                        <span className="ml-1 text-xs font-semibold text-neutral/40">/ month</span>
                    </p>
                ) : (
                    <p className="mt-2 text-xs font-semibold italic text-neutral/30">Cost not listed</p>
                )}

                {/* Type chips */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {post.roomType && (
                        <span className="flex items-center gap-1 rounded-lg bg-background px-2 py-0.5 text-[10px] font-semibold text-neutral/70">
                            <BedDouble size={10} />
                            {ROOM_LABEL[post.roomType] || post.roomType}
                        </span>
                    )}
                    {post.foodSystem && (
                        <span className="flex items-center gap-1 rounded-lg bg-background px-2 py-0.5 text-[10px] font-semibold text-neutral/70">
                            <Utensils size={10} />
                            {FOOD_LABEL[post.foodSystem] || post.foodSystem}
                        </span>
                    )}
                    {post.messType && post.messType !== "mixed" && (
                        <span className="rounded-lg bg-background px-2 py-0.5 text-[10px] font-semibold text-neutral/70">
                            {MESS_LABEL[post.messType] || post.messType}
                        </span>
                    )}
                </div>

                {/* Facilities — compact */}
                {post.facilities?.length > 0 && (
                    <p className="mt-2 text-[10px] text-neutral/50 line-clamp-1">
                        {post.facilities.slice(0, 3).join(" · ")}
                        {post.facilities.length > 3 && ` +${post.facilities.length - 3}`}
                    </p>
                )}

                {/* View Details button — stop propagation so the card's own onClick still fires correctly */}
                <div
                    className="mt-auto pt-3 border-t border-gray-100"
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        type="button"
                        onClick={goToDetails}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary/90"
                    >
                        View Details
                        <ArrowRight size={13} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessCard;

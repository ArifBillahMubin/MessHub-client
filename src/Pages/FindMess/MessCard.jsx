import { MapPin, BedDouble, Utensils, ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router";

const ROOM_LABEL = { single: "Single Room", shared: "Shared Room", mixed: "Mixed" };
const FOOD_LABEL = { meal_system: "Meal System", self_cooking: "Self Cooking", both: "Both" };
const MESS_LABEL = { student: "Student", job_holder: "Job Holder", mixed: "Mixed" };

// Public card — seat badge MUST use advertisedSeats, not actualAvailableSeats
const MessCard = ({ post, isSelected, cardRef }) => {
    const navigate    = useNavigate();
    const location    = post.mess?.location;
    const locationStr =
        [location?.area, location?.city].filter(Boolean).join(", ") ||
        location?.address ||
        "—";

    return (
        <div
            ref={cardRef}
            className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                isSelected ? "border-primary ring-2 ring-primary/20" : "border-gray-200"
            }`}
        >
            {/* Image */}
            <div className="relative h-52 overflow-hidden bg-background">
                {post.images?.[0] ? (
                    <img
                        src={post.images[0]}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <BedDouble size={40} className="text-primary/15" strokeWidth={1} />
                    </div>
                )}
                {/* Seat badge — always uses advertisedSeats */}
                <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-white shadow-md">
                        <Users size={12} />
                        {post.advertisedSeats} Seat{post.advertisedSeats !== 1 ? "s" : ""} Available
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-5">
                {/* Mess name (sub-label) */}
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary/60">
                    {post.mess?.name || "Mess"}
                </p>

                {/* Post title — larger and more prominent */}
                <h3 className="text-base font-bold text-neutral line-clamp-2 leading-snug sm:text-lg">
                    {post.title || "Untitled"}
                </h3>

                {/* Location */}
                <div className="mt-2 flex items-center gap-1.5 text-sm text-neutral/60">
                    <MapPin size={13} className="shrink-0 text-primary/50" />
                    <span className="truncate">{locationStr}</span>
                </div>

                {/* Price — headline figure */}
                {post.approximateMonthlyCost > 0 ? (
                    <p className="mt-3 text-xl font-extrabold text-neutral sm:text-2xl">
                        ৳{post.approximateMonthlyCost.toLocaleString()}
                        <span className="ml-1.5 text-sm font-semibold text-neutral/40">/ month</span>
                    </p>
                ) : (
                    <p className="mt-3 text-sm font-semibold text-neutral/30 italic">Cost not listed</p>
                )}

                {/* Type chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                    {post.roomType && (
                        <span className="flex items-center gap-1 rounded-lg bg-background px-2.5 py-1 text-xs font-semibold text-neutral/70">
                            <BedDouble size={11} />
                            {ROOM_LABEL[post.roomType] || post.roomType}
                        </span>
                    )}
                    {post.foodSystem && (
                        <span className="flex items-center gap-1 rounded-lg bg-background px-2.5 py-1 text-xs font-semibold text-neutral/70">
                            <Utensils size={11} />
                            {FOOD_LABEL[post.foodSystem] || post.foodSystem}
                        </span>
                    )}
                    {post.messType && post.messType !== "mixed" && (
                        <span className="rounded-lg bg-background px-2.5 py-1 text-xs font-semibold text-neutral/70">
                            {MESS_LABEL[post.messType] || post.messType}
                        </span>
                    )}
                </div>

                {/* Facilities */}
                {post.facilities?.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {post.facilities.slice(0, 4).map(f => (
                            <span key={f} className="rounded-md bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-neutral/60 border border-gray-100">
                                {f}
                            </span>
                        ))}
                        {post.facilities.length > 4 && (
                            <span className="rounded-md bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-neutral/40 border border-gray-100">
                                +{post.facilities.length - 4} more
                            </span>
                        )}
                    </div>
                )}

                {/* Description */}
                {post.description && (
                    <p className="mt-3 text-sm leading-relaxed text-neutral/55 line-clamp-2">
                        {post.description}
                    </p>
                )}

                {/* View Details — navigates to /find-mess/:id */}
                <div className="mt-auto pt-4 border-t border-gray-100 mt-4">
                    <button
                        type="button"
                        onClick={() => navigate(`/find-mess/${post._id}`)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 hover:shadow-md"
                    >
                        View Details
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessCard;

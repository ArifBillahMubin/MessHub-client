import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import MessCard from "../../../components/Shared/MessCard/MessCard";

/* Mock data — replace with backend / API data when ready. */
const messData = [
    {
        id: 1,
        name: "Green Haven Bachelor Flat",
        location: "Dhanmondi Road 6A, Dhaka",
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop",
        availableSeats: 2,
        rating: 4.9,
        price: 5200,
        mealCost: 2800,
        features: ["Attached Bath", "Cook 2x/day", "Lift", "WiFi"],
        verified: true,
    },
    {
        id: 2,
        name: "Shapla Nibas University Mess",
        location: "Mirpur-2, Near Stadium, Dhaka",
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop",
        availableSeats: 1,
        rating: 4.8,
        price: 3800,
        mealCost: 2400,
        features: ["Study Friendly", "100 Mbps Net", "Maid Service"],
        verified: true,
    },
    {
        id: 3,
        name: "North Star Executive Flat",
        location: "Uttara Sector 11, Dhaka",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop",
        availableSeats: 3,
        rating: 5.0,
        price: 6500,
        mealCost: 3200,
        features: ["AC Room", "Daily Bazar", "Generator", "Filter Water"],
        verified: true,
    },
    {
        id: 4,
        name: "Shadhinota Shared Residence",
        location: "Mohammadpur Ring Road, Dhaka",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop",
        availableSeats: 1,
        rating: 4.7,
        price: 4400,
        mealCost: 2600,
        features: ["Balcony", "Gas Line", "Quiet Zone"],
        verified: false,
    },
];

const MessListings = () => (
    <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">

            {/*  Section header  */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                {/* Left — label + title + subtitle */}
                <div>
                    <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-secondary">
                        Vacant Bachelor Beds
                    </p>
                    <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-neutral sm:text-4xl">
                        Looking for a mess?
                    </h2>
                    <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-slate-500">
                        Your next home might be closer than you think. Verified bachelor flats across BD.
                    </p>
                </div>

                {/* Right — Explore link */}
                <Link
                    to="/find-mess"
                    className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-secondary sm:mb-1"
                >
                    Explore All 40+ Messes
                    <ArrowRight size={15} strokeWidth={2.5} />
                </Link>
            </div>

            {/*  Card grid  */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {messData.map((mess) => (
                    <MessCard key={mess.id} mess={mess} />
                ))}
            </div>

        </div>
    </section>
);

export default MessListings;

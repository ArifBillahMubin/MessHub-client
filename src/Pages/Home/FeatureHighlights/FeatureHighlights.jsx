import { UtensilsCrossed, ShoppingCart, Wallet, Users } from "lucide-react";

const features = [
    {
        Icon: UtensilsCrossed,
        iconBg: "bg-primary/10",
        iconCls: "text-primary",
        title: "Daily Meals",
        description:
            "Track daily meals easily. Set member preferences, count on/off before 10 AM, and avoid wasted food.",
    },
    {
        Icon: ShoppingCart,
        iconBg: "bg-secondary/10",
        iconCls: "text-secondary",
        title: "Bazar Tracking",
        description:
            "Keep every bazar expense organized. Upload slips, categorize grocery lists, and divide costs smoothly.",
    },
    {
        Icon: Wallet,
        iconBg: "bg-primary/10",
        iconCls: "text-primary",
        title: "Shared Expenses",
        description:
            "Know where the money goes. Flat rent, high-speed wifi, gas cylinders, and cook khala salary automatically tracked.",
    },
    {
        Icon: Users,
        iconBg: "bg-tertiary/10",
        iconCls: "text-tertiary",
        title: "Member Seats",
        description:
            "Manage members and vacant beds easily. Public listing, instant booking requests, and role handovers.",
    },
];

/* 
   Inline keyframes — fade-up entrance, no extra CSS file or package needed
 */
const keyframes = `
    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
    }
`;

/* 
   FeatureHighlights
 */
const FeatureHighlights = () => (
    <section className="w-full bg-background border-t-4 border-primary/13 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        <style>{keyframes}</style>

        {/* 4-col desktop · 2-col tablet · 1-col mobile */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ Icon, iconBg, iconCls, title, description }, idx) => (
                <div
                    key={title}
                    className="
                        group relative overflow-hidden rounded-2xl bg-white p-6
                        shadow-[0_2px_12px_rgba(23,59,58,0.07)]
                        transition-all duration-300
                        hover:-translate-y-1.5 hover:shadow-[0_8px_28px_rgba(23,59,58,0.13)]
                    "
                    style={{
                        animation: `fadeUp 0.45s ease both`,
                        animationDelay: `${idx * 90}ms`,
                    }}
                >
                    {/* Icon container */}
                    <div
                        className={`
                            mb-4 inline-flex h-11 w-11 items-center justify-center
                            rounded-xl ${iconBg}
                            transition-transform duration-300
                            group-hover:scale-110
                        `}
                    >
                        <Icon
                            size={20}
                            className={`${iconCls} transition-transform duration-300 group-hover:scale-105`}
                            strokeWidth={1.9}
                        />
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-lg font-extrabold text-neutral">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-[1.7] text-gray-700">
                        {description}
                    </p>

                    {/* Subtle bottom accent line — expands on hover */}
                    <div
                        className={`
                            absolute bottom-0 left-0 h-[3px] w-0 rounded-full
                            ${iconBg.replace("/10", "")} opacity-70
                            transition-all duration-300 group-hover:w-full
                        `}
                    />
                </div>
            ))}
        </div>
    </section>
);

export default FeatureHighlights;

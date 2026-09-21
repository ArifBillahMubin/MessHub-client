import { Utensils, Users, TrendingUp } from "lucide-react";

const Card = ({ icon, label, value, sub }) => (
    <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-white px-4 py-4 shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
        </span>
        <div className="min-w-0">
            <p className="text-xl font-extrabold text-neutral leading-none">{value}</p>
            <p className="mt-0.5 text-xs font-semibold text-neutral/60">{label}</p>
            {sub && <p className="mt-0.5 text-[10px] text-neutral/40">{sub}</p>}
        </div>
    </div>
);

// totalMeals  — sum of all daily totals for the month
// activeCount — number of active mess members
const MealsSummary = ({ totalMeals, activeCount }) => {
    const avg = activeCount > 0 ? (totalMeals / activeCount).toFixed(1) : "0.0";

    return (
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Card
                icon={<Utensils size={18} strokeWidth={2} />}
                label="Total Meals"
                value={totalMeals.toFixed(1)}
                sub="This month"
            />
            <Card
                icon={<Users size={18} strokeWidth={2} />}
                label="Active Members"
                value={activeCount}
                sub="Currently active"
            />
            <Card
                icon={<TrendingUp size={18} strokeWidth={2} />}
                label="Avg Meals / Member"
                value={avg}
                sub="This month"
            />
        </div>
    );
};

export default MealsSummary;

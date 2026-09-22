import { Utensils } from "lucide-react";

const MONTH_NAMES = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
];

const MealsHeader = ({ year, month }) => (
    <div className="mb-6">
        {/* Title */}
        <div className="mb-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Utensils size={18} strokeWidth={2} />
            </span>
            <div>
                <h1 className="text-xl font-extrabold text-neutral">Meals</h1>
                <p className="text-xs font-medium text-neutral/50">
                    Track and manage daily meals for your mess.
                </p>
            </div>
        </div>

        {/* Current month label (no navigation) */}
        <div className="flex items-center justify-center">
            <p className="text-base font-extrabold text-neutral">
                {MONTH_NAMES[month]} {year}
            </p>
        </div>
    </div>
);

export default MealsHeader;

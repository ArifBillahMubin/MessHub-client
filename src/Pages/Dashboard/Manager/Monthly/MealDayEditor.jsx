import { useState } from "react";
import { X, Loader2, Utensils } from "lucide-react";

const SLOTS = ["breakfast", "lunch", "dinner"];
const SLOT_LABELS = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };
const VALUES = [0, 0.5, 1];

// Compact toggle button for a meal slot value
const MealToggle = ({ value, selected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`h-7 w-10 rounded-lg text-xs font-bold transition ${
            selected
                ? "bg-primary text-white shadow-sm"
                : "border border-gray-200 bg-white text-neutral/60 hover:border-primary/30 hover:text-primary"
        }`}
    >
        {value === 0 ? "0" : value === 0.5 ? "½" : "1"}
    </button>
);

// Guest Meal numeric input component
const GuestMealInput = ({ value, onChange }) => {
    const handleChange = (e) => {
        const raw = e.target.value;
        // Allow empty temporarily (will be treated as 0 on save)
        if (raw === "") {
            onChange(0);
            return;
        }

        const num = parseFloat(raw);
        // Validate: non-negative and multiple of 0.5
        if (isNaN(num) || num < 0) {
            return; // Invalid, don't update
        }

        // Check if it's a multiple of 0.5
        if (Math.abs((num * 2) % 1) < 0.001) {
            onChange(num);
        }
    };

    const displayValue = value === 0 ? "" : value;

    return (
        <input
            type="number"
            value={displayValue}
            onChange={handleChange}
            step="0.5"
            min="0"
            placeholder="0"
            className="h-7 w-16 rounded-lg border border-gray-200 bg-white px-2 text-center text-xs font-semibold text-neutral transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
    );
};

// dateLabel: "21 September 2026"
const MONTH_NAMES = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
];

const MealDayEditor = ({ year, month, day, members, existingEntries, onSave, onClose, isSaving }) => {
    const dateLabel = `${day} ${MONTH_NAMES[month]} ${year}`;

    // initialise editor state from existing entries or default to 0
    const buildInitial = () => {
        const entryMap = {};
        for (const e of existingEntries || []) {
            entryMap[e.userId] = {
                breakfast: e.breakfast ?? 0,
                lunch:     e.lunch     ?? 0,
                dinner:    e.dinner    ?? 0,
                guestMeal: e.guestMeal ?? 0,
            };
        }
        const result = {};
        for (const m of members) {
            result[m._id] = entryMap[m.userId] ?? { breakfast: 0, lunch: 0, dinner: 0, guestMeal: 0 };
        }
        return result;
    };

    const [entries, setEntries] = useState(buildInitial);

    const setSlot = (memberId, slot, val) => {
        setEntries(prev => ({
            ...prev,
            [memberId]: { ...prev[memberId], [slot]: val },
        }));
    };

    const setGuestMeal = (memberId, val) => {
        setEntries(prev => ({
            ...prev,
            [memberId]: { ...prev[memberId], guestMeal: val },
        }));
    };

    const rowTotal = (memberId) => {
        const e = entries[memberId];
        return (e.breakfast + e.lunch + e.dinner + e.guestMeal);
    };

    const fmt = (n) => (n === Math.floor(n) ? String(n) : n.toFixed(1));

    const handleSave = () => {
        const payload = members.map(m => ({
            userId:    m.userId,
            breakfast: entries[m._id].breakfast,
            lunch:     entries[m._id].lunch,
            dinner:    entries[m._id].dinner,
            guestMeal: entries[m._id].guestMeal,
        }));
        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-neutral/40 backdrop-blur-[2px]" onClick={onClose} />

            <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Utensils size={15} strokeWidth={2} />
                        </span>
                        <div>
                            <p className="text-sm font-extrabold text-neutral">{dateLabel}</p>
                            <p className="text-[10px] text-neutral/50">Set meals for each member</p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} disabled={isSaving}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral/40 transition hover:bg-background hover:text-neutral disabled:opacity-50">
                        <X size={17} />
                    </button>
                </div>

                {/* Table */}
                <div className="max-h-[60vh] overflow-y-auto">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="sticky top-0 z-10 bg-white">
                                <tr className="border-b border-gray-100">
                                    <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">Member</th>
                                    {SLOTS.map(s => (
                                        <th key={s} className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                            {SLOT_LABELS[s]}
                                        </th>
                                    ))}
                                    <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                        Guest Meal
                                    </th>
                                    <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-primary/50">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map(m => (
                                    <tr key={m._id} className="border-b border-gray-50">
                                        {/* Member */}
                                        <td className="px-4 py-2.5">
                                            <div className="flex items-center gap-2">
                                                {m.photoURL ? (
                                                    <img src={m.photoURL} alt={m.name} referrerPolicy="no-referrer"
                                                        className="h-6 w-6 shrink-0 rounded-full object-cover" />
                                                ) : (
                                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                                        {m.name?.charAt(0).toUpperCase() || "?"}
                                                    </span>
                                                )}
                                                <span className="font-semibold text-neutral/80 truncate max-w-[100px]">
                                                    {m.name || "—"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Meal toggles */}
                                        {SLOTS.map(slot => (
                                            <td key={slot} className="px-3 py-2.5">
                                                <div className="flex items-center justify-center gap-1">
                                                    {VALUES.map(v => (
                                                        <MealToggle
                                                            key={v}
                                                            value={v}
                                                            selected={entries[m._id][slot] === v}
                                                            onClick={() => setSlot(m._id, slot, v)}
                                                        />
                                                    ))}
                                                </div>
                                            </td>
                                        ))}

                                        {/* Guest Meal Input */}
                                        <td className="px-3 py-2.5">
                                            <div className="flex items-center justify-center">
                                                <GuestMealInput
                                                    value={entries[m._id].guestMeal}
                                                    onChange={(val) => setGuestMeal(m._id, val)}
                                                />
                                            </div>
                                        </td>

                                        {/* Row total */}
                                        <td className="px-4 py-2.5 text-right">
                                            <span className="font-mono text-xs font-extrabold text-primary">
                                                {fmt(rowTotal(m._id))}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4">
                    <button type="button" onClick={onClose} disabled={isSaving}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-neutral transition hover:bg-gray-50 disabled:opacity-60">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSave} disabled={isSaving}
                        className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60">
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                        {isSaving ? "Saving…" : "Save Meals"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MealDayEditor;

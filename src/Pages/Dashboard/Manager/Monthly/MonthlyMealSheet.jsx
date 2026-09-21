// Monthly meal sheet — one column per day, one row per member.
// Clicking a day column header opens the DayEditor for that date.
// All calculations are done here; nothing is stored in MongoDB.

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

// Build a lookup: { "YYYY-MM-DD" => { userId => { breakfast, lunch, dinner, guestMeal } } }
const buildDayMap = (mealDocs) => {
    const map = {};
    for (const doc of mealDocs) {
        const d = new Date(doc.date);
        // Use UTC parts to get the correct date regardless of local timezone
        const key = [
            d.getUTCFullYear(),
            String(d.getUTCMonth() + 1).padStart(2, "0"),
            String(d.getUTCDate()).padStart(2, "0"),
        ].join("-");
        map[key] = {};
        for (const entry of doc.entries || []) {
            map[key][entry.userId] = {
                breakfast: entry.breakfast ?? 0,
                lunch:     entry.lunch     ?? 0,
                dinner:    entry.dinner    ?? 0,
                guestMeal: entry.guestMeal ?? 0,
            };
        }
    }
    return map;
};

const memberDayTotal = (entry) =>
    (entry?.breakfast ?? 0) + (entry?.lunch ?? 0) + (entry?.dinner ?? 0) + (entry?.guestMeal ?? 0);

const fmt = (n) => (n === Math.floor(n) ? String(n) : n.toFixed(1));

const MonthlyMealSheet = ({ year, month, members, mealDocs, onDayClick }) => {
    const days = daysInMonth(year, month);
    const dayMap = buildDayMap(mealDocs);

    // Get today in Bangladesh time for comparison
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    // Check if a day is in the future
    const isFuture = (day) => {
        if (year > todayYear) return true;
        if (year < todayYear) return false;
        if (month > todayMonth) return true;
        if (month < todayMonth) return false;
        return day > todayDay;
    };

    // Ordered list of day numbers [1..days]
    const dayNums = Array.from({ length: days }, (_, i) => i + 1);

    const dateKey = (day) =>
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // Per-member monthly total
    const memberTotal = (memberId) =>
        dayNums.reduce((sum, d) => {
            const entry = dayMap[dateKey(d)]?.[memberId];
            return sum + memberDayTotal(entry);
        }, 0);

    // Per-day total (all members)
    const dayTotal = (day) => {
        const dk = dateKey(day);
        return members.reduce((sum, m) => {
            const entry = dayMap[dk]?.[m.userId];
            return sum + memberDayTotal(entry);
        }, 0);
    };

    const grandTotal = members.reduce((s, m) => s + memberTotal(m.userId), 0);

    if (members.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-primary/20 bg-white py-16 text-center">
                <p className="text-sm font-bold text-neutral">No active members</p>
                <p className="mt-1 text-xs text-neutral/50">Add members to start tracking meals.</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-primary/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {/* Sticky member column */}
                            <th className="sticky left-0 z-10 min-w-[120px] bg-white px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                Member
                            </th>
                            {/* Day columns — each is clickable */}
                            {dayNums.map(d => {
                                const future = isFuture(d);
                                return (
                                    <th key={d} className="min-w-[32px] px-0.5 py-3 text-center">
                                        <button
                                            type="button"
                                            onClick={() => !future && onDayClick(d)}
                                            disabled={future}
                                            className={`flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold mx-auto transition ${
                                                future
                                                    ? "cursor-not-allowed text-neutral/20 bg-gray-50"
                                                    : "text-neutral/60 hover:bg-primary hover:text-white"
                                            }`}
                                            title={future ? "Future date" : `Edit ${dateKey(d)}`}
                                        >
                                            {d}
                                        </button>
                                    </th>
                                );
                            })}
                            <th className="sticky right-0 z-10 min-w-[52px] bg-white px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-primary/60">
                                Total
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {members.map((m) => {
                            const rowTotal = memberTotal(m.userId);
                            return (
                                <tr key={m._id} className="border-b border-gray-50 hover:bg-background/40 transition">
                                    {/* Member name */}
                                    <td className="sticky left-0 z-10 bg-white px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            {m.photoURL ? (
                                                <img src={m.photoURL} alt={m.name} referrerPolicy="no-referrer"
                                                    className="h-6 w-6 shrink-0 rounded-full object-cover" />
                                            ) : (
                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                                    {m.name?.charAt(0).toUpperCase() || "?"}
                                                </span>
                                            )}
                                            <span className="max-w-[80px] truncate font-semibold text-neutral/80">
                                                {m.name || "—"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Day cells */}
                                    {dayNums.map(d => {
                                        const entry = dayMap[dateKey(d)]?.[m.userId];
                                        const total = memberDayTotal(entry);
                                        const future = isFuture(d);
                                        return (
                                            <td key={d} className="px-0.5 py-2 text-center">
                                                <span className={`font-mono text-[11px] font-semibold ${
                                                    future ? "text-neutral/15" :
                                                    total === 0 ? "text-neutral/25" :
                                                    total >= 2.5 ? "text-secondary" :
                                                    "text-neutral/70"
                                                }`}>
                                                    {total === 0 ? "·" : fmt(total)}
                                                </span>
                                            </td>
                                        );
                                    })}

                                    {/* Row total */}
                                    <td className="sticky right-0 z-10 bg-white px-3 py-2 text-right">
                                        <span className="font-mono text-xs font-extrabold text-primary">
                                            {fmt(rowTotal)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>

                    {/* Footer: per-day totals */}
                    <tfoot>
                        <tr className="border-t border-gray-200 bg-background/60">
                            <td className="sticky left-0 z-10 bg-background/60 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-neutral/50">
                                Total
                            </td>
                            {dayNums.map(d => {
                                const dt = dayTotal(d);
                                return (
                                    <td key={d} className="px-0.5 py-2.5 text-center">
                                        <span className={`font-mono text-[11px] font-bold ${dt === 0 ? "text-neutral/25" : "text-neutral/70"}`}>
                                            {dt === 0 ? "·" : fmt(dt)}
                                        </span>
                                    </td>
                                );
                            })}
                            <td className="sticky right-0 z-10 bg-background/60 px-3 py-2.5 text-right">
                                <span className="font-mono text-xs font-extrabold text-primary">
                                    {fmt(grandTotal)}
                                </span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <p className="px-4 py-2 text-[10px] text-neutral/40">
                Click a day number to edit meals. Future dates cannot be edited.
            </p>
        </div>
    );
};

export default MonthlyMealSheet;

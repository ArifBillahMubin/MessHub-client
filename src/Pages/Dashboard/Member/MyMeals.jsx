import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Utensils, Coffee, Sun, Moon, Calendar, Users, ChevronLeft, ChevronRight } from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useCurrentUser from "../../../hooks/useCurrentUser";
import Loading from "../../../components/Loading/Loading";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const ITEMS_PER_PAGE = 6;

const MyMeals = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { currentUser, isUserLoading } = useCurrentUser();

    // Use current month only (Bangladesh time)
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const today = now.getDate();

    const [messId, setMessId] = useState(null);
    const [myUserId, setMyUserId] = useState(null);
    const [mealDocs, setMealDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const loadData = useCallback(async () => {
        if (!user?.email || !currentUser) return;
        setLoading(true);
        try {
            // Get my mess
            const messRes = await axiosSecure.get(`/users/my-mess?email=${user.email}`);
            const messData = messRes.data.mess;
            if (!messData) {
                setLoading(false);
                return;
            }
            setMessId(messData._id);
            setMyUserId(currentUser._id);

            // Get meal docs for current month
            const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
            const mealsRes = await axiosSecure.get(`/meals/mess/${messData._id}?month=${monthStr}`);
            setMealDocs(mealsRes.data || []);
        } catch (err) {
            toast.error("Failed to load meal data.", {
                style: { borderRadius: "12px", background: "#ffffff", color: "#173B3A", border: "1px solid #FF8A00", fontWeight: "600" },
                iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
            });
        } finally {
            setLoading(false);
        }
    }, [user, currentUser, axiosSecure, year, month]);

    useEffect(() => { loadData(); }, [loadData]);

    // Generate all calendar dates for the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const allDates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Build a map of meal data by day
    const mealsByDay = {};
    mealDocs.forEach(doc => {
        const d = new Date(doc.date);
        const day = d.getUTCDate();
        const myEntry = doc.entries?.find(e => e.userId === myUserId);
        if (myEntry) {
            mealsByDay[day] = {
                breakfast: myEntry.breakfast ?? 0,
                lunch: myEntry.lunch ?? 0,
                dinner: myEntry.dinner ?? 0,
                guestMeal: myEntry.guestMeal ?? 0,
            };
        }
    });

    // Map all calendar dates to display data
    const allMealRecords = allDates.map(day => {
        const record = mealsByDay[day];
        if (record) {
            return {
                day,
                hasRecord: true,
                breakfast: record.breakfast,
                lunch: record.lunch,
                dinner: record.dinner,
                guestMeal: record.guestMeal,
                total: record.breakfast + record.lunch + record.dinner + record.guestMeal,
            };
        } else {
            return {
                day,
                hasRecord: false,
                breakfast: 0,
                lunch: 0,
                dinner: 0,
                guestMeal: 0,
                total: 0,
            };
        }
    });

    // Calculate summary (only from days with actual records)
    const recordedMeals = allMealRecords.filter(m => m.hasRecord);
    const totalBreakfast = recordedMeals.reduce((sum, m) => sum + m.breakfast, 0);
    const totalLunch = recordedMeals.reduce((sum, m) => sum + m.lunch, 0);
    const totalDinner = recordedMeals.reduce((sum, m) => sum + m.dinner, 0);
    const totalGuestMeal = recordedMeals.reduce((sum, m) => sum + m.guestMeal, 0);
    const totalMeals = totalBreakfast + totalLunch + totalDinner + totalGuestMeal;
    const avgPerDay = recordedMeals.length > 0 ? (totalMeals / recordedMeals.length).toFixed(1) : "0.0";

    // Pagination
    const totalPages = Math.ceil(allMealRecords.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedRecords = allMealRecords.slice(startIndex, endIndex);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const fmt = (n) => (n === Math.floor(n) ? String(n) : n.toFixed(1));

    if (loading || isUserLoading) return <Loading />;

    if (!currentUser?.hasMess || !messId) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Utensils size={28} strokeWidth={1.8} />
                </span>
                <div>
                    <p className="text-sm font-bold text-neutral">No Active Mess</p>
                    <p className="mt-1 text-xs text-neutral/50">Join a mess to view your meal records.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl">
            {/* Page Header */}
            <div className="mb-6">
                <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Utensils size={18} strokeWidth={2} />
                    </span>
                    <div>
                        <h1 className="text-xl font-extrabold text-neutral">My Meals</h1>
                        <p className="text-xs font-medium text-neutral/50">
                            View your personal meal records for this month.
                        </p>
                    </div>
                </div>

                {/* Current month label */}
                <div className="flex items-center justify-center">
                    <p className="text-base font-extrabold text-neutral">
                        {MONTH_NAMES[month]} {year}
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
                <SummaryCard
                    icon={<Utensils size={18} strokeWidth={2} />}
                    label="Total Meals"
                    value={fmt(totalMeals)}
                    color="primary"
                />
                <SummaryCard
                    icon={<Coffee size={18} strokeWidth={2} />}
                    label="Breakfast"
                    value={fmt(totalBreakfast)}
                    color="secondary"
                />
                <SummaryCard
                    icon={<Sun size={18} strokeWidth={2} />}
                    label="Lunch"
                    value={fmt(totalLunch)}
                    color="tertiary"
                />
                <SummaryCard
                    icon={<Moon size={18} strokeWidth={2} />}
                    label="Dinner"
                    value={fmt(totalDinner)}
                    color="neutral"
                />
                <SummaryCard
                    icon={<Users size={18} strokeWidth={2} />}
                    label="Guest Meals"
                    value={fmt(totalGuestMeal)}
                    color="primary"
                />
            </div>

            {/* Monthly Total */}
            <div className="mb-5 rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 text-center shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral/50">Monthly Total</p>
                <p className="mt-2 font-mono text-4xl font-extrabold text-primary">{fmt(totalMeals)}</p>
                <p className="mt-1 text-xs text-neutral/60">Average {avgPerDay} meals per day</p>
            </div>

            {/* Meal Records Table */}
            <div className="rounded-2xl border border-primary/10 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <h2 className="flex items-center gap-2 text-sm font-extrabold text-neutral">
                        <Calendar size={16} className="text-primary" />
                        Daily Records
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-background/40">
                                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">Date</th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">Breakfast</th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">Lunch</th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">Dinner</th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">Guest Meal</th>
                                <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-primary/60">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRecords.map((meal) => {
                                const isToday = meal.day === today;
                                return (
                                    <tr
                                        key={meal.day}
                                        className={`border-b border-gray-50 ${isToday ? "bg-primary/5" : "hover:bg-background/30"} transition`}
                                    >
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-neutral">
                                                    {MONTH_NAMES[month].slice(0, 3)} {String(meal.day).padStart(2, "0")}
                                                </span>
                                                {isToday && (
                                                    <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-bold text-secondary">
                                                        Today
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        {meal.hasRecord ? (
                                            <>
                                                <td className="px-4 py-3 text-center">
                                                    <MealBadge value={meal.breakfast} />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <MealBadge value={meal.lunch} />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <MealBadge value={meal.dinner} />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <MealBadge value={meal.guestMeal} />
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <span className="font-mono text-base font-bold text-primary">
                                                        {fmt(meal.total)}
                                                    </span>
                                                </td>
                                            </>
                                        ) : (
                                            <td colSpan="5" className="px-6 py-3 text-center">
                                                <span className="text-xs text-neutral/40">No meal this day</span>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="border-t border-gray-100 px-6 py-4">
                        <div className="flex items-center justify-between gap-4">
                            {/* Page info */}
                            <p className="text-xs text-neutral/50">
                                Showing {startIndex + 1}-{Math.min(endIndex, allMealRecords.length)} of {allMealRecords.length} days
                            </p>

                            {/* Pagination controls */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-neutral transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {/* Page numbers */}
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageClick(page)}
                                            className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${
                                                page === currentPage
                                                    ? "bg-primary text-white shadow-sm"
                                                    : "border border-gray-200 text-neutral hover:bg-background"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-neutral transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SummaryCard = ({ icon, label, value, color }) => {
    const colorClasses = {
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/10 text-secondary",
        tertiary: "bg-tertiary/10 text-tertiary",
        neutral: "bg-neutral/10 text-neutral",
    };

    return (
        <div className="rounded-2xl border border-primary/10 bg-white p-4 shadow-sm">
            <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${colorClasses[color]}`}>
                {icon}
            </div>
            <p className="font-mono text-xl font-extrabold text-neutral">{value}</p>
            <p className="mt-0.5 text-[10px] font-semibold text-neutral/60">{label}</p>
        </div>
    );
};

const MealBadge = ({ value }) => {
    if (value === 0) {
        return <span className="text-neutral/20">—</span>;
    }

    const label = value === 0.5 ? "½" : value === 1 ? "1" : value.toFixed(1);

    return (
        <span className="inline-flex h-7 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 font-mono text-xs font-bold text-primary">
            {label}
        </span>
    );
};

export default MyMeals;

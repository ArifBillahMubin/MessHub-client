import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import Loading from "../../../../components/Loading/Loading";
import MealsHeader from "./MealsHeader";
import MealsSummary from "./MealsSummary";
import MonthlyMealSheet from "./MonthlyMealSheet";
import MealDayEditor from "./MealDayEditor";

const toastSuccess = (msg) => toast.success(msg, {
    duration: 3000,
    style: { borderRadius: "12px", background: "#D5FBF9", color: "#173B3A", border: "1px solid #006B68", fontWeight: "600" },
    iconTheme: { primary: "#006B68", secondary: "#ffffff" },
});
const toastError = (msg) => toast.error(msg, {
    duration: 4000,
    style: { borderRadius: "12px", background: "#ffffff", color: "#173B3A", border: "1px solid #FF8A00", fontWeight: "600" },
    iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
});

const Meals = () => {
    const axiosSecure = useAxiosSecure();
    const { user }    = useAuth();

    // Use CURRENT month only (Bangladesh time)
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const [year]  = useState(now.getFullYear());
    const [month] = useState(now.getMonth()); // 0-indexed

    // Mess + members (loaded once; members only change when membership changes)
    const [messId,      setMessId]      = useState(null);
    const [members,     setMembers]     = useState([]);
    const [initLoading, setInitLoading] = useState(true);

    // Monthly meal docs for the selected month
    const [mealDocs,     setMealDocs]    = useState([]);
    const [monthLoading, setMonthLoading] = useState(false);

    // Day editor
    const [editorDay,   setEditorDay]   = useState(null); // null = closed, number = open
    const [isSaving,    setIsSaving]    = useState(false);

    // ── Initial load: mess + all active members ───────────────────────────────
    const loadInit = useCallback(async () => {
        if (!user?.email) return;
        setInitLoading(true);
        try {
            const messRes = await axiosSecure.get(`/users/my-mess?email=${user.email}`);
            const mess = messRes.data.mess;
            if (!mess) { setInitLoading(false); return; }
            setMessId(mess._id);

            // Fetch all active members (no pagination — meals needs every member)
            const membersRes = await axiosSecure.get(`/mess-members/${mess._id}?limit=50`);
            setMembers(membersRes.data.members ?? []);
        } catch {
            toastError("Failed to load mess data.");
        } finally {
            setInitLoading(false);
        }
    }, [user, axiosSecure]);

    useEffect(() => { loadInit(); }, [loadInit]);

    // ── Load meal docs for the selected month ─────────────────────────────────
    const loadMonth = useCallback(async () => {
        if (!messId) return;
        setMonthLoading(true);
        try {
            const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
            const res = await axiosSecure.get(`/meals/mess/${messId}?month=${monthStr}`);
            setMealDocs(res.data ?? []);
        } catch {
            toastError("Failed to load meal data.");
        } finally {
            setMonthLoading(false);
        }
    }, [messId, year, month, axiosSecure]);

    useEffect(() => { loadMonth(); }, [loadMonth]);

    // ── Day click handler with date validation ────────────────────────────────
    const handleDayClick = async (day) => {
        // Get today in Bangladesh time
        const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
        const todayDay = today.getDate();

        // Future date — not editable
        if (day > todayDay) {
            return; // Do nothing, MonthlyMealSheet will show it as disabled
        }

        // Past date — show confirmation
        if (day < todayDay) {
            const MONTH_NAMES = [
                "January","February","March","April","May","June",
                "July","August","September","October","November","December",
            ];
            const confirmed = await Swal.fire({
                title: "Modify Past Meal?",
                text: `This meal record is from ${MONTH_NAMES[month]} ${day}. Are you sure you want to modify it?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Modify Meal",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#FF8A00",
                cancelButtonColor: "#6b7280",
            });
            if (!confirmed.isConfirmed) return;
        }

        // Today or confirmed past date — open editor
        setEditorDay(day);
    };

    const closeEditor = () => setEditorDay(null);

    // Build the existing entries for the selected day
    const existingEntriesForDay = () => {
        if (!editorDay) return [];
        const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(editorDay).padStart(2, "0")}`;
        const doc = mealDocs.find(d => {
            const dd = new Date(d.date);
            const k = [
                dd.getUTCFullYear(),
                String(dd.getUTCMonth() + 1).padStart(2, "0"),
                String(dd.getUTCDate()).padStart(2, "0"),
            ].join("-");
            return k === key;
        });
        return doc?.entries ?? [];
    };

    // ── Save a day's meals ────────────────────────────────────────────────────
    const handleSave = async (payload) => {
        if (!messId || !editorDay || !user?.email) return;
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(editorDay).padStart(2, "0")}`;
        setIsSaving(true);
        try {
            await axiosSecure.put(`/meals/mess/${messId}/date/${dateStr}`, {
                email:   user.email,
                entries: payload,
            });
            await loadMonth(); // refresh the sheet
            toastSuccess("Meals saved.");
            closeEditor();
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to save meals.";
            toastError(msg);
        } finally {
            setIsSaving(false);
        }
    };

    // ── Summary calculations ──────────────────────────────────────────────────
    // Total meals = sum of all member×day totals across the loaded mealDocs
    const totalMeals = mealDocs.reduce((sum, doc) => {
        for (const e of doc.entries || []) {
            sum += (e.breakfast ?? 0) + (e.lunch ?? 0) + (e.dinner ?? 0) + (e.guestMeal ?? 0);
        }
        return sum;
    }, 0);

    if (initLoading) return <Loading />;

    if (!messId) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <p className="text-sm font-semibold text-neutral/60">No active mess found.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-full">
            <MealsHeader
                year={year}
                month={month}
            />

            <MealsSummary
                totalMeals={totalMeals}
                activeCount={members.length}
            />

            {/* Monthly sheet */}
            {monthLoading ? (
                <div className="flex items-center justify-center py-16">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            ) : (
                <MonthlyMealSheet
                    year={year}
                    month={month}
                    members={members}
                    mealDocs={mealDocs}
                    onDayClick={handleDayClick}
                />
            )}

            {/* Day editor modal */}
            {editorDay !== null && (
                <MealDayEditor
                    year={year}
                    month={month}
                    day={editorDay}
                    members={members}
                    existingEntries={existingEntriesForDay()}
                    onSave={handleSave}
                    onClose={closeEditor}
                    isSaving={isSaving}
                />
            )}
        </div>
    );
};

export default Meals;

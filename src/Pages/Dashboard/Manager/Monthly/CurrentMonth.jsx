import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
    Calendar,
    UtensilsCrossed,
    ShoppingCart,
    Wallet,
    Calculator,
    ArrowRight,
    TrendingUp,
    Home,
    Package,
    Receipt,
    Clock,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import useCurrentUser from "../../../../hooks/useCurrentUser";
import Loading from "../../../../components/Loading/Loading";

const toastError = (msg) =>
    toast.error(msg, {
        duration: 4000,
        style: {
            borderRadius: "12px",
            background: "#ffffff",
            color: "#173B3A",
            border: "1px solid #FF8A00",
            fontWeight: "600",
        },
        iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
    });

const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const CurrentMonth = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentUser, isUserLoading } = useCurrentUser();

    // Current month (Bangladesh time)
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;

    const [messId, setMessId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        meals: null,
        bazar: null,
        payments: null,
        khalabill: null,
        commonExpenses: null,
        memberRent: null,
        calculations: null,
    });

    const loadData = useCallback(async () => {
        if (!user?.email || !currentUser) return;
        setLoading(true);
        try {
            // Get mess
            const messRes = await axiosSecure.get(`/users/my-mess?email=${user.email}`);
            const messData = messRes.data.mess;
            if (!messData) {
                setLoading(false);
                return;
            }
            setMessId(messData._id);

            // Fetch all data in parallel
            const [
                mealsRes,
                bazarRes,
                paymentsRes,
                khalabillRes,
                commonExpensesRes,
                rentRes,
                calculationsRes,
            ] = await Promise.all([
                axiosSecure.get(`/meals/mess/${messData._id}?month=${monthStr}`),
                axiosSecure.get(`/bazar/mess/${messData._id}?month=${monthStr}`),
                axiosSecure.get(`/payments/${messData._id}?email=${user.email}`),
                axiosSecure.get(`/expenses/khalabill/${messData._id}?email=${user.email}`),
                axiosSecure.get(`/expenses/common/${messData._id}?email=${user.email}`),
                axiosSecure.get(`/expenses/rent/${messData._id}?email=${user.email}`),
                axiosSecure.get(`/calculations/${messData._id}?email=${user.email}`),
            ]);

            setData({
                meals: mealsRes.data,
                bazar: bazarRes.data,
                payments: paymentsRes.data,
                khalabill: khalabillRes.data,
                commonExpenses: commonExpensesRes.data,
                memberRent: rentRes.data,
                calculations: calculationsRes.data,
            });
        } catch (err) {
            toastError("Failed to load current month data.");
        } finally {
            setLoading(false);
        }
    }, [user, currentUser, axiosSecure, monthStr]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const fmt = (n) =>
        n.toLocaleString("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    if (loading || isUserLoading) return <Loading />;

    if (!currentUser?.hasMess || !messId) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Calendar size={28} strokeWidth={1.8} />
                </span>
                <div>
                    <p className="text-sm font-bold text-neutral">No Active Mess</p>
                    <p className="mt-1 text-xs text-neutral/50">
                        Create or join a mess to view the current month overview.
                    </p>
                </div>
            </div>
        );
    }

    // Calculate values
    const totalMeals = data.meals
        ? data.meals.reduce((sum, doc) => {
              if (doc.entries && Array.isArray(doc.entries)) {
                  doc.entries.forEach((entry) => {
                      sum +=
                          (entry.breakfast || 0) +
                          (entry.lunch || 0) +
                          (entry.dinner || 0) +
                          (entry.guestMeal || 0);
                  });
              }
              return sum;
          }, 0)
        : 0;

    const approvedBazarTotal = data.bazar
        ? data.bazar.records
              .filter((r) => r.status === "approved")
              .reduce((sum, r) => sum + r.totalAmount, 0)
        : 0;

    const pendingBazarCount = data.bazar
        ? data.bazar.records.filter((r) => r.status === "pending").length
        : 0;

    const totalBazarEntries = data.bazar ? data.bazar.records.length : 0;

    const recentApprovedBazar = data.bazar
        ? data.bazar.records
              .filter((r) => r.status === "approved")
              .slice(0, 5)
        : [];

    const totalKhalabill = data.khalabill?.khalabill?.amount || 0;
    const totalCommonExpense = data.commonExpenses?.total || 0;
    const totalRent = data.memberRent?.totalRent || 0;
    const totalManagedExpenses = totalKhalabill + totalCommonExpense + totalRent;

    const paymentTotals = data.payments?.totals || {
        meal: 0,
        rent: 0,
        khalabill: 0,
        common_expense: 0,
        other: 0,
        total: 0,
    };

    const mealRate = data.calculations?.mealCalculation?.mealRate || 0;

    const mealBreakdown = data.meals
        ? data.meals.reduce(
              (acc, doc) => {
                  if (doc.entries && Array.isArray(doc.entries)) {
                      doc.entries.forEach((entry) => {
                          acc.breakfast += entry.breakfast || 0;
                          acc.lunch += entry.lunch || 0;
                          acc.dinner += entry.dinner || 0;
                          acc.guestMeal += entry.guestMeal || 0;
                      });
                  }
                  return acc;
              },
              { breakfast: 0, lunch: 0, dinner: 0, guestMeal: 0 }
          )
        : { breakfast: 0, lunch: 0, dinner: 0, guestMeal: 0 };

    const summary = data.calculations?.summary || {
        totalCost: 0,
        totalPaid: 0,
        totalDue: 0,
        totalAdvance: 0,
    };

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-neutral">Current Month</h1>
                    <p className="mt-1 text-sm font-medium text-neutral/60">
                        {MONTH_NAMES[month]} {year}
                    </p>
                    <p className="mt-2 text-xs text-neutral/50">
                        Complete overview of your mess activity and monthly records.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/dashboard/monthly/calculations")}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
                >
                    <Calculator size={16} />
                    View Calculations
                </button>
            </div>

            {/* Primary Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    icon={<UtensilsCrossed size={20} />}
                    label="Total Meals"
                    value={totalMeals.toFixed(1)}
                    subtitle="This Month"
                    color="primary"
                />
                <SummaryCard
                    icon={<ShoppingCart size={20} />}
                    label="Total Bazar"
                    value={`৳${fmt(approvedBazarTotal)}`}
                    subtitle="Approved"
                    color="secondary"
                />
                <SummaryCard
                    icon={<Wallet size={20} />}
                    label="Total Expenses"
                    value={`৳${fmt(totalManagedExpenses)}`}
                    subtitle="Managed Cost"
                    color="tertiary"
                />
                <SummaryCard
                    icon={<Receipt size={20} />}
                    label="Total Payments"
                    value={`৳${fmt(paymentTotals.total)}`}
                    subtitle="Received"
                    color="neutral"
                />
            </div>

            {/* Meal Overview */}
            <SectionCard
                title="Meal Overview"
                icon={<UtensilsCrossed size={18} />}
                description="Monthly meal activity and meal rate"
                actionLabel="View Meals"
                onAction={() => navigate("/dashboard/monthly/meals")}
                iconColor="text-primary"
                borderColor="border-primary/20"
            >
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
                    <div className="rounded-lg bg-primary/5 p-4">
                        <p className="text-xs font-medium text-neutral/60">Total Meals</p>
                        <p className="mt-1 text-xl font-bold text-primary">
                            {totalMeals.toFixed(1)}
                        </p>
                    </div>
                    <div className="rounded-lg bg-secondary/5 p-4">
                        <p className="text-xs font-medium text-neutral/60">Meal Rate</p>
                        <p className="mt-1 text-xl font-bold text-secondary">
                            ৳{fmt(mealRate)}
                        </p>
                    </div>
                    <div className="rounded-lg bg-background p-4">
                        <p className="text-xs font-medium text-neutral/60">Breakfast</p>
                        <p className="mt-1 text-xl font-bold text-neutral">
                            {mealBreakdown.breakfast.toFixed(1)}
                        </p>
                    </div>
                    <div className="rounded-lg bg-background p-4">
                        <p className="text-xs font-medium text-neutral/60">Lunch</p>
                        <p className="mt-1 text-xl font-bold text-neutral">
                            {mealBreakdown.lunch.toFixed(1)}
                        </p>
                    </div>
                    <div className="rounded-lg bg-background p-4">
                        <p className="text-xs font-medium text-neutral/60">Dinner</p>
                        <p className="mt-1 text-xl font-bold text-neutral">
                            {mealBreakdown.dinner.toFixed(1)}
                        </p>
                    </div>
                    <div className="rounded-lg bg-background p-4">
                        <p className="text-xs font-medium text-neutral/60">Guest Meal</p>
                        <p className="mt-1 text-xl font-bold text-neutral">
                            {mealBreakdown.guestMeal.toFixed(1)}
                        </p>
                    </div>
                </div>
            </SectionCard>

            {/* Bazar Overview */}
            <SectionCard
                title="Bazar Overview"
                icon={<ShoppingCart size={18} />}
                description="Approved and recent bazar records"
                actionLabel="View Bazar"
                onAction={() => navigate("/dashboard/monthly/bazar")}
                iconColor="text-secondary"
                borderColor="border-secondary/20"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg bg-secondary/5 p-4">
                            <p className="text-xs font-medium text-neutral/60">Approved Bazar</p>
                            <p className="mt-1 text-xl font-bold text-secondary">
                                ৳{fmt(approvedBazarTotal)}
                            </p>
                        </div>
                        <div className="rounded-lg bg-tertiary/5 p-4">
                            <p className="text-xs font-medium text-neutral/60">Pending Review</p>
                            <p className="mt-1 text-xl font-bold text-tertiary">
                                {pendingBazarCount}
                            </p>
                        </div>
                        <div className="rounded-lg bg-background p-4">
                            <p className="text-xs font-medium text-neutral/60">Total Entries</p>
                            <p className="mt-1 text-xl font-bold text-neutral">
                                {totalBazarEntries}
                            </p>
                        </div>
                    </div>

                    {recentApprovedBazar.length > 0 ? (
                        <div>
                            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-neutral/60">
                                Recent Approved Bazar
                            </h4>
                            <div className="space-y-2">
                                {recentApprovedBazar.map((record) => (
                                    <div
                                        key={record._id}
                                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            {record.buyer?.photoURL ? (
                                                <img
                                                    src={record.buyer.photoURL}
                                                    alt={record.buyer.name}
                                                    referrerPolicy="no-referrer"
                                                    className="h-8 w-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                                                    {record.buyer?.name?.charAt(0).toUpperCase() ||
                                                        "?"}
                                                </span>
                                            )}
                                            <div>
                                                <p className="text-sm font-semibold text-neutral">
                                                    {record.buyer?.name || "Unknown"}
                                                </p>
                                                <p className="text-xs text-neutral/50">
                                                    {new Date(record.date).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-mono text-sm font-bold text-secondary">
                                            ৳{fmt(record.totalAmount)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <EmptyState
                            icon={<ShoppingCart size={32} />}
                            message="No approved bazar records this month."
                        />
                    )}
                </div>
            </SectionCard>

            {/* Expenses Overview */}
            <SectionCard
                title="Expenses Overview"
                icon={<Package size={18} />}
                description="Monthly managed expenses breakdown"
                actionLabel="View Expenses"
                onAction={() => navigate("/dashboard/monthly/expenses")}
                iconColor="text-tertiary"
                borderColor="border-tertiary/20"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg bg-background p-4">
                            <p className="text-xs font-medium text-neutral/60">Khalabill</p>
                            <p className="mt-1 text-xl font-bold text-neutral">
                                ৳{fmt(totalKhalabill)}
                            </p>
                        </div>
                        <div className="rounded-lg bg-background p-4">
                            <p className="text-xs font-medium text-neutral/60">Common Expense</p>
                            <p className="mt-1 text-xl font-bold text-neutral">
                                ৳{fmt(totalCommonExpense)}
                            </p>
                        </div>
                        <div className="rounded-lg bg-background p-4">
                            <p className="text-xs font-medium text-neutral/60">Total Rent</p>
                            <p className="mt-1 text-xl font-bold text-neutral">
                                ৳{fmt(totalRent)}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg border-2 border-tertiary/20 bg-tertiary/5 p-4">
                        <p className="text-sm font-bold text-neutral/80">
                            Total Managed Expenses
                        </p>
                        <p className="mt-2 font-mono text-2xl font-extrabold text-tertiary">
                            ৳{fmt(totalManagedExpenses)}
                        </p>
                    </div>
                </div>
            </SectionCard>

            {/* Payments Overview */}
            <SectionCard
                title="Payments Overview"
                icon={<Wallet size={18} />}
                description="Current-month received payments"
                actionLabel="View Payments"
                onAction={() => navigate("/dashboard/monthly/payments")}
                iconColor="text-secondary"
                borderColor="border-secondary/20"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                        <div className="rounded-lg bg-background p-4">
                            <p className="text-xs font-medium text-neutral/60">Meal Payment</p>
                            <p className="mt-1 text-lg font-bold text-neutral">
                                ৳{fmt(paymentTotals.meal)}
                            </p>
                        </div>
                        <div className="rounded-lg bg-background p-4">
                            <p className="text-xs font-medium text-neutral/60">Rent / Basa Vara</p>
                            <p className="mt-1 text-lg font-bold text-neutral">
                                ৳{fmt(paymentTotals.rent)}
                            </p>
                        </div>
                        <div className="rounded-lg bg-background p-4">
                            <p className="text-xs font-medium text-neutral/60">Khalabill</p>
                            <p className="mt-1 text-lg font-bold text-neutral">
                                ৳{fmt(paymentTotals.khalabill)}
                            </p>
                        </div>
                        <div className="rounded-lg bg-background p-4">
                            <p className="text-xs font-medium text-neutral/60">Common Expense</p>
                            <p className="mt-1 text-lg font-bold text-neutral">
                                ৳{fmt(paymentTotals.common_expense)}
                            </p>
                        </div>
                        <div className="rounded-lg bg-background p-4">
                            <p className="text-xs font-medium text-neutral/60">Other</p>
                            <p className="mt-1 text-lg font-bold text-neutral">
                                ৳{fmt(paymentTotals.other)}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg border-2 border-secondary/20 bg-secondary/5 p-4">
                        <p className="text-sm font-bold text-neutral/80">Total Received</p>
                        <p className="mt-2 font-mono text-2xl font-extrabold text-secondary">
                            ৳{fmt(paymentTotals.total)}
                        </p>
                    </div>
                </div>
            </SectionCard>

            {/* Calculation & Settlement Overview */}
            <SectionCard
                title="Calculation & Settlement"
                icon={<Calculator size={18} />}
                description="Complete monthly financial summary"
                actionLabel="View Details"
                onAction={() => navigate("/dashboard/monthly/calculations")}
                iconColor="text-primary"
                borderColor="border-primary/20"
                highlight
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <div className="rounded-lg bg-primary/5 p-4">
                            <p className="text-xs font-medium text-neutral/60">Total Food Cost</p>
                            <p className="mt-1 text-lg font-bold text-primary">
                                ৳{fmt(approvedBazarTotal)}
                            </p>
                        </div>
                        <div className="rounded-lg bg-background p-4">
                            <p className="text-xs font-medium text-neutral/60">Total Rent</p>
                            <p className="mt-1 text-lg font-bold text-neutral">
                                ৳{fmt(totalRent)}
                            </p>
                        </div>
                        <div className="rounded-lg bg-background p-4">
                            <p className="text-xs font-medium text-neutral/60">Total Khalabill</p>
                            <p className="mt-1 text-lg font-bold text-neutral">
                                ৳{fmt(totalKhalabill)}
                            </p>
                        </div>
                        <div className="rounded-lg bg-background p-4">
                            <p className="text-xs font-medium text-neutral/60">
                                Total Common Expense
                            </p>
                            <p className="mt-1 text-lg font-bold text-neutral">
                                ৳{fmt(totalCommonExpense)}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                            <p className="text-sm font-bold text-neutral/80">Total Cost</p>
                            <p className="mt-2 font-mono text-xl font-extrabold text-primary">
                                ৳{fmt(summary.totalCost)}
                            </p>
                        </div>
                        <div className="rounded-lg border-2 border-secondary/20 bg-secondary/5 p-4">
                            <p className="text-sm font-bold text-neutral/80">Total Paid</p>
                            <p className="mt-2 font-mono text-xl font-extrabold text-secondary">
                                ৳{fmt(summary.totalPaid)}
                            </p>
                        </div>
                        <div className="rounded-lg border-2 border-tertiary/20 bg-tertiary/5 p-4">
                            <p className="text-sm font-bold text-neutral/80">Total Due</p>
                            <p className="mt-2 font-mono text-xl font-extrabold text-tertiary">
                                ৳{fmt(summary.totalDue)}
                            </p>
                        </div>
                        <div className="rounded-lg border-2 border-secondary/20 bg-secondary/5 p-4">
                            <p className="text-sm font-bold text-neutral/80">Total Advance</p>
                            <p className="mt-2 font-mono text-xl font-extrabold text-secondary">
                                ৳{fmt(summary.totalAdvance)}
                            </p>
                        </div>
                    </div>
                </div>
            </SectionCard>
        </div>
    );
};

// Summary Card Component
const SummaryCard = ({ icon, label, value, subtitle, color }) => {
    const colorClasses = {
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/10 text-secondary",
        tertiary: "bg-tertiary/10 text-tertiary",
        neutral: "bg-neutral/10 text-neutral",
    };

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-medium text-neutral/60">{label}</p>
                    <p className="mt-2 text-2xl font-extrabold text-neutral">{value}</p>
                    <p className="mt-1 text-xs text-neutral/50">{subtitle}</p>
                </div>
                <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClasses[color]}`}
                >
                    {icon}
                </span>
            </div>
        </div>
    );
};

// Section Card Component
const SectionCard = ({
    title,
    icon,
    description,
    actionLabel,
    onAction,
    iconColor,
    borderColor,
    highlight,
    children,
}) => {
    return (
        <div
            className={`rounded-2xl border bg-white shadow-sm ${
                highlight ? borderColor + " border-2" : "border-gray-100"
            }`}
        >
            <div className="border-b border-gray-100 px-6 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <span className={`${iconColor}`}>{icon}</span>
                        <div>
                            <h2 className="text-sm font-extrabold text-neutral">{title}</h2>
                            {description && (
                                <p className="mt-0.5 text-xs text-neutral/50">{description}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onAction}
                        className="flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
                    >
                        {actionLabel}
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
};

// Empty State Component
const EmptyState = ({ icon, message }) => {
    return (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral/5 text-neutral/40">
                {icon}
            </span>
            <p className="text-sm text-neutral/60">{message}</p>
        </div>
    );
};

export default CurrentMonth;

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
    Home,
    Users,
    Copy,
    Settings,
    Eye,
    UtensilsCrossed,
    ShoppingCart,
    Wallet,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    Clock,
    DollarSign,
    Package,
    Receipt,
} from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useCurrentUser from "../../../hooks/useCurrentUser";
import Loading from "../../../components/Loading/Loading";
import MemberDetailsModal from "./Monthly/MemberDetailsModal";

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

const ManagerOverview = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentUser, isUserLoading } = useCurrentUser();

    // Calculate date values once - not in dependencies
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
    const todayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(today).padStart(2, "0")}`;
    const todayDateString = now.toDateString(); // Store as string to avoid object comparison

    const [loading, setLoading] = useState(true);
    const [mess, setMess] = useState(null);
    const [todayData, setTodayData] = useState({
        meals: 0,
        bazar: 0,
        expenses: 0,
        pendingBazar: 0,
        pendingJoinRequests: 0,
    });
    const [calculations, setCalculations] = useState(null);
    const [activeMembers, setActiveMembers] = useState([]);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const loadData = useCallback(async () => {
        if (!user?.email || !currentUser?.hasMess) {
            setLoading(false);
            return;
        }
        
        setLoading(true);

        try {
            // Get mess info
            const messRes = await axiosSecure.get(`/users/my-mess?email=${user.email}`);
            const messData = messRes.data.mess;
            if (!messData) {
                setLoading(false);
                return;
            }
            setMess(messData);

            // Fetch all data in parallel with proper error handling
            const results = await Promise.allSettled([
                axiosSecure.get(`/meals/mess/${messData._id}/date/${todayStr}`),
                axiosSecure.get(`/bazar/mess/${messData._id}?month=${monthStr}`),
                axiosSecure.get(`/expenses/common/${messData._id}?email=${user.email}`),
                axiosSecure.get(`/bazar/mess/${messData._id}?month=${monthStr}&status=pending`),
                axiosSecure.get(`/join-requests/mess/${messData._id}`),
                axiosSecure.get(`/calculations/${messData._id}?email=${user.email}`),
                axiosSecure.get(`/mess-members/${messData._id}?limit=100`),
            ]);

            // Extract successful results
            const [
                todayMealsRes,
                todayBazarRes,
                todayExpensesRes,
                pendingBazarRes,
                pendingJoinRequestsRes,
                calculationsRes,
                membersRes,
            ] = results.map(result => result.status === 'fulfilled' ? result.value : { data: {} });

            // Today's meals
            const todayMealDoc = todayMealsRes.data?.meal;
            let todayMeals = 0;
            if (todayMealDoc?.entries) {
                todayMealDoc.entries.forEach((entry) => {
                    todayMeals +=
                        (entry.breakfast || 0) +
                        (entry.lunch || 0) +
                        (entry.dinner || 0) +
                        (entry.guestMeal || 0);
                });
            }

            // Today's bazar (approved only)
            const allBazarRecords = todayBazarRes.data?.records || [];
            const todayBazarRecords = allBazarRecords.filter(
                (r) =>
                    r.status === "approved" &&
                    new Date(r.date).toDateString() === todayDateString
            );
            const todayBazar = todayBazarRecords.reduce((sum, r) => sum + (r.totalAmount || 0), 0);

            // Today's expenses
            const allExpenses = todayExpensesRes.data?.expenses || [];
            const todayExpenses = allExpenses
                .filter((e) => new Date(e.date).toDateString() === todayDateString)
                .reduce((sum, e) => sum + (e.amount || 0), 0);

            // Pending bazar
            const pendingBazarRecords = pendingBazarRes.data?.records || [];
            const pendingBazar = pendingBazarRecords.length;

            // Pending join requests
            const joinRequests = pendingJoinRequestsRes.data || [];
            const pendingJoinRequests = Array.isArray(joinRequests) 
                ? joinRequests.filter(r => r.status === 'pending').length 
                : 0;

            setTodayData({
                meals: todayMeals,
                bazar: todayBazar,
                expenses: todayExpenses,
                pendingBazar,
                pendingJoinRequests,
            });

            setCalculations(calculationsRes.data || null);
            setActiveMembers(membersRes.data?.members || []);
        } catch (err) {
            console.error("Failed to load overview data:", err);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, [user?.email, currentUser?.hasMess, axiosSecure, monthStr, todayStr, todayDateString]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const fmt = (n) =>
        n.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const copyMessCode = () => {
        if (mess?.messCode) {
            navigator.clipboard.writeText(mess.messCode);
            toast.success("Mess code copied to clipboard!");
        }
    };

    const handleViewMember = (member) => {
        const modalMember = {
            name: member.user?.name || member.name || "Unknown",
            email: member.user?.email || member.email || "",
            foodCost: member.foodCost,
            rent: member.rent,
            khalabill: member.khalabill,
            commonExpense: member.commonExpense,
            totalCost: member.totalCost,
            totalPaid: member.paid,
            balance: member.balance,
            status: member.status,
            payments: member.payments || [],
        };
        setSelectedMember(modalMember);
        setShowMemberModal(true);
    };

    if (loading || isUserLoading) return <Loading />;

    if (!mess || !calculations) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <AlertCircle size={48} className="text-neutral/40" />
                <p className="text-sm text-neutral/60">Unable to load dashboard data</p>
            </div>
        );
    }

    // Find manager's own data
    const managerData = calculations.memberSettlement?.find(
        (m) => m.user?.email === user.email
    );

    // Prepare chart data
    const foodCostVsPaidData = calculations.memberSettlement?.map((member) => ({
        name: member.user?.name || "Unknown",
        foodCost: member.foodCost,
        foodPaid: member.paymentsByCategory?.meal || 0,
    })) || [];

    const foodBalanceData = calculations.memberSettlement?.map((member) => {
        const foodPaid = member.paymentsByCategory?.meal || 0;
        const foodBalance = member.foodCost - foodPaid;
        return {
            name: member.user?.name || "Unknown",
            balance: foodBalance,
            foodCost: member.foodCost,
            foodPaid: foodPaid,
            status: foodBalance > 0.01 ? "Due" : foodBalance < -0.01 ? "Advance" : "Settled",
        };
    }) || [];

    const finalBalanceData = calculations.memberSettlement?.map((member) => ({
        name: member.user?.name || "Unknown",
        balance: member.balance,
        totalCost: member.totalCost,
        totalPaid: member.paid,
        status: member.status,
    })) || [];

    const availableSeats = Math.max(0, (mess.maxMembers || 0) - activeMembers.length);

    return (
        <div className="space-y-6 pb-8">
            {/* Mess Header */}
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Home size={28} strokeWidth={2} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-neutral">
                                {mess.messName}
                            </h1>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-primary">
                                        {mess.messCode}
                                    </span>
                                    <button
                                        onClick={copyMessCode}
                                        className="rounded p-1 text-neutral/60 transition hover:bg-white hover:text-primary"
                                        title="Copy Mess Code"
                                    >
                                        <Copy size={14} />
                                    </button>
                                </div>
                                <span className="text-neutral/60">•</span>
                                <span className="font-semibold text-neutral">
                                    {activeMembers.length} / {mess.maxMembers || 0} Active Members
                                </span>
                                <span className="text-neutral/60">•</span>
                                <span className="text-secondary">
                                    {availableSeats} Seat{availableSeats !== 1 ? "s" : ""} Available
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-neutral/50">
                                {MONTH_NAMES[month]} {year}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(`/find-mess/${mess._id}`)}
                            className="flex items-center gap-2 rounded-lg border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-neutral transition hover:bg-primary/5"
                        >
                            <Eye size={16} />
                            View Mess
                        </button>
                        <button
                            onClick={() => navigate("/dashboard/mess/settings")}
                            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
                        >
                            <Settings size={16} />
                            Settings
                        </button>
                    </div>
                </div>
            </div>

            {/* Today's At a Glance */}
            <div>
                <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-neutral/60">
                    Today's At a Glance
                </h2>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                    <GlanceCard
                        icon={<UtensilsCrossed size={18} />}
                        label="Today's Meals"
                        value={todayData.meals.toFixed(1)}
                        color="primary"
                    />
                    <GlanceCard
                        icon={<ShoppingCart size={18} />}
                        label="Today's Bazar"
                        value={`৳${fmt(todayData.bazar)}`}
                        subtitle="Approved"
                        color="secondary"
                    />
                    <GlanceCard
                        icon={<Wallet size={18} />}
                        label="Today's Expenses"
                        value={`৳${fmt(todayData.expenses)}`}
                        color="tertiary"
                    />
                    <GlanceCard
                        icon={<Clock size={18} />}
                        label="Pending Bazar"
                        value={todayData.pendingBazar}
                        subtitle="Reviews"
                        color="tertiary"
                        clickable
                        onClick={() => navigate("/dashboard/monthly/bazar")}
                    />
                    <GlanceCard
                        icon={<Users size={18} />}
                        label="Join Requests"
                        value={todayData.pendingJoinRequests}
                        subtitle="Pending"
                        color="primary"
                        clickable
                        onClick={() => navigate("/dashboard/mess/join-requests")}
                    />
                </div>
            </div>

            {/* Manager Account */}
            {managerData && (
                <div className="rounded-2xl border border-secondary/20 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-neutral">
                        <Receipt size={20} className="text-secondary" />
                        Your Account
                    </h2>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
                        <AccountCard label="Food Cost" value={`৳${fmt(managerData.foodCost)}`} />
                        <AccountCard
                            label="Food Paid"
                            value={`৳${fmt(managerData.paymentsByCategory?.meal || 0)}`}
                        />
                        <AccountCard
                            label="Food Balance"
                            value={`৳${fmt(
                                Math.abs(
                                    managerData.foodCost -
                                        (managerData.paymentsByCategory?.meal || 0)
                                )
                            )}`}
                            status={
                                managerData.foodCost - (managerData.paymentsByCategory?.meal || 0) >
                                0.01
                                    ? "Due"
                                    : managerData.foodCost -
                                          (managerData.paymentsByCategory?.meal || 0) <
                                      -0.01
                                    ? "Advance"
                                    : "Settled"
                            }
                        />
                        <AccountCard label="Total Cost" value={`৳${fmt(managerData.totalCost)}`} />
                        <AccountCard label="Total Paid" value={`৳${fmt(managerData.paid)}`} />
                        <AccountCard
                            label="Final Balance"
                            value={`৳${fmt(Math.abs(managerData.balance))}`}
                            status={managerData.status}
                        />
                    </div>
                </div>
            )}

            {/* Member Financial Overview */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <h2 className="text-lg font-extrabold text-neutral">Member Financial Overview</h2>
                    <p className="mt-1 text-xs text-neutral/50">
                        Complete financial status for all active members
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-background/40">
                                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Member
                                </th>
                                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Food Cost
                                </th>
                                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Food Balance
                                </th>
                                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Total Cost
                                </th>
                                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Final Balance
                                </th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {calculations.memberSettlement?.map((member) => {
                                const foodPaid = member.paymentsByCategory?.meal || 0;
                                const foodBalance = member.foodCost - foodPaid;
                                const foodStatus =
                                    foodBalance > 0.01
                                        ? "Due"
                                        : foodBalance < -0.01
                                        ? "Advance"
                                        : "Settled";

                                return (
                                    <tr key={member.userId} className="border-b border-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {member.user?.photoURL ? (
                                                    <img
                                                        src={member.user.photoURL}
                                                        alt={member.user.name}
                                                        referrerPolicy="no-referrer"
                                                        className="h-8 w-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                        {member.user?.name?.charAt(0).toUpperCase() ||
                                                            "?"}
                                                    </span>
                                                )}
                                                <span className="text-sm font-semibold text-neutral">
                                                    {member.user?.name || "Unknown"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-sm text-neutral">
                                            ৳{fmt(member.foodCost)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="font-mono text-sm font-semibold text-neutral">
                                                    ৳{fmt(Math.abs(foodBalance))}
                                                </span>
                                                <StatusBadge status={foodStatus} small />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-neutral">
                                            ৳{fmt(member.totalCost)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="font-mono text-sm font-bold text-neutral">
                                                    ৳{fmt(Math.abs(member.balance))}
                                                </span>
                                                <StatusBadge status={member.status} small />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <StatusBadge status={member.status} />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleViewMember(member)}
                                                className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-neutral transition hover:bg-background"
                                                title="View Details"
                                            >
                                                <Eye size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Financial Charts */}
            <div className="space-y-6">
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-neutral/60">
                    Financial Analysis
                </h2>

                {/* Chart 1: Food Cost vs Food Paid */}
                <ChartCard title="Food Cost vs Food Paid" subtitle="Member-wise comparison">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={foodCostVsPaidData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid #e0e0e0",
                                    fontSize: "12px",
                                }}
                                formatter={(value) => `৳${fmt(value)}`}
                            />
                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                            <Bar dataKey="foodCost" fill="#006B68" name="Food Cost" />
                            <Bar dataKey="foodPaid" fill="#2E9B45" name="Food Paid" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Chart 2: Food Balance (Due/Advance) */}
                <ChartCard title="Food Due / Advance" subtitle="Member-wise food balance">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={foodBalanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid #e0e0e0",
                                    fontSize: "12px",
                                }}
                                formatter={(value) => `৳${fmt(Math.abs(value))}`}
                                labelFormatter={(name) => {
                                    const member = foodBalanceData.find((m) => m.name === name);
                                    return `${name} - ${member?.status || ""}`;
                                }}
                            />
                            <ReferenceLine y={0} stroke="#666" />
                            <Bar
                                dataKey="balance"
                                fill="#FF8A00"
                                name="Balance"
                                label={false}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Chart 3: Final Balance (Due/Advance) */}
                <ChartCard
                    title="Final Due / Advance"
                    subtitle="Complete monthly settlement balance"
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={finalBalanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid #e0e0e0",
                                    fontSize: "12px",
                                }}
                                formatter={(value) => `৳${fmt(Math.abs(value))}`}
                                labelFormatter={(name) => {
                                    const member = finalBalanceData.find((m) => m.name === name);
                                    return `${name} - ${member?.status || ""}`;
                                }}
                            />
                            <ReferenceLine y={0} stroke="#666" />
                            <Bar
                                dataKey="balance"
                                fill="#006B68"
                                name="Balance"
                                label={false}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Pending Actions */}
            {(todayData.pendingJoinRequests > 0 || todayData.pendingBazar > 0) && (
                <div className="rounded-2xl border border-tertiary/20 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-neutral">
                        <AlertCircle size={20} className="text-tertiary" />
                        Pending Actions
                    </h2>
                    <div className="space-y-3">
                        {todayData.pendingJoinRequests > 0 && (
                            <PendingActionItem
                                label="Pending Join Requests"
                                count={todayData.pendingJoinRequests}
                                subtitle="requests waiting"
                                onClick={() => navigate("/dashboard/mess/join-requests")}
                            />
                        )}
                        {todayData.pendingBazar > 0 && (
                            <PendingActionItem
                                label="Pending Bazar Reviews"
                                count={todayData.pendingBazar}
                                subtitle="submissions waiting"
                                onClick={() => navigate("/dashboard/monthly/bazar")}
                            />
                        )}
                    </div>
                </div>
            )}

            {(todayData.pendingJoinRequests === 0 && todayData.pendingBazar === 0) && (
                <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-6 text-center">
                    <CheckCircle2 size={32} className="mx-auto text-secondary" />
                    <p className="mt-2 font-semibold text-secondary">You're all caught up!</p>
                    <p className="mt-1 text-xs text-neutral/60">No pending actions at the moment</p>
                </div>
            )}

            {/* Monthly Health */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-extrabold text-neutral">Monthly Health</h2>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <HealthCard
                        label="Total Meals"
                        value={calculations.mealCalculation?.totalMeals?.toFixed(1) || "0"}
                    />
                    <HealthCard
                        label="Meal Rate"
                        value={`৳${fmt(calculations.mealCalculation?.mealRate || 0)}`}
                    />
                    <HealthCard
                        label="Approved Bazar"
                        value={`৳${fmt(calculations.mealCalculation?.totalBazarCost || 0)}`}
                    />
                    <HealthCard
                        label="Khalabill"
                        value={`৳${fmt(calculations.khalabillCalculation?.totalKhalabill || 0)}`}
                    />
                    <HealthCard
                        label="Common Expenses"
                        value={`৳${fmt(
                            calculations.commonExpenseCalculation?.totalCommonExpense || 0
                        )}`}
                    />
                    <HealthCard
                        label="Total Rent"
                        value={`৳${fmt(calculations.rentCalculation?.totalRent || 0)}`}
                    />
                    <HealthCard
                        label="Total Payments"
                        value={`৳${fmt(calculations.summary?.totalPaid || 0)}`}
                    />
                    <HealthCard
                        label="Total Cost"
                        value={`৳${fmt(calculations.summary?.totalCost || 0)}`}
                    />
                </div>
            </div>

            {/* Member Details Modal */}
            <MemberDetailsModal
                isOpen={showMemberModal}
                member={selectedMember}
                onClose={() => {
                    setShowMemberModal(false);
                    setSelectedMember(null);
                }}
            />
        </div>
    );
};

// Glance Card Component
const GlanceCard = ({ icon, label, value, subtitle, color, clickable, onClick }) => {
    const colorClasses = {
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/10 text-secondary",
        tertiary: "bg-tertiary/10 text-tertiary",
    };

    const Component = clickable ? "button" : "div";

    return (
        <Component
            onClick={onClick}
            className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${
                clickable ? "transition hover:shadow-md hover:border-primary/20 cursor-pointer" : ""
            }`}
        >
            <div className={`mb-2 inline-flex rounded-lg p-2 ${colorClasses[color]}`}>{icon}</div>
            <p className="text-xs font-medium text-neutral/60">{label}</p>
            <p className="mt-1 text-xl font-extrabold text-neutral">{value}</p>
            {subtitle && <p className="mt-0.5 text-[10px] text-neutral/50">{subtitle}</p>}
        </Component>
    );
};

// Account Card Component
const AccountCard = ({ label, value, status }) => {
    return (
        <div className="rounded-xl border border-gray-100 bg-background/30 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">{label}</p>
            <p className="mt-1 font-mono text-lg font-bold text-neutral">{value}</p>
            {status && <StatusBadge status={status} small />}
        </div>
    );
};

// Status Badge Component
const StatusBadge = ({ status, small }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "Due":
                return "bg-tertiary/10 text-tertiary";
            case "Advance":
                return "bg-secondary/10 text-secondary";
            case "Settled":
                return "bg-neutral/10 text-neutral";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <span
            className={`mt-1 inline-flex rounded-full px-2 py-0.5 font-semibold ${
                small ? "text-[9px]" : "text-[10px]"
            } ${getStatusColor(status)}`}
        >
            {status}
        </span>
    );
};

// Chart Card Component
const ChartCard = ({ title, subtitle, children }) => {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4">
                <h3 className="text-base font-extrabold text-neutral">{title}</h3>
                {subtitle && <p className="mt-1 text-xs text-neutral/50">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
};

// Pending Action Item Component
const PendingActionItem = ({ label, count, subtitle, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex w-full items-center justify-between rounded-lg border border-tertiary/20 bg-tertiary/5 p-4 transition hover:bg-tertiary/10"
        >
            <div className="text-left">
                <p className="font-semibold text-neutral">{label}</p>
                <p className="mt-0.5 text-xs text-neutral/60">
                    {count} {subtitle}
                </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-tertiary">
                Review
                <Eye size={16} />
            </div>
        </button>
    );
};

// Health Card Component
const HealthCard = ({ label, value }) => {
    return (
        <div className="rounded-xl border border-gray-100 bg-background/20 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">{label}</p>
            <p className="mt-1 font-mono text-base font-bold text-neutral">{value}</p>
        </div>
    );
};

export default ManagerOverview;

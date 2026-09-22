import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
    Calculator,
    DollarSign,
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    Receipt,
    Home,
    Package,
    UtensilsCrossed,
    Eye
} from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import useCurrentUser from "../../../../hooks/useCurrentUser";
import Loading from "../../../../components/Loading/Loading";
import MemberDetailsModal from "./MemberDetailsModal";

const toastError = (msg) => toast.error(msg, {
    duration: 4000,
    style: { borderRadius: "12px", background: "#ffffff", color: "#173B3A", border: "1px solid #FF8A00", fontWeight: "600" },
    iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
});

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const Calculations = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { currentUser, isUserLoading } = useCurrentUser();

    // Current month (Bangladesh time)
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const year = now.getFullYear();
    const month = now.getMonth();

    const [messId, setMessId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [showMemberDetails, setShowMemberDetails] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

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

            // Get calculations
            const calcRes = await axiosSecure.get(`/calculations/${messData._id}?email=${user.email}`);
            setData(calcRes.data);

        } catch (err) {
            toastError("Failed to load calculations data.");
        } finally {
            setLoading(false);
        }
    }, [user, currentUser, axiosSecure]);

    useEffect(() => { loadData(); }, [loadData]);

    const fmt = (n) => n.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const handleViewMember = (member) => {
        // Transform member data to match modal expectations
        const modalMember = {
            name: member.user?.name || 'Unknown',
            email: member.user?.email || '',
            foodCost: member.foodCost,
            rent: member.rent,
            khalabill: member.khalabill,
            commonExpense: member.commonExpense,
            totalCost: member.totalCost,
            totalPaid: member.paid,
            balance: member.balance,
            status: member.status,
            payments: member.payments || []
        };
        setSelectedMember(modalMember);
        setShowMemberDetails(true);
    };

    if (loading || isUserLoading) return <Loading />;

    if (!currentUser?.hasMess || !messId) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Calculator size={28} strokeWidth={1.8} />
                </span>
                <div>
                    <p className="text-sm font-bold text-neutral">No Active Mess</p>
                    <p className="mt-1 text-xs text-neutral/50">Create or join a mess to view calculations.</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { summary, mealCalculation, rentCalculation, khalabillCalculation, commonExpenseCalculation, memberSettlement } = data;

    return (
        <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Calculator size={18} strokeWidth={2} />
                    </span>
                    <div>
                        <h1 className="text-xl font-extrabold text-neutral">Calculations & Settlement</h1>
                        <p className="text-xs font-medium text-neutral/50">
                            Monthly cost calculation and member-wise settlement
                        </p>
                    </div>
                </div>
                <p className="text-sm font-bold text-neutral">
                    {MONTH_NAMES[month]} {year}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <SummaryCard
                    icon={<DollarSign size={18} strokeWidth={2} />}
                    label="Total Cost"
                    value={`৳${fmt(summary.totalCost)}`}
                    color="primary"
                />
                <SummaryCard
                    icon={<CheckCircle2 size={18} strokeWidth={2} />}
                    label="Total Paid"
                    value={`৳${fmt(summary.totalPaid)}`}
                    color="secondary"
                />
                <SummaryCard
                    icon={<TrendingUp size={18} strokeWidth={2} />}
                    label="Total Due"
                    value={`৳${fmt(summary.totalDue)}`}
                    color="tertiary"
                />
                <SummaryCard
                    icon={<TrendingDown size={18} strokeWidth={2} />}
                    label="Total Advance"
                    value={`৳${fmt(summary.totalAdvance)}`}
                    color="secondary"
                />
            </div>

            {/* Member Settlement */}
            <div className="mb-6 rounded-2xl border border-primary/20 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Receipt size={16} className="text-primary" />
                        <h2 className="text-sm font-extrabold text-neutral">Member Settlement</h2>
                    </div>
                </div>
                {memberSettlement.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-background/40">
                                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">Member</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Food Cost</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Rent</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Khalabill</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Common Exp.</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Total Cost</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Paid</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Balance</th>
                                    <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">Status</th>
                                    <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {memberSettlement.map((member) => (
                                    <tr key={member.userId} className="border-b border-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {member.user?.photoURL ? (
                                                    <img
                                                        src={member.user.photoURL}
                                                        alt={member.user.name}
                                                        referrerPolicy="no-referrer"
                                                        className="h-6 w-6 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                                        {member.user?.name?.charAt(0).toUpperCase() || "?"}
                                                    </span>
                                                )}
                                                <span className="text-xs font-semibold text-neutral">
                                                    {member.user?.name || "Unknown"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-xs text-neutral/70">
                                            ৳{fmt(member.foodCost)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-xs text-neutral/70">
                                            ৳{fmt(member.rent)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-xs text-neutral/70">
                                            ৳{fmt(member.khalabill)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-xs text-neutral/70">
                                            ৳{fmt(member.commonExpense)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-sm font-bold text-neutral">
                                            ৳{fmt(member.totalCost)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-sm font-bold text-secondary">
                                            ৳{fmt(member.paid)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-sm font-bold text-primary">
                                            ৳{fmt(Math.abs(member.balance))}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                member.status === 'Due' ? 'bg-tertiary/10 text-tertiary' :
                                                member.status === 'Advance' ? 'bg-secondary/10 text-secondary' :
                                                'bg-neutral/10 text-neutral'
                                            }`}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleViewMember(member)}
                                                className="flex h-8 w-8 mx-auto items-center justify-center rounded-lg border border-gray-200 text-neutral transition hover:bg-background"
                                                title="View Details"
                                            >
                                                <Eye size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Meal Calculation */}
            <div className="mb-6 rounded-2xl border border-primary/20 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <UtensilsCrossed size={16} className="text-primary" />
                        <h2 className="text-sm font-extrabold text-neutral">Meal Calculation</h2>
                    </div>
                </div>
                <div className="p-6">
                    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-gray-100 bg-background/30 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                Approved Bazar Total
                            </p>
                            <p className="mt-1 font-mono text-lg font-bold text-primary">
                                ৳{fmt(mealCalculation.totalBazarCost)}
                            </p>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-background/30 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                Total Meals
                            </p>
                            <p className="mt-1 text-lg font-bold text-neutral">
                                {mealCalculation.totalMeals}
                            </p>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-background/30 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                Meal Rate
                            </p>
                            <p className="mt-1 font-mono text-lg font-bold text-secondary">
                                ৳{fmt(mealCalculation.mealRate)}
                            </p>
                        </div>
                    </div>

                    {memberSettlement.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-background/40">
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">Member</th>
                                        <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">Breakfast</th>
                                        <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">Lunch</th>
                                        <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">Dinner</th>
                                        <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">Guest</th>
                                        <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">Total Meals</th>
                                        <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Food Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memberSettlement.map((member) => (
                                        <tr key={member.userId} className="border-b border-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {member.user?.photoURL ? (
                                                        <img
                                                            src={member.user.photoURL}
                                                            alt={member.user.name}
                                                            referrerPolicy="no-referrer"
                                                            className="h-6 w-6 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                                            {member.user?.name?.charAt(0).toUpperCase() || "?"}
                                                        </span>
                                                    )}
                                                    <span className="text-xs font-semibold text-neutral">
                                                        {member.user?.name || "Unknown"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center text-xs text-neutral/70">
                                                {member.meals.breakfast}
                                            </td>
                                            <td className="px-4 py-3 text-center text-xs text-neutral/70">
                                                {member.meals.lunch}
                                            </td>
                                            <td className="px-4 py-3 text-center text-xs text-neutral/70">
                                                {member.meals.dinner}
                                            </td>
                                            <td className="px-4 py-3 text-center text-xs text-neutral/70">
                                                {member.meals.guestMeal}
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm font-bold text-neutral">
                                                {member.meals.total}
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-sm font-bold text-primary">
                                                ৳{fmt(member.foodCost)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Rent Calculation */}
            <div className="mb-6 rounded-2xl border border-tertiary/20 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Home size={16} className="text-tertiary" />
                            <h2 className="text-sm font-extrabold text-neutral">Rent Calculation</h2>
                        </div>
                        <span className="font-mono text-sm font-bold text-neutral">
                            Total: ৳{fmt(rentCalculation.totalRent)}
                        </span>
                    </div>
                </div>
                {memberSettlement.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-background/40">
                                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">Member</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Rent / Basa Vara</th>
                                </tr>
                            </thead>
                            <tbody>
                                {memberSettlement.map((member) => (
                                    <tr key={member.userId} className="border-b border-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {member.user?.photoURL ? (
                                                    <img
                                                        src={member.user.photoURL}
                                                        alt={member.user.name}
                                                        referrerPolicy="no-referrer"
                                                        className="h-6 w-6 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tertiary/10 text-[10px] font-bold text-tertiary">
                                                        {member.user?.name?.charAt(0).toUpperCase() || "?"}
                                                    </span>
                                                )}
                                                <span className="text-xs font-semibold text-neutral">
                                                    {member.user?.name || "Unknown"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-sm font-bold text-tertiary">
                                            ৳{fmt(member.rent)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Khalabill Calculation */}
            <div className="mb-6 rounded-2xl border border-secondary/20 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <DollarSign size={16} className="text-secondary" />
                            <h2 className="text-sm font-extrabold text-neutral">Khalabill Calculation</h2>
                        </div>
                        <span className="font-mono text-sm font-bold text-neutral">
                            Total: ৳{fmt(khalabillCalculation.totalKhalabill)}
                        </span>
                    </div>
                </div>
                <div className="p-6">
                    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-gray-100 bg-background/30 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                Active Members
                            </p>
                            <p className="mt-1 text-lg font-bold text-neutral">
                                {khalabillCalculation.activeMembers}
                            </p>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-background/30 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                Per Member Share
                            </p>
                            <p className="mt-1 font-mono text-lg font-bold text-secondary">
                                ৳{fmt(khalabillCalculation.perMember)}
                            </p>
                        </div>
                    </div>

                    {memberSettlement.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-background/40">
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">Member</th>
                                        <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Khalabill Share</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memberSettlement.map((member) => (
                                        <tr key={member.userId} className="border-b border-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {member.user?.photoURL ? (
                                                        <img
                                                            src={member.user.photoURL}
                                                            alt={member.user.name}
                                                            referrerPolicy="no-referrer"
                                                            className="h-6 w-6 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10 text-[10px] font-bold text-secondary">
                                                            {member.user?.name?.charAt(0).toUpperCase() || "?"}
                                                        </span>
                                                    )}
                                                    <span className="text-xs font-semibold text-neutral">
                                                        {member.user?.name || "Unknown"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-sm font-bold text-secondary">
                                                ৳{fmt(member.khalabill)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Common Expense Calculation */}
            <div className="mb-6 rounded-2xl border border-neutral/20 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Package size={16} className="text-neutral" />
                            <h2 className="text-sm font-extrabold text-neutral">Common Expense Calculation</h2>
                        </div>
                        <span className="font-mono text-sm font-bold text-neutral">
                            Total: ৳{fmt(commonExpenseCalculation.totalCommonExpense)}
                        </span>
                    </div>
                </div>
                <div className="p-6">
                    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-gray-100 bg-background/30 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                Active Members
                            </p>
                            <p className="mt-1 text-lg font-bold text-neutral">
                                {commonExpenseCalculation.activeMembers}
                            </p>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-background/30 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                Per Member Share
                            </p>
                            <p className="mt-1 font-mono text-lg font-bold text-neutral">
                                ৳{fmt(commonExpenseCalculation.perMember)}
                            </p>
                        </div>
                    </div>

                    {memberSettlement.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-background/40">
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">Member</th>
                                        <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Common Expense Share</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memberSettlement.map((member) => (
                                        <tr key={member.userId} className="border-b border-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {member.user?.photoURL ? (
                                                        <img
                                                            src={member.user.photoURL}
                                                            alt={member.user.name}
                                                            referrerPolicy="no-referrer"
                                                            className="h-6 w-6 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral/10 text-[10px] font-bold text-neutral">
                                                            {member.user?.name?.charAt(0).toUpperCase() || "?"}
                                                        </span>
                                                    )}
                                                    <span className="text-xs font-semibold text-neutral">
                                                        {member.user?.name || "Unknown"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-sm font-bold text-neutral">
                                                ৳{fmt(member.commonExpense)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Member Details Modal */}
            <MemberDetailsModal
                isOpen={showMemberDetails}
                member={selectedMember}
                onClose={() => {
                    setShowMemberDetails(false);
                    setSelectedMember(null);
                }}
            />
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
            <p className="text-lg font-extrabold text-neutral">{value}</p>
            <p className="mt-0.5 text-[10px] font-semibold text-neutral/60">{label}</p>
        </div>
    );
};

export default Calculations;

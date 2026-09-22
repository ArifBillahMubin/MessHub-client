import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
    Home,
    Users,
    Crown,
    Calendar,
    UtensilsCrossed,
    ShoppingBag,
    Wallet,
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    Receipt,
    Package,
    ArrowRight,
    Clock,
    XCircle,
    AlertTriangle,
} from "lucide-react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useCurrentUser from "../../../hooks/useCurrentUser";
import Loading from "../../../components/Loading/Loading";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const CHART_COLORS = {
    foodCost: "#006B68",
    rent: "#2E9B45",
    khalabill: "#FF8A00",
    commonExpense: "#7C3AED",
    paid: "#10B981",
    cost: "#EF4444",
};

const MemberOverview = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentUser, isUserLoading } = useCurrentUser();

    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
    const todayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(today).padStart(2, "0")}`;
    const todayDateString = now.toDateString();

    const [loading, setLoading] = useState(true);
    const [mess, setMess] = useState(null);
    const [manager, setManager] = useState(null);
    const [activeMembers, setActiveMembers] = useState([]);
    const [todayData, setTodayData] = useState({
        meals: 0,
        foodCost: 0,
        bazarStatus: "none",
    });
    const [myFinancial, setMyFinancial] = useState(null);
    const [myMeals, setMyMeals] = useState(null);
    const [myBazar, setMyBazar] = useState(null);

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

            // Fetch all data in parallel
            const results = await Promise.allSettled([
                axiosSecure.get(`/calculations/${messData._id}?email=${user.email}`),
                axiosSecure.get(`/mess-members/${messData._id}?limit=100`),
                axiosSecure.get(`/meals/mess/${messData._id}/date/${todayStr}`),
                axiosSecure.get(`/bazar/assignments/my?email=${user.email}`),
                axiosSecure.get(`/bazar/my-history?email=${user.email}&messId=${messData._id}`),
            ]);

            const [
                calculationsRes,
                membersRes,
                todayMealRes,
                assignmentsRes,
                bazarHistoryRes,
            ] = results.map(result => result.status === 'fulfilled' ? result.value : { data: {} });

            // Extract my financial data from calculations using email (same as ManagerOverview)
            const calculations = calculationsRes.data;
            const myData = calculations?.memberSettlement?.find(
                m => m.user?.email === user.email
            );
            setMyFinancial(myData || null);
            setMyMeals(myData?.meals || null);

            // Get members
            const allMembers = membersRes.data?.members || [];
            setActiveMembers(allMembers);
            const managerMember = allMembers.find(m => m.role === "manager");
            setManager(managerMember);

            // Today's meals - need to get userId from myData
            const todayMealDoc = todayMealRes.data?.meal;
            let myTodayMeals = 0;
            let myTodayFoodCost = 0;
            
            if (todayMealDoc?.entries && calculations?.mealCalculation && myData?.userId) {
                const myEntry = todayMealDoc.entries.find(e => e.userId === myData.userId);
                if (myEntry) {
                    myTodayMeals = 
                        (myEntry.breakfast || 0) +
                        (myEntry.lunch || 0) +
                        (myEntry.dinner || 0) +
                        (myEntry.guestMeal || 0);
                    myTodayFoodCost = myTodayMeals * (calculations.mealCalculation.mealRate || 0);
                }
            }

            // Today's bazar assignment status
            const assignments = assignmentsRes.data?.assignments || [];
            const activeAssignment = assignments.find(a => a.status === 'assigned');
            
            let bazarStatus = "none";
            if (activeAssignment) {
                bazarStatus = "assigned";
            } else {
                const bazarHistory = bazarHistoryRes.data?.records || [];
                const todayBazarRecords = bazarHistory.filter(
                    r => new Date(r.date).toDateString() === todayDateString
                );
                if (todayBazarRecords.length > 0) {
                    const latestToday = todayBazarRecords[0];
                    bazarStatus = latestToday.status; // pending, approved, rejected
                }
            }

            // My bazar snapshot
            const bazarHistory = bazarHistoryRes.data?.records || [];
            const thisMonthBazar = bazarHistory.filter(r => {
                const recordMonth = new Date(r.date).getMonth();
                const recordYear = new Date(r.date).getFullYear();
                return recordMonth === month && recordYear === year;
            });
            
            setMyBazar({
                activeAssignment,
                thisMonthCount: thisMonthBazar.length,
                approvedCount: thisMonthBazar.filter(r => r.status === 'approved').length,
                pendingCount: thisMonthBazar.filter(r => r.status === 'pending').length,
            });

            setTodayData({
                meals: myTodayMeals,
                foodCost: myTodayFoodCost,
                bazarStatus,
            });

        } catch (err) {
            console.error("Failed to load overview data:", err);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, [user?.email, currentUser?.hasMess, axiosSecure, monthStr, todayStr, todayDateString, month, year]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const fmt = (n) =>
        n.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (loading || isUserLoading) return <Loading />;

    if (!mess || !myFinancial) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <AlertTriangle size={48} className="text-neutral/40" />
                <p className="text-sm text-neutral/60">Unable to load dashboard data</p>
            </div>
        );
    }

    // Prepare chart data
    const costBreakdownData = [
        { name: "Food Cost", value: myFinancial.foodCost, color: CHART_COLORS.foodCost },
        { name: "Rent", value: myFinancial.rent, color: CHART_COLORS.rent },
        { name: "Khalabill", value: myFinancial.khalabill, color: CHART_COLORS.khalabill },
        { name: "Common Expense", value: myFinancial.commonExpense, color: CHART_COLORS.commonExpense },
    ].filter(item => item.value > 0);

    const costVsPaidData = [
        { name: "Total Cost", value: myFinancial.totalCost, color: CHART_COLORS.cost },
        { name: "Total Paid", value: myFinancial.paid, color: CHART_COLORS.paid },
    ];

    const balanceByCategory = [
        {
            category: "Food",
            cost: myFinancial.foodCost,
            paid: myFinancial.paymentsByCategory?.meal || 0,
            balance: myFinancial.foodCost - (myFinancial.paymentsByCategory?.meal || 0),
        },
        {
            category: "Rent",
            cost: myFinancial.rent,
            paid: myFinancial.paymentsByCategory?.rent || 0,
            balance: myFinancial.rent - (myFinancial.paymentsByCategory?.rent || 0),
        },
        {
            category: "Khalabill",
            cost: myFinancial.khalabill,
            paid: myFinancial.paymentsByCategory?.khalabill || 0,
            balance: myFinancial.khalabill - (myFinancial.paymentsByCategory?.khalabill || 0),
        },
        {
            category: "Common Expense",
            cost: myFinancial.commonExpense,
            paid: myFinancial.paymentsByCategory?.common_expense || 0,
            balance: myFinancial.commonExpense - (myFinancial.paymentsByCategory?.common_expense || 0),
        },
    ];

    const foodBalance = myFinancial.foodCost - (myFinancial.paymentsByCategory?.meal || 0);
    const foodStatus = foodBalance > 0.01 ? "Due" : foodBalance < -0.01 ? "Advance" : "Settled";

    const rentBalance = myFinancial.rent - (myFinancial.paymentsByCategory?.rent || 0);
    const rentStatus = rentBalance > 0.01 ? "Due" : rentBalance < -0.01 ? "Advance" : "Settled";

    const khalabillBalance = myFinancial.khalabill - (myFinancial.paymentsByCategory?.khalabill || 0);
    const khalabillStatus = khalabillBalance > 0.01 ? "Due" : khalabillBalance < -0.01 ? "Advance" : "Settled";

    const commonExpenseBalance = myFinancial.commonExpense - (myFinancial.paymentsByCategory?.common_expense || 0);
    const commonExpenseStatus = commonExpenseBalance > 0.01 ? "Due" : commonExpenseBalance < -0.01 ? "Advance" : "Settled";

    return (
        <div className="space-y-6 pb-8">
            {/* Mess Snapshot */}
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Home size={28} strokeWidth={2} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-neutral">{mess.messName}</h1>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
                                {manager && (
                                    <>
                                        <div className="flex items-center gap-1.5">
                                            <Crown size={14} className="text-tertiary" />
                                            <span className="text-neutral/70">Manager:</span>
                                            <span className="font-semibold text-neutral">{manager.name}</span>
                                        </div>
                                        <span className="text-neutral/60">•</span>
                                    </>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <Users size={14} className="text-secondary" />
                                    <span className="font-semibold text-secondary">
                                        {activeMembers.length} Active Member{activeMembers.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral/50">
                                <Calendar size={12} />
                                {MONTH_NAMES[month]} {year}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Activity */}
            <div>
                <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-neutral/60">
                    Today's Activity
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <TodayCard
                        icon={<UtensilsCrossed size={18} />}
                        label="Today's Meals"
                        value={todayData.meals.toFixed(1)}
                        color="primary"
                    />
                    <TodayCard
                        icon={<Wallet size={18} />}
                        label="Today's Food Cost"
                        value={`৳${fmt(todayData.foodCost)}`}
                        color="secondary"
                    />
                    <BazarStatusCard status={todayData.bazarStatus} />
                </div>
            </div>

            {/* My Financial Overview */}
            <div className="space-y-4">
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-neutral/60">
                    My Financial Overview
                </h2>

                {/* Food Cost */}
                <FinancialCategoryCard
                    title="Food Cost"
                    icon={<UtensilsCrossed size={16} />}
                    cost={myFinancial.foodCost}
                    paid={myFinancial.paymentsByCategory?.meal || 0}
                    balance={foodBalance}
                    status={foodStatus}
                    extra={
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral/60">Meals: {myFinancial.meals?.total || 0}</span>
                            <span className="text-neutral/60">Rate: ৳{fmt(myFinancial.foodCost / (myFinancial.meals?.total || 1))}</span>
                        </div>
                    }
                />

                {/* Rent */}
                <FinancialCategoryCard
                    title="Rent / Basa Vara"
                    icon={<Home size={16} />}
                    cost={myFinancial.rent}
                    paid={myFinancial.paymentsByCategory?.rent || 0}
                    balance={rentBalance}
                    status={rentStatus}
                />

                {/* Khalabill */}
                <FinancialCategoryCard
                    title="Khalabill"
                    icon={<Receipt size={16} />}
                    cost={myFinancial.khalabill}
                    paid={myFinancial.paymentsByCategory?.khalabill || 0}
                    balance={khalabillBalance}
                    status={khalabillStatus}
                    extra={
                        <p className="text-xs text-neutral/60">
                            Shared equally among {activeMembers.length} members
                        </p>
                    }
                />

                {/* Common Expense */}
                <FinancialCategoryCard
                    title="Common Expense"
                    icon={<Package size={16} />}
                    cost={myFinancial.commonExpense}
                    paid={myFinancial.paymentsByCategory?.common_expense || 0}
                    balance={commonExpenseBalance}
                    status={commonExpenseStatus}
                    extra={
                        <p className="text-xs text-neutral/60">
                            Shared equally among {activeMembers.length} members
                        </p>
                    }
                />
            </div>

            {/* Final Settlement */}
            <div className="rounded-2xl border border-neutral/10 bg-white p-6 shadow-md">
                <h2 className="mb-5 flex items-center gap-2 text-lg font-extrabold text-neutral">
                    <Receipt size={20} className="text-primary" />
                    Final Settlement
                </h2>
                
                <div className="space-y-3">
                    <SummaryRow label="Food Cost" value={`৳${fmt(myFinancial.foodCost)}`} />
                    <SummaryRow label="Rent" value={`৳${fmt(myFinancial.rent)}`} />
                    <SummaryRow label="Khalabill" value={`৳${fmt(myFinancial.khalabill)}`} />
                    <SummaryRow label="Common Expense" value={`৳${fmt(myFinancial.commonExpense)}`} />
                    
                    <div className="border-t border-gray-200 pt-3">
                        <SummaryRow 
                            label="Total Cost" 
                            value={`৳${fmt(myFinancial.totalCost)}`} 
                            bold 
                        />
                        <SummaryRow 
                            label="Total Paid" 
                            value={`৳${fmt(myFinancial.paid)}`} 
                            bold 
                        />
                    </div>

                    <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-neutral">Final Balance</span>
                            <div className="text-right">
                                <p className="font-mono text-2xl font-extrabold text-neutral">
                                    ৳{fmt(Math.abs(myFinancial.balance))}
                                </p>
                                <StatusBadge status={myFinancial.status} large />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Meal Summary */}
            <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-extrabold text-neutral">
                        <UtensilsCrossed size={20} className="text-primary" />
                        My Meal Summary
                    </h2>
                    <button
                        onClick={() => navigate("/dashboard/my-meals")}
                        className="flex items-center gap-1 text-sm font-bold text-primary transition hover:gap-2"
                    >
                        View My Meals
                        <ArrowRight size={14} />
                    </button>
                </div>
                
                {myMeals ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                        <MealCard label="Total Meals" value={myMeals.total} />
                        <MealCard label="Breakfast" value={myMeals.breakfast} />
                        <MealCard label="Lunch" value={myMeals.lunch} />
                        <MealCard label="Dinner" value={myMeals.dinner} />
                        <MealCard label="Guest Meals" value={myMeals.guestMeal} />
                    </div>
                ) : (
                    <p className="text-center text-sm text-neutral/60">No meal data available</p>
                )}
            </div>

            {/* My Bazar Snapshot */}
            <div className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-extrabold text-neutral">
                        <ShoppingBag size={20} className="text-secondary" />
                        My Bazar Snapshot
                    </h2>
                    <button
                        onClick={() => navigate("/dashboard/my-bazar")}
                        className="flex items-center gap-1 text-sm font-bold text-secondary transition hover:gap-2"
                    >
                        View My Bazar
                        <ArrowRight size={14} />
                    </button>
                </div>

                {myBazar?.activeAssignment ? (
                    <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-secondary">
                            <Package size={14} />
                            Active Assignment
                        </div>
                        <p className="mt-1 text-xs text-neutral/70">
                            Assigned for {new Date(myBazar.activeAssignment.date).toLocaleDateString('en-GB')}
                        </p>
                        <p className="mt-2 text-xs text-neutral/60">
                            {myBazar.activeAssignment.items?.length || 0} items to purchase
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        <BazarStatCard 
                            label="This Month" 
                            value={myBazar?.thisMonthCount || 0} 
                            color="primary"
                        />
                        <BazarStatCard 
                            label="Approved" 
                            value={myBazar?.approvedCount || 0} 
                            color="secondary"
                        />
                        <BazarStatCard 
                            label="Pending" 
                            value={myBazar?.pendingCount || 0} 
                            color="tertiary"
                        />
                    </div>
                )}
            </div>

            {/* My Financial Charts */}
            <div className="space-y-6">
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-neutral/60">
                    My Financial Charts
                </h2>

                {/* Chart 1: Cost Breakdown */}
                {costBreakdownData.length > 0 && (
                    <ChartCard title="My Cost Breakdown" subtitle="Current month expense composition">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={costBreakdownData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {costBreakdownData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "1px solid #e0e0e0",
                                        fontSize: "12px",
                                    }}
                                    formatter={(value) => `৳${fmt(value)}`}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                )}

                {/* Chart 2: Cost vs Paid */}
                <ChartCard title="My Cost vs Paid" subtitle="Total monthly comparison">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={costVsPaidData}>
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
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                {costVsPaidData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Chart 3: Balance by Category */}
                <ChartCard title="My Balance by Category" subtitle="Due/Advance breakdown">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={balanceByCategory}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid #e0e0e0",
                                    fontSize: "12px",
                                }}
                                formatter={(value) => `৳${fmt(Math.abs(value))}`}
                                labelFormatter={(category) => {
                                    const item = balanceByCategory.find(d => d.category === category);
                                    const status = item.balance > 0.01 ? "Due" : item.balance < -0.01 ? "Advance" : "Settled";
                                    return `${category} - ${status}`;
                                }}
                            />
                            <Bar dataKey="balance" fill="#FF8A00" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};

// Helper Components

const TodayCard = ({ icon, label, value, color }) => (
    <div className="rounded-xl border border-primary/10 bg-white p-4 shadow-sm">
        <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-${color}/10 text-${color}`}>
            {icon}
        </div>
        <p className="text-xs font-bold uppercase tracking-wide text-neutral/50">{label}</p>
        <p className="mt-1 text-xl font-extrabold text-neutral">{value}</p>
    </div>
);

const BazarStatusCard = ({ status }) => {
    const configs = {
        none: {
            icon: <ShoppingBag size={18} />,
            label: "No Assignment",
            message: "No active bazar assignment today",
            color: "neutral",
            bgColor: "bg-neutral/10",
            textColor: "text-neutral",
        },
        assigned: {
            icon: <Clock size={18} />,
            label: "Assigned",
            message: "You have an active assignment",
            color: "tertiary",
            bgColor: "bg-tertiary/10",
            textColor: "text-tertiary",
        },
        pending: {
            icon: <Clock size={18} />,
            label: "Pending Review",
            message: "Waiting for manager approval",
            color: "tertiary",
            bgColor: "bg-tertiary/10",
            textColor: "text-tertiary",
        },
        approved: {
            icon: <CheckCircle2 size={18} />,
            label: "Approved",
            message: "Today's bazar approved",
            color: "secondary",
            bgColor: "bg-secondary/10",
            textColor: "text-secondary",
        },
        rejected: {
            icon: <XCircle size={18} />,
            label: "Rejected",
            message: "Today's bazar was rejected",
            color: "red",
            bgColor: "bg-red-50",
            textColor: "text-red-600",
        },
    };

    const config = configs[status] || configs.none;

    return (
        <div className="rounded-xl border border-primary/10 bg-white p-4 shadow-sm">
            <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${config.bgColor} ${config.textColor}`}>
                {config.icon}
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-neutral/50">Bazar Status</p>
            <p className={`mt-1 text-base font-extrabold ${config.textColor}`}>{config.label}</p>
            <p className="mt-0.5 text-xs text-neutral/60">{config.message}</p>
        </div>
    );
};

const FinancialCategoryCard = ({ title, icon, cost, paid, balance, status, extra }) => (
    <div className="rounded-xl border border-primary/10 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-neutral">
                {icon}
                {title}
            </h3>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-3">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">Cost</p>
                <p className="mt-1 font-mono text-sm font-semibold text-neutral">৳{cost.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">Paid</p>
                <p className="mt-1 font-mono text-sm font-semibold text-neutral">৳{paid.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">Balance</p>
                <div className="mt-1 flex items-center gap-2">
                    <p className="font-mono text-sm font-bold text-neutral">
                        ৳{Math.abs(balance).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <StatusBadge status={status} small />
                </div>
            </div>
        </div>

        {extra && <div className="border-t border-gray-100 pt-3">{extra}</div>}
    </div>
);

const SummaryRow = ({ label, value, bold }) => (
    <div className="flex items-center justify-between">
        <span className={`text-sm ${bold ? 'font-bold' : 'font-medium'} text-neutral`}>{label}</span>
        <span className={`font-mono ${bold ? 'text-base font-bold' : 'text-sm font-semibold'} text-neutral`}>{value}</span>
    </div>
);

const StatusBadge = ({ status, small, large }) => {
    const configs = {
        Due: {
            icon: TrendingUp,
            label: "Due",
            className: "bg-red-50 text-red-600 border-red-200",
        },
        Advance: {
            icon: TrendingDown,
            label: "Advance",
            className: "bg-secondary/10 text-secondary border-secondary/20",
        },
        Settled: {
            icon: CheckCircle2,
            label: "Settled",
            className: "bg-primary/10 text-primary border-primary/20",
        },
    };

    const config = configs[status] || configs.Settled;
    const Icon = config.icon;
    const sizeClass = large ? "text-sm px-3 py-1" : small ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";

    return (
        <span className={`inline-flex items-center gap-1 rounded-full border font-bold uppercase tracking-wide ${config.className} ${sizeClass}`}>
            <Icon size={small ? 10 : large ? 14 : 12} />
            {config.label}
        </span>
    );
};

const MealCard = ({ label, value }) => (
    <div className="rounded-lg border border-gray-100 bg-background/50 p-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">{label}</p>
        <p className="mt-1 text-xl font-extrabold text-neutral">{value}</p>
    </div>
);

const BazarStatCard = ({ label, value, color }) => (
    <div className="rounded-lg border border-gray-100 bg-background/50 p-3 text-center">
        <p className={`text-2xl font-extrabold text-${color}`}>{value}</p>
        <p className="mt-1 text-xs font-semibold text-neutral/60">{label}</p>
    </div>
);

const ChartCard = ({ title, subtitle, children }) => (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4">
            <h3 className="text-base font-extrabold text-neutral">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-neutral/50">{subtitle}</p>}
        </div>
        {children}
    </div>
);

export default MemberOverview;

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
    DollarSign, 
    Receipt, 
    Home, 
    TrendingUp,
    Plus,
    Edit,
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import useCurrentUser from "../../../../hooks/useCurrentUser";
import Loading from "../../../../components/Loading/Loading";
import KhalabillModal from "./KhalabillModal";
import ExpenseModal from "./ExpenseModal";
import ViewExpenseModal from "./ViewExpenseModal";
import RentModal from "./RentModal";
import Swal from "sweetalert2";

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

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const EXPENSE_CATEGORIES = [
    "Electricity",
    "Gas",
    "Water",
    "Internet",
    "Cleaning",
    "Maintenance",
    "Repair",
    "Other"
];

const Expenses = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { currentUser, isUserLoading } = useCurrentUser();

    // Current month (Bangladesh time)
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const year = now.getFullYear();
    const month = now.getMonth();

    const [messId, setMessId] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Khalabill state
    const [khalabill, setKhalabill] = useState(null);
    const [activeMemberCount, setActiveMemberCount] = useState(0);
    const [perMember, setPerMember] = useState(0);
    
    // Common expenses state
    const [expenses, setExpenses] = useState([]);
    const [totalCommonExpenses, setTotalCommonExpenses] = useState(0);
    
    // Member rent state
    const [membersWithRent, setMembersWithRent] = useState([]);
    const [totalRent, setTotalRent] = useState(0);

    // Pagination for expenses
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    // Modal states
    const [showKhalabillModal, setShowKhalabillModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showViewExpenseModal, setShowViewExpenseModal] = useState(false);
    const [showRentModal, setShowRentModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [viewingExpense, setViewingExpense] = useState(null);
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

            // Get khalabill
            const khalabillRes = await axiosSecure.get(`/expenses/khalabill/${messData._id}?email=${user.email}`);
            setKhalabill(khalabillRes.data.khalabill);
            setActiveMemberCount(khalabillRes.data.activeMemberCount);
            setPerMember(khalabillRes.data.perMember);

            // Get common expenses
            const expensesRes = await axiosSecure.get(`/expenses/common/${messData._id}?email=${user.email}`);
            setExpenses(expensesRes.data.expenses || []);
            setTotalCommonExpenses(expensesRes.data.total);

            // Get member rents
            const rentRes = await axiosSecure.get(`/expenses/rent/${messData._id}?email=${user.email}`);
            setMembersWithRent(rentRes.data.members || []);
            setTotalRent(rentRes.data.totalRent);

        } catch (err) {
            toastError("Failed to load expenses data.");
        } finally {
            setLoading(false);
        }
    }, [user, currentUser, axiosSecure]);

    useEffect(() => { loadData(); }, [loadData]);

    // Calculate totals
    const totalManagedCost = (khalabill?.amount || 0) + totalCommonExpenses + totalRent;

    // Pagination for expenses
    const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedExpenses = expenses.slice(startIndex, endIndex);

    const handleSaveKhalabill = async (data) => {
        try {
            await axiosSecure.post(`/expenses/khalabill/${messId}`, {
                email: user.email,
                ...data,
            });
            toastSuccess("Khalabill saved successfully.");
            setCurrentPage(1);
            loadData();
            setShowKhalabillModal(false);
        } catch (err) {
            toastError(err?.response?.data?.message || "Failed to save khalabill.");
        }
    };

    const handleSaveExpense = async (data) => {
        if (editingExpense) {
            try {
                await axiosSecure.put(`/expenses/common/${editingExpense._id}`, {
                    email: user.email,
                    ...data,
                });
                toastSuccess("Expense updated successfully.");
                setCurrentPage(1);
                loadData();
                setShowExpenseModal(false);
                setEditingExpense(null);
            } catch (err) {
                toastError(err?.response?.data?.message || "Failed to update expense.");
            }
        } else {
            try {
                await axiosSecure.post(`/expenses/common/${messId}`, {
                    email: user.email,
                    ...data,
                });
                toastSuccess("Expense added successfully.");
                setCurrentPage(1);
                loadData();
                setShowExpenseModal(false);
            } catch (err) {
                toastError(err?.response?.data?.message || "Failed to add expense.");
            }
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        const confirmed = await Swal.fire({
            title: "Delete Expense?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#FF8A00",
            cancelButtonColor: "#6b7280",
        });

        if (!confirmed.isConfirmed) return;

        try {
            await axiosSecure.delete(`/expenses/common/${expenseId}?email=${user.email}`);
            toastSuccess("Expense deleted successfully.");
            setCurrentPage(1);
            loadData();
        } catch (err) {
            toastError(err?.response?.data?.message || "Failed to delete expense.");
        }
    };

    const handleViewExpense = async (expense) => {
        setViewingExpense(expense);
        setShowViewExpenseModal(true);
    };

    const handleEditExpense = (expense) => {
        setEditingExpense(expense);
        setShowExpenseModal(true);
    };

    const handleSaveRent = async (data) => {
        try {
            await axiosSecure.post(`/expenses/rent/${messId}`, {
                email: user.email,
                ...data,
            });
            toastSuccess("Rent saved successfully.");
            loadData();
            setShowRentModal(false);
            setSelectedMember(null);
        } catch (err) {
            toastError(err?.response?.data?.message || "Failed to save rent.");
        }
    };

    const openRentModal = (member) => {
        setSelectedMember(member);
        setShowRentModal(true);
    };

    const fmt = (n) => n.toLocaleString('en-BD');

    if (loading || isUserLoading) return <Loading />;

    if (!currentUser?.hasMess || !messId) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Receipt size={28} strokeWidth={1.8} />
                </span>
                <div>
                    <p className="text-sm font-bold text-neutral">No Active Mess</p>
                    <p className="mt-1 text-xs text-neutral/50">Create or join a mess to manage expenses.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Receipt size={18} strokeWidth={2} />
                    </span>
                    <div>
                        <h1 className="text-xl font-extrabold text-neutral">Expenses</h1>
                        <p className="text-xs font-medium text-neutral/50">
                            Manage monthly khalabill, common expenses and member rent
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
                    label="Khalabill"
                    value={`৳${fmt(khalabill?.amount || 0)}`}
                    color="primary"
                />
                <SummaryCard
                    icon={<Receipt size={18} strokeWidth={2} />}
                    label="Common Expenses"
                    value={`৳${fmt(totalCommonExpenses)}`}
                    color="secondary"
                />
                <SummaryCard
                    icon={<Home size={18} strokeWidth={2} />}
                    label="Total Rent"
                    value={`৳${fmt(totalRent)}`}
                    color="tertiary"
                />
                <SummaryCard
                    icon={<TrendingUp size={18} strokeWidth={2} />}
                    label="Total Managed Cost"
                    value={`৳${fmt(totalManagedCost)}`}
                    color="neutral"
                />
            </div>

            {/* Khalabill Section */}
            <div className="mb-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DollarSign size={18} className="text-primary" />
                        <h2 className="text-sm font-extrabold text-neutral">Khalabill</h2>
                    </div>
                    <button
                        onClick={() => setShowKhalabillModal(true)}
                        className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary/90"
                    >
                        {khalabill ? "Update" : "Set Khalabill"}
                    </button>
                </div>

                {khalabill ? (
                    <div className="space-y-3">
                        <div className="rounded-xl border border-gray-100 bg-white p-4">
                            <div className="mb-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                        Total Khalabill
                                    </p>
                                    <p className="mt-1 font-mono text-lg font-bold text-primary">
                                        ৳{fmt(khalabill.amount)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                        Active Members
                                    </p>
                                    <p className="mt-1 text-lg font-bold text-neutral">
                                        {activeMemberCount}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                        Per Member
                                    </p>
                                    <p className="mt-1 font-mono text-lg font-bold text-secondary">
                                        ৳{fmt(perMember.toFixed(2))}
                                    </p>
                                </div>
                            </div>
                            {khalabill.note && (
                                <div className="border-t border-gray-100 pt-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                        Note
                                    </p>
                                    <p className="mt-1 text-xs text-neutral/70">{khalabill.note}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 py-8 text-center">
                        <p className="text-sm font-bold text-neutral/70">No Khalabill set for this month</p>
                        <p className="text-xs text-neutral/50">
                            Set the monthly khalabill to calculate the equal member share
                        </p>
                    </div>
                )}
            </div>

            {/* Common Expenses Section */}
            <div className="mb-6 rounded-2xl border border-secondary/20 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Receipt size={16} className="text-secondary" />
                            <h2 className="text-sm font-extrabold text-neutral">Common Expenses</h2>
                        </div>
                        <button
                            onClick={() => {
                                setEditingExpense(null);
                                setShowExpenseModal(true);
                            }}
                            className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-white transition hover:bg-secondary/90"
                        >
                            <Plus size={14} />
                            Add Expense
                        </button>
                    </div>
                </div>

                {expenses.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-16 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-secondary">
                            <Receipt size={22} strokeWidth={1.8} />
                        </span>
                        <div>
                            <p className="text-sm font-bold text-neutral">No common expenses yet</p>
                            <p className="mt-0.5 text-xs text-neutral/50">
                                Add electricity, gas, internet or other shared expenses
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-background/40">
                                        <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">Date</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">Category</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">Description</th>
                                        <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Amount</th>
                                        <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedExpenses.map((expense) => (
                                        <tr key={expense._id} className="border-b border-gray-50 hover:bg-background/30 transition">
                                            <td className="px-6 py-3">
                                                <span className="font-semibold text-neutral">
                                                    {new Date(expense.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold text-secondary">
                                                    {expense.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-xs text-neutral/70">
                                                    {expense.note || "-"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="font-mono text-sm font-bold text-secondary">
                                                    ৳{fmt(expense.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewExpense(expense)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-neutral transition hover:bg-background"
                                                        title="View"
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditExpense(expense)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-neutral transition hover:bg-background"
                                                        title="Edit"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteExpense(expense._id)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-tertiary transition hover:bg-tertiary/5"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="border-t border-gray-100 px-6 py-4">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-semibold text-neutral transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                                    >
                                        <ChevronLeft size={14} />
                                        <span className="hidden sm:inline">Previous</span>
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                            const showPage = page === 1 || 
                                                            page === totalPages || 
                                                            Math.abs(page - currentPage) <= 1;
                                            
                                            const showEllipsis = (page === 2 && currentPage > 3) || 
                                                                (page === totalPages - 1 && currentPage < totalPages - 2);

                                            if (!showPage && !showEllipsis) return null;

                                            if (showEllipsis) {
                                                return (
                                                    <span key={page} className="px-2 text-neutral/40">
                                                        ...
                                                    </span>
                                                );
                                            }

                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition ${
                                                        currentPage === page
                                                            ? 'bg-secondary text-white shadow-sm'
                                                            : 'border border-gray-200 text-neutral hover:bg-background'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-semibold text-neutral transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                                    >
                                        <span className="hidden sm:inline">Next</span>
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Member Rent Section */}
            <div className="mb-6 rounded-2xl border border-tertiary/20 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Home size={16} className="text-tertiary" />
                        <h2 className="text-sm font-extrabold text-neutral">Member Rent</h2>
                    </div>
                </div>

                {membersWithRent.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-16 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-tertiary">
                            <Home size={22} strokeWidth={1.8} />
                        </span>
                        <div>
                            <p className="text-sm font-bold text-neutral">No active members</p>
                            <p className="mt-0.5 text-xs text-neutral/50">
                                Add members to manage their monthly rent
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-background/40">
                                    <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">Member</th>
                                    <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">Role</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Monthly Rent</th>
                                    <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">Last Updated</th>
                                    <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {membersWithRent.map((member) => (
                                    <tr key={member.userId.toString()} className="border-b border-gray-50 hover:bg-background/30 transition">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                {member.user?.photoURL ? (
                                                    <img
                                                        src={member.user.photoURL}
                                                        alt={member.user.name}
                                                        referrerPolicy="no-referrer"
                                                        className="h-8 w-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tertiary/10 text-xs font-bold text-tertiary">
                                                        {member.user?.name?.charAt(0).toUpperCase() || "?"}
                                                    </span>
                                                )}
                                                <div>
                                                    <p className="text-xs font-semibold text-neutral">
                                                        {member.user?.name || "Unknown"}
                                                    </p>
                                                    <p className="text-[10px] text-neutral/50">
                                                        {member.user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                member.role === 'manager' ? 'bg-primary/10 text-primary' : 'bg-neutral/10 text-neutral'
                                            }`}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {member.rent !== null ? (
                                                <span className="font-mono text-sm font-bold text-tertiary">
                                                    ৳{fmt(member.rent)}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-neutral/40">Not set</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {member.lastUpdated ? (
                                                <span className="text-xs text-neutral/60">
                                                    {new Date(member.lastUpdated).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-neutral/40">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={() => openRentModal(member)}
                                                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-neutral transition hover:bg-background"
                                                >
                                                    {member.rent !== null ? "Edit Rent" : "Set Rent"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showKhalabillModal && (
                <KhalabillModal
                    khalabill={khalabill}
                    onClose={() => setShowKhalabillModal(false)}
                    onSave={handleSaveKhalabill}
                />
            )}

            {showExpenseModal && (
                <ExpenseModal
                    expense={editingExpense}
                    categories={EXPENSE_CATEGORIES}
                    onClose={() => {
                        setShowExpenseModal(false);
                        setEditingExpense(null);
                    }}
                    onSave={handleSaveExpense}
                />
            )}

            {showViewExpenseModal && viewingExpense && (
                <ViewExpenseModal
                    expense={viewingExpense}
                    onClose={() => {
                        setShowViewExpenseModal(false);
                        setViewingExpense(null);
                    }}
                />
            )}

            {showRentModal && selectedMember && (
                <RentModal
                    member={selectedMember}
                    onClose={() => {
                        setShowRentModal(false);
                        setSelectedMember(null);
                    }}
                    onSave={handleSaveRent}
                />
            )}
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

export default Expenses;

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { 
    Wallet,
    Plus,
    Eye,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Receipt,
    Home,
    DollarSign,
    Package
} from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import useCurrentUser from "../../../../hooks/useCurrentUser";
import Loading from "../../../../components/Loading/Loading";
import PaymentFormModal from "./PaymentFormModal";
import ViewPaymentModal from "./ViewPaymentModal";

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

const CATEGORY_LABELS = {
    meal: "Meal Payment",
    rent: "Rent / Basa Vara",
    khalabill: "Khalabill",
    common_expense: "Common Expense",
    other: "Other"
};

const ITEMS_PER_PAGE = 6;

const Payments = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { currentUser, isUserLoading } = useCurrentUser();

    // Current month (Bangladesh time)
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const year = now.getFullYear();
    const month = now.getMonth();

    const [messId, setMessId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);
    const [totals, setTotals] = useState({});
    const [paymentCount, setPaymentCount] = useState(0);

    // Modal states
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);
    const [viewingPayment, setViewingPayment] = useState(null);

    // Pagination states for each category
    const [mealPage, setMealPage] = useState(1);
    const [rentPage, setRentPage] = useState(1);
    const [khalabillPage, setKhalabillPage] = useState(1);
    const [commonExpensePage, setCommonExpensePage] = useState(1);
    const [otherPage, setOtherPage] = useState(1);

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

            // Get payments
            const paymentsRes = await axiosSecure.get(`/payments/${messData._id}?email=${user.email}`);
            setPayments(paymentsRes.data.payments || []);
            setTotals(paymentsRes.data.totals || {});
            setPaymentCount(paymentsRes.data.count || 0);

        } catch (err) {
            toastError("Failed to load payments data.");
        } finally {
            setLoading(false);
        }
    }, [user, currentUser, axiosSecure]);

    useEffect(() => { loadData(); }, [loadData]);

    // Filter payments by category
    const getPaymentsByCategory = (category) => {
        return payments.filter(p => p.category === category);
    };

    const handleSavePayment = async (data) => {
        if (editingPayment) {
            try {
                await axiosSecure.put(`/payments/${editingPayment._id}`, {
                    email: user.email,
                    ...data,
                });
                toastSuccess("Payment updated successfully.");
                resetPagination();
                loadData();
                setShowPaymentForm(false);
                setEditingPayment(null);
            } catch (err) {
                toastError(err?.response?.data?.message || "Failed to update payment.");
            }
        } else {
            try {
                await axiosSecure.post(`/payments/${messId}`, {
                    email: user.email,
                    ...data,
                });
                toastSuccess("Payment recorded successfully.");
                resetPagination();
                loadData();
                setShowPaymentForm(false);
            } catch (err) {
                toastError(err?.response?.data?.message || "Failed to record payment.");
            }
        }
    };

    const handleDeletePayment = async (paymentId) => {
        const confirmed = await Swal.fire({
            title: "Delete Payment?",
            text: "This payment record will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#FF8A00",
            cancelButtonColor: "#6b7280",
        });

        if (!confirmed.isConfirmed) return;

        try {
            await axiosSecure.delete(`/payments/${paymentId}?email=${user.email}`);
            toastSuccess("Payment deleted successfully.");
            resetPagination();
            loadData();
        } catch (err) {
            toastError(err?.response?.data?.message || "Failed to delete payment.");
        }
    };

    const handleViewPayment = (payment) => {
        setViewingPayment(payment);
        setShowViewModal(true);
    };

    const handleEditPayment = (payment) => {
        setEditingPayment(payment);
        setShowPaymentForm(true);
    };

    const resetPagination = () => {
        setMealPage(1);
        setRentPage(1);
        setKhalabillPage(1);
        setCommonExpensePage(1);
        setOtherPage(1);
    };

    const fmt = (n) => n.toLocaleString('en-BD');

    if (loading || isUserLoading) return <Loading />;

    if (!currentUser?.hasMess || !messId) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Wallet size={28} strokeWidth={1.8} />
                </span>
                <div>
                    <p className="text-sm font-bold text-neutral">No Active Mess</p>
                    <p className="mt-1 text-xs text-neutral/50">Create or join a mess to manage payments.</p>
                </div>
            </div>
        );
    }

    const mealPayments = getPaymentsByCategory('meal');
    const rentPayments = getPaymentsByCategory('rent');
    const khalabillPayments = getPaymentsByCategory('khalabill');
    const commonExpensePayments = getPaymentsByCategory('common_expense');
    const otherPayments = getPaymentsByCategory('other');

    return (
        <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Wallet size={18} strokeWidth={2} />
                        </span>
                        <div>
                            <h1 className="text-xl font-extrabold text-neutral">Payments</h1>
                            <p className="text-xs font-medium text-neutral/50">
                                Record and manage member payments for {MONTH_NAMES[month]} {year}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <button
                    onClick={() => {
                        setEditingPayment(null);
                        setShowPaymentForm(true);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
                >
                    <Plus size={16} />
                    Add Payment
                </button>
            </div>

            {/* Summary Cards - Category-wise Received Amounts */}
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <SummaryCard
                    icon={<Receipt size={18} strokeWidth={2} />}
                    label="Meal Payment"
                    value={`৳${fmt(totals.meal || 0)}`}
                    color="primary"
                />
                <SummaryCard
                    icon={<Home size={18} strokeWidth={2} />}
                    label="Rent / Basa Vara"
                    value={`৳${fmt(totals.rent || 0)}`}
                    color="tertiary"
                />
                <SummaryCard
                    icon={<DollarSign size={18} strokeWidth={2} />}
                    label="Khalabill"
                    value={`৳${fmt(totals.khalabill || 0)}`}
                    color="secondary"
                />
                <SummaryCard
                    icon={<Package size={18} strokeWidth={2} />}
                    label="Common Expense"
                    value={`৳${fmt(totals.common_expense || 0)}`}
                    color="neutral"
                />
                {(totals.other || 0) > 0 && (
                    <SummaryCard
                        icon={<Wallet size={18} strokeWidth={2} />}
                        label="Other"
                        value={`৳${fmt(totals.other || 0)}`}
                        color="neutral"
                    />
                )}
            </div>

            {/* Category Sections */}
            <PaymentSection
                title="Meal Payment"
                icon={<Receipt size={16} />}
                color="primary"
                payments={mealPayments}
                total={totals.meal || 0}
                currentPage={mealPage}
                setCurrentPage={setMealPage}
                onView={handleViewPayment}
                onEdit={handleEditPayment}
                onDelete={handleDeletePayment}
            />

            <PaymentSection
                title="Rent / Basa Vara"
                icon={<Home size={16} />}
                color="tertiary"
                payments={rentPayments}
                total={totals.rent || 0}
                currentPage={rentPage}
                setCurrentPage={setRentPage}
                onView={handleViewPayment}
                onEdit={handleEditPayment}
                onDelete={handleDeletePayment}
            />

            <PaymentSection
                title="Khalabill"
                icon={<DollarSign size={16} />}
                color="secondary"
                payments={khalabillPayments}
                total={totals.khalabill || 0}
                currentPage={khalabillPage}
                setCurrentPage={setKhalabillPage}
                onView={handleViewPayment}
                onEdit={handleEditPayment}
                onDelete={handleDeletePayment}
            />

            <PaymentSection
                title="Common Expense"
                icon={<Package size={16} />}
                color="neutral"
                payments={commonExpensePayments}
                total={totals.common_expense || 0}
                currentPage={commonExpensePage}
                setCurrentPage={setCommonExpensePage}
                onView={handleViewPayment}
                onEdit={handleEditPayment}
                onDelete={handleDeletePayment}
            />

            {otherPayments.length > 0 && (
                <PaymentSection
                    title="Other"
                    icon={<Receipt size={16} />}
                    color="neutral"
                    payments={otherPayments}
                    total={totals.other || 0}
                    currentPage={otherPage}
                    setCurrentPage={setOtherPage}
                    onView={handleViewPayment}
                    onEdit={handleEditPayment}
                    onDelete={handleDeletePayment}
                />
            )}

            {/* Modals */}
            {showPaymentForm && (
                <PaymentFormModal
                    messId={messId}
                    payment={editingPayment}
                    onClose={() => {
                        setShowPaymentForm(false);
                        setEditingPayment(null);
                    }}
                    onSave={handleSavePayment}
                />
            )}

            {showViewModal && viewingPayment && (
                <ViewPaymentModal
                    payment={viewingPayment}
                    onClose={() => {
                        setShowViewModal(false);
                        setViewingPayment(null);
                    }}
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

const PaymentSection = ({ 
    title, 
    icon, 
    color, 
    payments, 
    total, 
    currentPage, 
    setCurrentPage,
    onView,
    onEdit,
    onDelete 
}) => {
    const fmt = (n) => n.toLocaleString('en-BD');

    const colorClasses = {
        primary: "border-primary/20 text-primary",
        secondary: "border-secondary/20 text-secondary",
        tertiary: "border-tertiary/20 text-tertiary",
        neutral: "border-neutral/20 text-neutral",
    };

    if (payments.length === 0) return null;

    // Pagination
    const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedPayments = payments.slice(startIndex, endIndex);

    return (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={colorClasses[color]}>{icon}</span>
                        <h2 className="text-sm font-extrabold text-neutral">{title}</h2>
                    </div>
                    <span className="font-mono text-sm font-bold text-neutral">
                        Total: ৳{fmt(total)}
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-background/40">
                            <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">SI</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">Member</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">Date</th>
                            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Amount</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">Note</th>
                            <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPayments.map((payment, index) => (
                            <tr key={payment._id} className="border-b border-gray-50 hover:bg-background/30 transition">
                                <td className="px-6 py-3">
                                    <span className="text-xs font-semibold text-neutral/70">
                                        {startIndex + index + 1}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {payment.member?.photoURL ? (
                                            <img
                                                src={payment.member.photoURL}
                                                alt={payment.member.name}
                                                referrerPolicy="no-referrer"
                                                className="h-6 w-6 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                                {payment.member?.name?.charAt(0).toUpperCase() || "?"}
                                            </span>
                                        )}
                                        <span className="text-xs font-semibold text-neutral">
                                            {payment.member?.name || "Unknown"}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-xs text-neutral/70">
                                        {new Date(payment.date).toLocaleDateString('en-GB', { 
                                            day: '2-digit', 
                                            month: 'short' 
                                        })}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <span className="font-mono text-sm font-bold text-primary">
                                        ৳{fmt(payment.amount)}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-xs text-neutral/70">
                                        {payment.note || "-"}
                                    </span>
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onView(payment)}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-neutral transition hover:bg-background"
                                            title="View"
                                        >
                                            <Eye size={14} />
                                        </button>
                                        <button
                                            onClick={() => onEdit(payment)}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-neutral transition hover:bg-background"
                                            title="Edit"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(payment._id)}
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
                                                ? 'bg-primary text-white shadow-sm'
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
        </div>
    );
};

export default Payments;

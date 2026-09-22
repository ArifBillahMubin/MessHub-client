import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { 
    ShoppingBag, 
    Plus, 
    UserPlus, 
    Calendar, 
    DollarSign, 
    FileText, 
    CheckCircle2, 
    XCircle, 
    Eye, 
    Edit, 
    Trash2,
    Clock,
    AlertCircle,
    Package,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import useCurrentUser from "../../../../hooks/useCurrentUser";
import Loading from "../../../../components/Loading/Loading";
import AddBazarModal from "./AddBazarModal";
import AssignBazarModal from "./AssignBazarModal";
import ReviewBazarModal from "./ReviewBazarModal";
import ViewBazarModal from "./ViewBazarModal";
import ViewAssignmentModal from "./ViewAssignmentModal";

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

const Bazar = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { currentUser, isUserLoading } = useCurrentUser();

    // Current month (Bangladesh time)
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const year = now.getFullYear();
    const month = now.getMonth();

    const [messId, setMessId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bazarRecords, setBazarRecords] = useState([]);
    const [pendingRecords, setPendingRecords] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showViewBazarModal, setShowViewBazarModal] = useState(false);
    const [showViewAssignmentModal, setShowViewAssignmentModal] = useState(false);
    const [selectedBazar, setSelectedBazar] = useState(null);
    const [editingBazar, setEditingBazar] = useState(null);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [editingAssignment, setEditingAssignment] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

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

            // Get current month bazar (approved only)
            const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
            const approvedRes = await axiosSecure.get(`/bazar/mess/${messData._id}?status=approved&month=${monthStr}`);
            setBazarRecords(approvedRes.data.records || []);

            // Get pending submissions
            const pendingRes = await axiosSecure.get(`/bazar/mess/${messData._id}?status=pending`);
            setPendingRecords(pendingRes.data.records || []);

            // Get active assignments (assigned status only)
            const assignmentsRes = await axiosSecure.get(`/bazar/assignments/mess/${messData._id}`);
            const allAssignments = assignmentsRes.data.assignments || [];
            // Filter for active assignments
            setAssignments(allAssignments.filter(a => a.status === 'assigned'));
        } catch (err) {
            toastError("Failed to load bazar data.");
        } finally {
            setLoading(false);
        }
    }, [user, currentUser, axiosSecure, year, month]);

    useEffect(() => { loadData(); }, [loadData]);

    // Calculate summary
    const totalBazarCost = bazarRecords.reduce((sum, r) => sum + r.totalAmount, 0);
    const pendingCount = pendingRecords.length;

    // Pagination calculations
    const totalPages = Math.ceil(bazarRecords.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedRecords = bazarRecords.slice(startIndex, endIndex);

    const handleAddBazar = async (bazarData) => {
        try {
            await axiosSecure.post(`/bazar/mess/${messId}`, {
                email: user.email,
                ...bazarData,
            });
            toastSuccess("Bazar added successfully.");
            setCurrentPage(1);
            loadData();
            setShowAddModal(false);
        } catch (err) {
            toastError(err?.response?.data?.message || "Failed to add bazar.");
        }
    };

    const handleAssignBazar = async (assignmentData) => {
        try {
            await axiosSecure.post(`/bazar/mess/${messId}/assign`, {
                email: user.email,
                ...assignmentData,
            });
            toastSuccess("Bazar assigned successfully.");
            setCurrentPage(1);
            loadData();
            setShowAssignModal(false);
        } catch (err) {
            toastError(err?.response?.data?.message || "Failed to assign bazar.");
        }
    };

    const handleUpdateAssignment = async (assignmentId, updateData) => {
        try {
            await axiosSecure.put(`/bazar/assignments/${assignmentId}`, {
                email: user.email,
                ...updateData,
            });
            toastSuccess("Assignment updated successfully.");
            loadData();
            setEditingAssignment(null);
            setShowAssignModal(false);
        } catch (err) {
            toastError(err?.response?.data?.message || "Failed to update assignment.");
        }
    };

    const handleCancelAssignment = async (assignmentId) => {
        const confirmed = await Swal.fire({
            title: "Cancel Assignment?",
            text: "This bazar assignment will be cancelled.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Cancel Assignment",
            cancelButtonText: "Keep Assignment",
            confirmButtonColor: "#FF8A00",
            cancelButtonColor: "#6b7280",
        });

        if (!confirmed.isConfirmed) return;

        try {
            await axiosSecure.put(`/bazar/assignments/${assignmentId}/cancel`, { email: user.email });
            toastSuccess("Assignment cancelled successfully.");
            loadData();
        } catch (err) {
            toastError(err?.response?.data?.message || "Failed to cancel assignment.");
        }
    };

    const handleApprove = async (bazarId) => {
        const confirmed = await Swal.fire({
            title: "Approve Bazar?",
            text: "This will add the bazar to official records.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Approve",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#2E9B45",
            cancelButtonColor: "#6b7280",
        });

        if (!confirmed.isConfirmed) return;

        try {
            await axiosSecure.put(`/bazar/${bazarId}/approve`, { email: user.email });
            toastSuccess("Bazar approved successfully.");
            setCurrentPage(1);
            loadData();
            setShowReviewModal(false);
        } catch (err) {
            toastError(err?.response?.data?.message || "Failed to approve bazar.");
        }
    };

    const handleReject = async (bazarId) => {
        const { value: reason } = await Swal.fire({
            title: "Reject Bazar",
            text: "Please provide a reason for rejection:",
            input: "textarea",
            inputPlaceholder: "Enter rejection reason...",
            showCancelButton: true,
            confirmButtonText: "Reject",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#FF8A00",
            cancelButtonColor: "#6b7280",
            inputValidator: (value) => {
                if (!value) return "Please provide a reason!";
            },
        });

        if (!reason) return;

        try {
            await axiosSecure.put(`/bazar/${bazarId}/reject`, { 
                email: user.email,
                reason,
            });
            toastSuccess("Bazar rejected.");
            setCurrentPage(1);
            loadData();
            setShowReviewModal(false);
        } catch (err) {
            toastError(err?.response?.data?.message || "Failed to reject bazar.");
        }
    };

    const handleEditBazar = async (bazarId, updateData) => {
        try {
            await axiosSecure.put(`/bazar/${bazarId}`, {
                email: user.email,
                ...updateData,
            });
            toastSuccess("Bazar updated successfully.");
            setCurrentPage(1);
            loadData();
            setEditingBazar(null);
            setShowAddModal(false);
        } catch (err) {
            toastError(err?.response?.data?.message || "Failed to update bazar.");
        }
    };

    const handleDeleteBazar = async (bazarId) => {
        const confirmed = await Swal.fire({
            title: "Delete Bazar?",
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
            await axiosSecure.delete(`/bazar/${bazarId}?email=${user.email}`);
            toastSuccess("Bazar deleted successfully.");
            setCurrentPage(1);
            loadData();
        } catch (err) {
            toastError(err?.response?.data?.message || "Failed to delete bazar.");
        }
    };

    const openEditModal = (bazar) => {
        setEditingBazar(bazar);
        setShowAddModal(true);
    };

    const openReviewModal = (bazar) => {
        setSelectedBazar(bazar);
        setShowReviewModal(true);
    };

    const openViewBazarModal = (bazar) => {
        setSelectedBazar(bazar);
        setShowViewBazarModal(true);
    };

    const openViewAssignmentModal = (assignment) => {
        setSelectedAssignment(assignment);
        setShowViewAssignmentModal(true);
    };

    const openEditAssignmentModal = (assignment) => {
        setEditingAssignment(assignment);
        setShowAssignModal(true);
    };

    const fmt = (n) => n.toLocaleString('en-BD');

    if (loading || isUserLoading) return <Loading />;

    if (!currentUser?.hasMess || !messId) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ShoppingBag size={28} strokeWidth={1.8} />
                </span>
                <div>
                    <p className="text-sm font-bold text-neutral">No Active Mess</p>
                    <p className="mt-1 text-xs text-neutral/50">Create or join a mess to manage bazar.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ShoppingBag size={18} strokeWidth={2} />
                        </span>
                        <div>
                            <h1 className="text-xl font-extrabold text-neutral">Bazar</h1>
                            <p className="text-xs font-medium text-neutral/50">
                                Manage shopping, assignments and bazar expenses
                            </p>
                        </div>
                    </div>
                    <p className="text-sm font-bold text-neutral">
                        {MONTH_NAMES[month]} {year}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAssignModal(true)}
                        className="flex items-center gap-2 rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
                    >
                        <UserPlus size={16} />
                        Assign Bazar
                    </button>
                    <button
                        onClick={() => {
                            setEditingBazar(null);
                            setShowAddModal(true);
                        }}
                        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
                    >
                        <Plus size={16} />
                        Add Bazar
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SummaryCard
                    icon={<DollarSign size={18} strokeWidth={2} />}
                    label="Total Bazar Cost"
                    value={`৳${fmt(totalBazarCost)}`}
                    color="primary"
                />
                <SummaryCard
                    icon={<Clock size={18} strokeWidth={2} />}
                    label="Pending Reviews"
                    value={pendingCount}
                    color="tertiary"
                />
            </div>

            {/* Pending Review Section */}
            {pendingCount > 0 && (
                <div className="mb-6 rounded-2xl border border-tertiary/20 bg-gradient-to-br from-tertiary/5 to-tertiary/10 p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <AlertCircle size={18} className="text-tertiary" />
                        <h2 className="text-sm font-extrabold text-neutral">
                            Pending Reviews ({pendingCount})
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {pendingRecords.map((record) => (
                            <div
                                key={record._id}
                                className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4"
                            >
                                <div className="flex items-center gap-3">
                                    {record.buyer?.photoURL ? (
                                        <img
                                            src={record.buyer.photoURL}
                                            alt={record.buyer.name}
                                            referrerPolicy="no-referrer"
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                            {record.buyer?.name?.charAt(0).toUpperCase() || "?"}
                                        </span>
                                    )}
                                    <div>
                                        <p className="text-sm font-bold text-neutral">
                                            {record.buyer?.name || "Unknown"}
                                        </p>
                                        <p className="text-xs text-neutral/60">
                                            {new Date(record.date).toLocaleDateString()} • {record.items.length} items • ৳{fmt(record.totalAmount)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openReviewModal(record)}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-neutral transition hover:bg-background"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleApprove(record._id)}
                                        className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-white transition hover:bg-secondary/90"
                                    >
                                        <CheckCircle2 size={14} />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(record._id)}
                                        className="flex items-center gap-1.5 rounded-lg bg-tertiary px-3 py-2 text-xs font-semibold text-white transition hover:bg-tertiary/90"
                                    >
                                        <XCircle size={14} />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Assignments */}
            {assignments.length > 0 && (
                <div className="mb-6 rounded-2xl border border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10 p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <Package size={18} className="text-secondary" />
                        <h2 className="text-sm font-extrabold text-neutral">
                            Active Assignments ({assignments.length})
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {assignments.map((assignment) => (
                            <div
                                key={assignment._id}
                                className="rounded-xl border border-gray-100 bg-white p-4"
                            >
                                <div className="mb-3 flex items-center gap-3">
                                    {assignment.assignedUser?.photoURL ? (
                                        <img
                                            src={assignment.assignedUser.photoURL}
                                            alt={assignment.assignedUser.name}
                                            referrerPolicy="no-referrer"
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-sm font-bold text-secondary">
                                            {assignment.assignedUser?.name?.charAt(0).toUpperCase() || "?"}
                                        </span>
                                    )}
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-neutral">
                                            {assignment.assignedUser?.name || "Unknown"}
                                        </p>
                                        <p className="text-xs text-neutral/60">
                                            {new Date(assignment.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                        Shopping List ({assignment.items.length} items)
                                    </p>
                                    <div className="space-y-1">
                                        {assignment.items.slice(0, 3).map((item, idx) => (
                                            <p key={idx} className="text-xs text-neutral/70">
                                                • {item.name}
                                                {item.quantity > 0 && ` — ${item.quantity} ${item.unit}`}
                                            </p>
                                        ))}
                                        {assignment.items.length > 3 && (
                                            <p className="text-xs text-neutral/50">
                                                + {assignment.items.length - 3} more...
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <span className="inline-flex rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold text-secondary">
                                        Assigned
                                    </span>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => openViewAssignmentModal(assignment)}
                                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-neutral transition hover:bg-background"
                                            title="View"
                                        >
                                            <Eye size={13} />
                                        </button>
                                        <button
                                            onClick={() => openEditAssignmentModal(assignment)}
                                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-neutral transition hover:bg-background"
                                            title="Modify"
                                        >
                                            <Edit size={13} />
                                        </button>
                                        <button
                                            onClick={() => handleCancelAssignment(assignment._id)}
                                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-tertiary transition hover:bg-tertiary/5"
                                            title="Cancel"
                                        >
                                            <XCircle size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bazar History */}
            <div className="rounded-2xl border border-primary/10 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <h2 className="flex items-center gap-2 text-sm font-extrabold text-neutral">
                        <FileText size={16} className="text-primary" />
                        Bazar History
                    </h2>
                </div>

                {bazarRecords.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-primary">
                            <ShoppingBag size={22} strokeWidth={1.8} />
                        </span>
                        <div>
                            <p className="text-sm font-bold text-neutral">No Bazar Records Yet</p>
                            <p className="mt-0.5 text-xs text-neutral/50">
                                Add your first bazar entry to get started.
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
                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">Buyer</th>
                                        <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">Items</th>
                                        <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Amount</th>
                                        <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">Source</th>
                                        <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedRecords.map((record) => (
                                    <tr key={record._id} className="border-b border-gray-50 hover:bg-background/30 transition">
                                        <td className="px-6 py-3">
                                            <span className="font-semibold text-neutral">
                                                {new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {record.buyer?.photoURL ? (
                                                    <img
                                                        src={record.buyer.photoURL}
                                                        alt={record.buyer.name}
                                                        referrerPolicy="no-referrer"
                                                        className="h-6 w-6 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                                        {record.buyer?.name?.charAt(0).toUpperCase() || "?"}
                                                    </span>
                                                )}
                                                <span className="text-xs font-semibold text-neutral/80">
                                                    {record.buyer?.name || "Unknown"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-xs text-neutral/70">{record.items.length}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="font-mono text-sm font-bold text-primary">৳{fmt(record.totalAmount)}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                record.source === 'manager' ? 'bg-primary/10 text-primary' :
                                                record.source === 'assigned' ? 'bg-secondary/10 text-secondary' :
                                                'bg-neutral/10 text-neutral'
                                            }`}>
                                                {record.source === 'manager' ? 'Manager' :
                                                 record.source === 'assigned' ? 'Assigned' : 'Member'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openViewBazarModal(record)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-secondary transition hover:bg-secondary/5"
                                                    title="View"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(record)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-neutral transition hover:bg-background"
                                                    title="Edit"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBazar(record._id)}
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

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="border-t border-gray-100 px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                                {/* Previous Button */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-semibold text-neutral transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                                >
                                    <ChevronLeft size={14} />
                                    <span className="hidden sm:inline">Previous</span>
                                </button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                        // Show first, last, current, and adjacent pages
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

                                {/* Next Button */}
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

            {/* Modals */}
            {showAddModal && (
                <AddBazarModal
                    messId={messId}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingBazar(null);
                    }}
                    onSubmit={editingBazar ? (data) => handleEditBazar(editingBazar._id, data) : handleAddBazar}
                    editingBazar={editingBazar}
                />
            )}

            {showAssignModal && (
                <AssignBazarModal
                    messId={messId}
                    onClose={() => {
                        setShowAssignModal(false);
                        setEditingAssignment(null);
                    }}
                    onSubmit={editingAssignment ? handleUpdateAssignment : handleAssignBazar}
                    editingAssignment={editingAssignment}
                />
            )}

            {showReviewModal && selectedBazar && (
                <ReviewBazarModal
                    bazar={selectedBazar}
                    onClose={() => {
                        setShowReviewModal(false);
                        setSelectedBazar(null);
                    }}
                    onApprove={() => handleApprove(selectedBazar._id)}
                    onReject={() => handleReject(selectedBazar._id)}
                />
            )}

            {showViewBazarModal && selectedBazar && (
                <ViewBazarModal
                    bazar={selectedBazar}
                    onClose={() => {
                        setShowViewBazarModal(false);
                        setSelectedBazar(null);
                    }}
                />
            )}

            {showViewAssignmentModal && selectedAssignment && (
                <ViewAssignmentModal
                    assignment={selectedAssignment}
                    onClose={() => {
                        setShowViewAssignmentModal(false);
                        setSelectedAssignment(null);
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

export default Bazar;

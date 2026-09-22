import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
    ShoppingBag, 
    Plus, 
    Calendar, 
    Clock, 
    CheckCircle2, 
    XCircle,
    AlertTriangle,
    Package
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useCurrentUser from "../../../hooks/useCurrentUser";
import Loading from "../../../components/Loading/Loading";
import SubmitBazarModal from "./SubmitBazarModal";

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

const MyBazar = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { currentUser, isUserLoading } = useCurrentUser();

    const [messId, setMessId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState([]);
    const [history, setHistory] = useState([]);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submittingNew, setSubmittingNew] = useState(false);

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

            // Get my assignments
            const assignmentsRes = await axiosSecure.get(`/bazar/assignments/my?email=${user.email}`);
            setAssignments(assignmentsRes.data.assignments || []);

            // Get my bazar history
            const historyRes = await axiosSecure.get(`/bazar/my-history?email=${user.email}&messId=${messData._id}`);
            setHistory(historyRes.data.records || []);
        } catch (err) {
            toastError("Failed to load bazar data.");
        } finally {
            setLoading(false);
        }
    }, [user, currentUser, axiosSecure]);

    useEffect(() => { loadData(); }, [loadData]);

    // Find active assignment (assigned status)
    const activeAssignment = assignments.find(a => a.status === 'assigned');

    const handleSubmitBazar = async (bazarData) => {
        try {
            await axiosSecure.post(`/bazar/mess/${messId}/submit`, {
                email: user.email,
                ...bazarData,
            });
            toastSuccess("Bazar submitted successfully. Waiting for manager approval.");
            loadData();
            setShowSubmitModal(false);
            setSelectedAssignment(null);
            setSubmittingNew(false);
        } catch (err) {
            toastError(err?.response?.data?.message || "Failed to submit bazar.");
        }
    };

    const openSubmitModal = (assignment = null) => {
        if (assignment) {
            setSelectedAssignment(assignment);
            setSubmittingNew(false);
        } else {
            setSelectedAssignment(null);
            setSubmittingNew(true);
        }
        setShowSubmitModal(true);
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
                    <p className="mt-1 text-xs text-neutral/50">Join a mess to view bazar assignments.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ShoppingBag size={18} strokeWidth={2} />
                        </span>
                        <div>
                            <h1 className="text-xl font-extrabold text-neutral">My Bazar</h1>
                            <p className="text-xs font-medium text-neutral/50">
                                View assignments and submit completed shopping
                            </p>
                        </div>
                    </div>
                </div>

                {/* Add Bazar Button */}
                <button
                    onClick={() => openSubmitModal(null)}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
                >
                    <Plus size={16} />
                    Add Bazar
                </button>
            </div>

            {/* Active Assignment Highlight */}
            {activeAssignment && (
                <div className="mb-6 rounded-2xl border border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10 p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <Package size={18} className="text-secondary" />
                        <h2 className="text-sm font-extrabold text-neutral">Active Assignment</h2>
                    </div>

                    <div className="mb-4 flex items-center gap-4">
                        {activeAssignment.manager?.photoURL ? (
                            <img
                                src={activeAssignment.manager.photoURL}
                                alt={activeAssignment.manager.name}
                                referrerPolicy="no-referrer"
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        ) : (
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                {activeAssignment.manager?.name?.charAt(0).toUpperCase() || "?"}
                            </span>
                        )}
                        <div>
                            <p className="text-xs text-neutral/50">Assigned by</p>
                            <p className="text-sm font-bold text-neutral">{activeAssignment.manager?.name || "Manager"}</p>
                        </div>
                        <div className="ml-auto">
                            <p className="text-xs text-neutral/50">Date</p>
                            <p className="text-sm font-bold text-neutral">
                                {new Date(activeAssignment.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                            </p>
                        </div>
                    </div>

                    {/* Shopping List */}
                    <div className="mb-4">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-neutral/60">Shopping List</p>
                        <div className="space-y-2">
                            {activeAssignment.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-lg bg-white px-4 py-2.5"
                                >
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                                        {index + 1}
                                    </span>
                                    <span className="flex-1 text-sm font-semibold text-neutral">{item.name}</span>
                                    {item.quantity > 0 && (
                                        <span className="text-xs text-neutral/60">
                                            {item.quantity} {item.unit}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {activeAssignment.note && (
                        <div className="mb-4 rounded-lg border border-gray-100 bg-white p-3">
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-neutral/40">Instructions</p>
                            <p className="text-sm text-neutral/80">{activeAssignment.note}</p>
                        </div>
                    )}

                    <button
                        onClick={() => openSubmitModal(activeAssignment)}
                        className="w-full rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-secondary/90"
                    >
                        Submit Bazar
                    </button>
                </div>
            )}

            {/* My Bazar History */}
            <div className="rounded-2xl border border-primary/10 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <h2 className="flex items-center gap-2 text-sm font-extrabold text-neutral">
                        <Calendar size={16} className="text-primary" />
                        My Bazar History
                    </h2>
                </div>

                {history.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-primary">
                            <ShoppingBag size={22} strokeWidth={1.8} />
                        </span>
                        <div>
                            <p className="text-sm font-bold text-neutral">No Bazar History Yet</p>
                            <p className="mt-0.5 text-xs text-neutral/50">
                                Your submitted bazar records will appear here.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {history.map((record) => (
                            <div key={record._id} className="p-6 hover:bg-background/30 transition">
                                <div className="mb-3 flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-neutral">
                                            {new Date(record.date).toLocaleDateString('en-GB', { 
                                                day: '2-digit', 
                                                month: 'long', 
                                                year: 'numeric' 
                                            })}
                                        </p>
                                        <p className="mt-0.5 text-xs text-neutral/60">
                                            {record.items.length} items • ৳{fmt(record.totalAmount)}
                                        </p>
                                    </div>
                                    <StatusBadge status={record.status} />
                                </div>

                                {/* Items */}
                                <div className="mb-3 space-y-1.5">
                                    {record.items.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between text-xs">
                                            <span className="text-neutral/70">
                                                {item.name} - {item.quantity} {item.unit}
                                            </span>
                                            <span className="font-mono font-semibold text-neutral">৳{fmt(item.amount)}</span>
                                        </div>
                                    ))}
                                </div>

                                {record.note && (
                                    <p className="mb-3 text-xs italic text-neutral/60">&ldquo;{record.note}&rdquo;</p>
                                )}

                                {/* Rejection Reason */}
                                {record.status === 'rejected' && record.rejectionReason && (
                                    <div className="flex items-start gap-2 rounded-lg border border-tertiary/20 bg-tertiary/5 p-3">
                                        <AlertTriangle size={14} className="mt-0.5 text-tertiary" />
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold uppercase tracking-wide text-tertiary">Rejection Reason</p>
                                            <p className="mt-1 text-xs text-neutral/80">{record.rejectionReason}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submit Modal */}
            {showSubmitModal && (
                <SubmitBazarModal
                    messId={messId}
                    assignment={selectedAssignment}
                    isNew={submittingNew}
                    onClose={() => {
                        setShowSubmitModal(false);
                        setSelectedAssignment(null);
                        setSubmittingNew(false);
                    }}
                    onSubmit={handleSubmitBazar}
                />
            )}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const configs = {
        pending: {
            icon: Clock,
            label: "Pending Review",
            className: "bg-tertiary/10 text-tertiary border-tertiary/20",
        },
        approved: {
            icon: CheckCircle2,
            label: "Approved",
            className: "bg-secondary/10 text-secondary border-secondary/20",
        },
        rejected: {
            icon: XCircle,
            label: "Rejected",
            className: "bg-neutral/10 text-neutral border-neutral/20",
        },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}>
            <Icon size={12} />
            {config.label}
        </span>
    );
};

export default MyBazar;

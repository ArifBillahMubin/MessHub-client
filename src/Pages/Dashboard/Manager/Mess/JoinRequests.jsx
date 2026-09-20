import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { Users, Check, X, Loader2, Clock, Phone, Mail } from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import Loading from "../../../../components/Loading/Loading";

const JoinRequests = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const [mess, setMess] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null); // tracks which row is being actioned

    const fetchData = useCallback(async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            // First get the manager's mess so we have the messId
            const messRes = await axiosSecure.get(`/users/my-mess?email=${user.email}`);
            const messData = messRes.data.mess;
            setMess(messData);

            if (messData?._id) {
                const reqRes = await axiosSecure.get(`/join-requests/mess/${messData._id}`);
                setRequests(reqRes.data);
            }
        } catch {
            toast.error("Failed to load join requests.", {
                style: { borderRadius: "12px", background: "#ffffff", color: "#173B3A", border: "1px solid #FF8A00", fontWeight: "600" },
                iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
            });
        } finally {
            setLoading(false);
        }
    }, [user, axiosSecure]);
    
    useEffect(() => { fetchData(); }, [fetchData]);

    const handleApprove = async (req) => {
        const confirmed = await Swal.fire({
            title: "Approve Request?",
            text: `Add ${req.name} to ${mess?.name}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Approve",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#2E9B45",
            cancelButtonColor: "#6b7280",
        });
        if (!confirmed.isConfirmed) return;

        setActionId(req._id);
        try {
            await axiosSecure.patch(`/join-requests/${req._id}/approve`);
            toast.success(`${req.name} has been added to the mess.`, {
                duration: 3000,
                style: { borderRadius: "12px", background: "#D5FBF9", color: "#173B3A", border: "1px solid #006B68", fontWeight: "600" },
                iconTheme: { primary: "#006B68", secondary: "#ffffff" },
            });
            fetchData();
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to approve request.";
            toast.error(msg, {
                style: { borderRadius: "12px", background: "#ffffff", color: "#173B3A", border: "1px solid #FF8A00", fontWeight: "600" },
                iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
            });
        } finally {
            setActionId(null);
        }
    };

    const handleReject = async (req) => {
        const confirmed = await Swal.fire({
            title: "Reject Request?",
            text: `Decline the request from ${req.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Reject",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
        });
        if (!confirmed.isConfirmed) return;

        setActionId(req._id);
        try {
            await axiosSecure.patch(`/join-requests/${req._id}/reject`);
            toast.success("Request rejected.", {
                style: { borderRadius: "12px", background: "#D5FBF9", color: "#173B3A", border: "1px solid #006B68", fontWeight: "600" },
                iconTheme: { primary: "#006B68", secondary: "#ffffff" },
            });
            fetchData();
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to reject request.";
            toast.error(msg, {
                style: { borderRadius: "12px", background: "#ffffff", color: "#173B3A", border: "1px solid #FF8A00", fontWeight: "600" },
                iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
            });
        } finally {
            setActionId(null);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="p-8">

            {/* Page header */}
            <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {mess?.name || "Mess"}
                </span>
                <h1 className="mt-1.5 text-2xl font-extrabold text-neutral">Join Requests</h1>
                <p className="mt-1 text-sm font-medium text-neutral/50">
                    Review and manage pending membership requests.
                </p>
            </div>

            {/* Empty state */}
            {requests.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-primary/20 bg-white py-16 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-primary">
                        <Users size={26} strokeWidth={1.8} />
                    </span>
                    <div>
                        <p className="text-sm font-extrabold text-neutral">No pending requests</p>
                        <p className="mt-1 text-xs font-medium text-neutral/50">
                            When someone requests to join, they will appear here.
                        </p>
                    </div>
                </div>
            )}

            {/* Request list */}
            {requests.length > 0 && (
                <div className="space-y-3">
                    {requests.map((req) => {
                        const isActioning = actionId === req._id;
                        return (
                            <div
                                key={req._id}
                                className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                            >
                                {/* Requester info */}
                                <div className="flex min-w-0 flex-col gap-1">
                                    <p className="truncate text-sm font-extrabold text-neutral">{req.name}</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                                        <span className="flex items-center gap-1 text-[11px] text-neutral/50">
                                            <Mail size={11} />
                                            {req.email}
                                        </span>
                                        {req.phone && (
                                            <span className="flex items-center gap-1 text-[11px] text-neutral/50">
                                                <Phone size={11} />
                                                {req.phone}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-neutral/40">
                                        <Clock size={11} />
                                        {new Date(req.createdAt).toLocaleDateString("en-GB", {
                                            day: "numeric", month: "short", year: "numeric",
                                        })}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex shrink-0 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleReject(req)}
                                        disabled={isActioning}
                                        className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                                    >
                                        {isActioning ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                                        Reject
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleApprove(req)}
                                        disabled={isActioning}
                                        className="flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-white transition hover:bg-secondary/90 disabled:opacity-50"
                                    >
                                        {isActioning ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                                        Approve
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default JoinRequests;

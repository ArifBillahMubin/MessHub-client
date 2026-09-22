import { useState, useEffect } from "react";
import useRole from "../../hooks/useRole";
import useCurrentUser from "../../hooks/useCurrentUser";
import useMessRole from "../../hooks/useMessRole";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loading/Loading";
import MessSetup from "./Member/MessSetup";
import ManagerOverview from "./Manager/ManagerOverview";
import MemberOverview from "./Member/MemberOverview";
import DevPlaceholder from "../../components/DevPlaceholder/DevPlaceholder";
import { Clock, XCircle } from "lucide-react";

// Shown inside DashboardOverview when hasMess=false — lists pending/rejected requests
const PendingRequestsPanel = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;
        axiosSecure
            .get(`/join-requests/my-pending?email=${user.email}`)
            .then(res => setRequests(res.data))
            .catch(() => setRequests([]))
            .finally(() => setLoading(false));
    }, [user?.email, axiosSecure]);

    if (loading) return null; // don't block the page while this loads
    if (requests.length === 0) return null;

    const statusIcon = (status) => {
        if (status === "rejected") return <XCircle size={14} className="text-red-400" />;
        return <Clock size={14} className="text-tertiary" />;
    };

    const statusLabel = (status) => {
        if (status === "rejected") return <span className="text-red-500">Rejected</span>;
        return <span className="text-tertiary">Pending</span>;
    };

    return (
        <div className="mt-6 w-full max-w-2xl">
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral/40">
                Your Join Requests
            </h3>
            <div className="space-y-2">
                {requests.map(req => (
                    <div
                        key={req._id}
                        className="flex items-center justify-between gap-4 rounded-xl border border-primary/10 bg-white px-4 py-3 shadow-sm"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-neutral">{req.messName || "Mess"}</p>
                            <p className="font-mono text-[10px] text-neutral/40">{req.messCode}</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-0.5">
                            <div className="flex items-center gap-1 text-xs font-semibold">
                                {statusIcon(req.status)}
                                {statusLabel(req.status)}
                            </div>
                            <p className="text-[10px] text-neutral/40">
                                {new Date(req.createdAt).toLocaleDateString("en-GB", {
                                    day: "numeric", month: "short", year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DashboardOverview = () => {
    const [role, isRoleLoading] = useRole();
    const { currentUser, isUserLoading } = useCurrentUser();
    const [messRole, isMessRoleLoading] = useMessRole();

    if (isRoleLoading || isUserLoading || isMessRoleLoading) return <Loading />;

    if (role === "super_admin") {
        return <DevPlaceholder title="Super Admin Overview" />;
    }

    // No mess yet — show setup cards + any pending requests
    if (!currentUser?.hasMess) {
        return (
            <div className="flex flex-col items-center px-4">
                <div className="mb-8 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                        Get Started
                    </span>
                    <h1 className="mt-3 text-2xl font-extrabold text-neutral sm:text-3xl">
                        Set Up Your Mess
                    </h1>
                    <p className="mt-2 text-sm font-medium text-neutral/50">
                        You are not part of any mess yet. Create a new one or join an existing mess using a code.
                    </p>
                </div>

                <MessSetup />
                <PendingRequestsPanel />
            </div>
        );
    }

    if (messRole === "manager") {
        return <ManagerOverview />;
    }

    return <MemberOverview />;
};

export default DashboardOverview;

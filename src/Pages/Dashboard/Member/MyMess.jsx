import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
    Home, MapPin, Calendar, Phone, Mail, Crown, User as UserIcon
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useCurrentUser from "../../../hooks/useCurrentUser";
import Loading from "../../../components/Loading/Loading";

const MyMess = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { currentUser, isUserLoading } = useCurrentUser();

    const [mess, setMess] = useState(null);
    const [manager, setManager] = useState(null);
    const [loading, setLoading] = useState(true);
    const [myMembership, setMyMembership] = useState(null);
    const [memberCount, setMemberCount] = useState(0);

    const loadData = useCallback(async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            // Get my mess
            const messRes = await axiosSecure.get(`/users/my-mess?email=${user.email}`);
            const messData = messRes.data.mess;
            if (!messData) {
                setLoading(false);
                return;
            }
            setMess(messData);

            // Get member info (just for count and manager)
            const membersRes = await axiosSecure.get(`/mess-members/${messData._id}?limit=50`);
            const allMembers = membersRes.data.members || [];
            setMemberCount(allMembers.length);

            // Find manager
            const managerMember = allMembers.find(m => m.role === "manager");
            setManager(managerMember);

            // Find my membership
            const me = allMembers.find(m => m.email === user.email);
            setMyMembership(me);
        } catch (err) {
            toast.error("Failed to load mess data.", {
                style: { borderRadius: "12px", background: "#ffffff", color: "#173B3A", border: "1px solid #FF8A00", fontWeight: "600" },
                iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
            });
        } finally {
            setLoading(false);
        }
    }, [user, axiosSecure]);

    useEffect(() => { loadData(); }, [loadData]);

    if (loading || isUserLoading) return <Loading />;

    if (!currentUser?.hasMess || !mess) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Home size={28} strokeWidth={1.8} />
                </span>
                <div>
                    <p className="text-sm font-bold text-neutral">No Active Mess</p>
                    <p className="mt-1 text-xs text-neutral/50">You are not currently part of any mess.</p>
                </div>
            </div>
        );
    }

    const locationStr = [mess.location?.address, mess.location?.area, mess.location?.city]
        .filter(Boolean).join(", ");

    return (
        <div className="mx-auto max-w-5xl">
            {/* Page Header */}
            <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {mess.name}
                </span>
                <h1 className="mt-1.5 text-2xl font-extrabold text-neutral">My Mess</h1>
                <p className="mt-1 text-sm font-medium text-neutral/50">
                    View your mess information and manager details.
                </p>
            </div>

            {/* Mess Overview Card */}
            <div className="mb-5 rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-neutral">
                    <Home size={16} className="text-primary" />
                    Mess Information
                </h2>
                <div className="space-y-4">
                    <InfoRow
                        icon={<Home size={16} />}
                        label="Mess Name"
                        value={mess.name}
                    />
                    {locationStr && (
                        <InfoRow
                            icon={<MapPin size={16} />}
                            label="Location"
                            value={locationStr}
                        />
                    )}
                    {mess.description && (
                        <InfoRow
                            icon={<UserIcon size={16} />}
                            label="Description"
                            value={mess.description}
                        />
                    )}
                    {myMembership?.joinedAt && (
                        <InfoRow
                            icon={<Calendar size={16} />}
                            label="You Joined"
                            value={new Date(myMembership.joinedAt).toLocaleDateString("en-GB", {
                                day: "numeric", month: "long", year: "numeric"
                            })}
                        />
                    )}
                    <InfoRow
                        icon={<UserIcon size={16} />}
                        label="Mess Status"
                        value={
                            <span className="inline-flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-secondary" />
                                <span className="font-semibold text-secondary">Active</span>
                            </span>
                        }
                    />
                </div>
            </div>

            {/* Manager Card */}
            {manager && (
                <div className="mb-5 rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-neutral">
                        <Crown size={16} className="text-primary" />
                        Mess Manager
                    </h2>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            {manager.photoURL ? (
                                <img
                                    src={manager.photoURL}
                                    alt={manager.name}
                                    referrerPolicy="no-referrer"
                                    className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                                />
                            ) : (
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                                    {manager.name?.charAt(0).toUpperCase() || "?"}
                                </span>
                            )}
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-neutral">{manager.name}</p>
                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                                        Manager
                                    </span>
                                </div>
                                <p className="text-xs text-neutral/60">{manager.email}</p>
                            </div>
                        </div>

                        {/* Contact Actions */}
                        <div className="flex gap-2">
                            {manager.phone && (
                                <a
                                    href={`tel:${manager.phone}`}
                                    className="flex items-center gap-1.5 rounded-xl border border-primary/20 bg-white px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary/5"
                                >
                                    <Phone size={13} />
                                    Call
                                </a>
                            )}
                            <a
                                href={`mailto:${manager.email}`}
                                className="flex items-center gap-1.5 rounded-xl border border-primary/20 bg-white px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary/5"
                            >
                                <Mail size={13} />
                                Email
                            </a>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-primary/60">{icon}</span>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral/40">{label}</p>
            <div className="mt-0.5 text-sm font-semibold text-neutral">
                {typeof value === "string" ? <p className="break-words">{value}</p> : value}
            </div>
        </div>
    </div>
);

export default MyMess;

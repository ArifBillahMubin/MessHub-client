import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Users, Mail, Phone, Calendar, Shield, X, Check } from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useCurrentUser from "../../../hooks/useCurrentUser";
import Loading from "../../../components/Loading/Loading";

// ─── Member detail modal ──────────────────────────────────────────────────────

const MemberModal = ({ member, onClose, isCurrentUser }) => {
    if (!member) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral/40 backdrop-blur-[2px]" onClick={onClose} />
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl text-neutral/40 transition hover:bg-background hover:text-neutral"
                    aria-label="Close"
                >
                    <X size={17} />
                </button>

                {/* Avatar */}
                <div className="mb-4 flex flex-col items-center gap-2 text-center">
                    {member.photoURL ? (
                        <img
                            src={member.photoURL}
                            alt={member.name}
                            referrerPolicy="no-referrer"
                            className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
                        />
                    ) : (
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                            {member.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                    )}
                    <div>
                        <div className="flex items-center justify-center gap-2">
                            <p className="text-base font-extrabold text-neutral">{member.name || "—"}</p>
                            {isCurrentUser && (
                                <span className="flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-bold text-secondary">
                                    <Check size={10} />
                                    You
                                </span>
                            )}
                        </div>
                        <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            member.role === "manager" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                        }`}>
                            {member.role === "manager" ? "Manager" : "Member"}
                        </span>
                    </div>
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-4">
                    <DetailRow icon={<Mail size={14} />} label="Email" value={member.email || "—"} />
                    <DetailRow icon={<Phone size={14} />} label="Phone" value={member.phone || "—"} />
                    <DetailRow
                        icon={<Calendar size={14} />}
                        label="Joined"
                        value={member.joinedAt
                            ? new Date(member.joinedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
                            : "—"}
                    />
                    <DetailRow icon={<Shield size={14} />} label="Status" value="Active" valueClass="text-secondary font-semibold" />
                </div>
            </div>
        </div>
    );
};

const DetailRow = ({ icon, label, value, valueClass = "text-neutral" }) => (
    <div className="flex items-start gap-3">
        <span className="mt-0.5 flex-shrink-0 text-neutral/40">{icon}</span>
        <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">{label}</p>
            <p className={`mt-0.5 truncate text-sm ${valueClass}`}>{value}</p>
        </div>
    </div>
);

// ─── Role badge ───────────────────────────────────────────────────────────────

const RoleBadge = ({ role }) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
        role === "manager" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
    }`}>
        {role === "manager" ? "Manager" : "Member"}
    </span>
);

// ─── Members (Shared) ─────────────────────────────────────────────────────────

const Members = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { currentUser, isUserLoading } = useCurrentUser();

    const [messId, setMessId] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState(null);

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
            setMessId(messData._id);

            // Get all active members
            const membersRes = await axiosSecure.get(`/mess-members/${messData._id}?limit=100`);
            setMembers(membersRes.data.members || []);
        } catch (err) {
            toast.error("Failed to load members.", {
                style: { borderRadius: "12px", background: "#ffffff", color: "#173B3A", border: "1px solid #FF8A00", fontWeight: "600" },
                iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
            });
        } finally {
            setLoading(false);
        }
    }, [user?.email, axiosSecure]);

    useEffect(() => { loadData(); }, [loadData]);

    if (loading || isUserLoading) return <Loading />;

    if (!currentUser?.hasMess || !messId) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Users size={28} strokeWidth={1.8} />
                </span>
                <div>
                    <p className="text-sm font-bold text-neutral">No Active Mess</p>
                    <p className="mt-1 text-xs text-neutral/50">Join a mess to view members.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl font-extrabold text-neutral">Members</h1>
                <p className="mt-0.5 text-sm text-neutral/50">
                    Active members of your mess.
                </p>
            </div>

            {/* Members Grid/List */}
            <div className="rounded-2xl border border-primary/10 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <h2 className="flex items-center gap-2 text-sm font-extrabold text-neutral">
                        <Users size={16} className="text-primary" />
                        All Members ({members.length})
                    </h2>
                </div>

                {members.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-primary">
                            <Users size={22} strokeWidth={1.8} />
                        </span>
                        <div>
                            <p className="text-sm font-bold text-neutral">No Members Found</p>
                            <p className="mt-0.5 text-xs text-neutral/50">
                                No active members in this mess yet.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Desktop: Table view */}
                        <div className="hidden sm:block">
                            <table className="w-full">
                                <thead className="border-b border-gray-100 bg-background/30">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                            Member
                                        </th>
                                        <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                            Joined
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {members.map((member) => {
                                        const isMe = member.email === user.email;
                                        return (
                                            <tr
                                                key={member._id}
                                                onClick={() => setSelectedMember(member)}
                                                className="cursor-pointer transition hover:bg-background/50"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar member={member} />
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-bold text-neutral">{member.name || "—"}</p>
                                                            {isMe && (
                                                                <span className="flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-bold text-secondary">
                                                                    <Check size={10} />
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-xs text-neutral/70">{member.email}</p>
                                                    {member.phone && <p className="text-[11px] text-neutral/40">{member.phone}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <RoleBadge role={member.role} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-xs text-neutral/50">
                                                        {member.joinedAt
                                                            ? new Date(member.joinedAt).toLocaleDateString("en-GB", {
                                                                  day: "numeric",
                                                                  month: "short",
                                                                  year: "numeric"
                                                              })
                                                            : "—"}
                                                    </p>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile: Card view */}
                        <div className="divide-y divide-gray-50 sm:hidden">
                            {members.map((member) => {
                                const isMe = member.email === user.email;
                                return (
                                    <div
                                        key={member._id}
                                        onClick={() => setSelectedMember(member)}
                                        className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 transition hover:bg-background/50"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <Avatar member={member} />
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate text-sm font-bold text-neutral">{member.name || "—"}</p>
                                                    {isMe && (
                                                        <span className="flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-bold text-secondary">
                                                            <Check size={10} />
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="truncate text-xs text-neutral/60">{member.email}</p>
                                            </div>
                                        </div>
                                        <RoleBadge role={member.role} />
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Member detail modal */}
            {selectedMember && (
                <MemberModal
                    member={selectedMember}
                    onClose={() => setSelectedMember(null)}
                    isCurrentUser={selectedMember.email === user.email}
                />
            )}
        </div>
    );
};

// Avatar component
const Avatar = ({ member }) => (
    member.photoURL ? (
        <img
            src={member.photoURL}
            alt={member.name}
            referrerPolicy="no-referrer"
            className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
        />
    ) : (
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {member.name?.charAt(0).toUpperCase() || "?"}
        </span>
    )
);

export default Members;

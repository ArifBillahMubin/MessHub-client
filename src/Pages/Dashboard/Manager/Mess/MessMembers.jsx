import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { Search, Users, X, ChevronLeft, ChevronRight, Mail, Phone, Calendar, Shield, RefreshCw } from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import useCurrentUser from "../../../../hooks/useCurrentUser";
import Loading from "../../../../components/Loading/Loading";

// ─── Member detail modal ──────────────────────────────────────────────────────

const MemberModal = ({ member, onClose, onManagerChange, currentUserId, messId }) => {
    if (!member) return null;

    const isCurrentUser = member.userId === currentUserId;
    const canChangeManager = member.role === 'member' && !isCurrentUser;

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
                        <p className="text-base font-extrabold text-neutral">{member.name || "—"}</p>
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${member.role === "manager" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
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

                {canChangeManager && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <button
                            onClick={() => onManagerChange(member)}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-tertiary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-tertiary/90"
                        >
                            <RefreshCw size={16} />
                            Change Manager to {member.name}
                        </button>
                    </div>
                )}
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

// ─── Summary card ─────────────────────────────────────────────────────────────

const SummaryCard = ({ value, label, sub }) => (
    <div className="rounded-xl border border-primary/10 bg-white px-4 py-3.5 shadow-sm">
        <p className="text-xl font-extrabold text-neutral">{value}</p>
        <p className="mt-0.5 text-xs font-bold text-neutral/70">{label}</p>
        {sub && <p className="mt-0.5 text-[10px] text-neutral/40">{sub}</p>}
    </div>
);

// ─── MessMembers ──────────────────────────────────────────────────────────────

const MessMembers = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { currentUser } = useCurrentUser();

    // Mess context — loaded once
    const [messId, setMessId] = useState(null);
    const [summary, setSummary] = useState(null);
    const [messLoading, setMessLoading] = useState(true);

    // List state
    const [members, setMembers] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [listLoading, setListLoading] = useState(false);
    const [listError, setListError] = useState(false);

    // Controls
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    // Modal
    const [selectedMember, setSelectedMember] = useState(null);

    // Debounce search — 350ms
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const debounceRef = useRef(null);
    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(val);
            setPage(1);
        }, 350);
    };

    // Manager change handler
    const handleManagerChange = async (member) => {
        const result = await Swal.fire({
            title: `Change Manager to ${member.name}?`,
            html: `
                <p style="margin-bottom: 8px;">This will transfer the manager role to <strong>${member.name}</strong>.</p>
                <p style="color: #6B7280; font-size: 14px;">You will become a regular member, but remain active in the mess.</p>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Change Manager',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#FF8A00',
            cancelButtonColor: '#6B7280',
        });

        if (!result.isConfirmed) return;

        Swal.fire({
            title: 'Changing Manager...',
            text: 'Please wait',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            await axiosSecure.post(`/change-manager/${messId}`, {
                email: user.email,
                newManagerUserId: member.userId
            });

            Swal.fire({
                title: 'Manager Changed!',
                text: `${member.name} is now the manager of this mess.`,
                icon: 'success',
                confirmButtonColor: '#006B68',
            });

            // Close modal and refresh list
            setSelectedMember(null);
            fetchMembers();

            // Redirect to member dashboard after short delay
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        } catch (error) {
            console.error('Failed to change manager:', error);
            Swal.fire({
                title: 'Failed to Change Manager',
                text: error.response?.data?.message || 'An error occurred',
                icon: 'error',
                confirmButtonColor: '#006B68',
            });
        }
    };

    // Load the manager's mess once
    useEffect(() => {
        if (!user?.email) return;
        axiosSecure
            .get(`/users/my-mess?email=${user.email}`)
            .then(res => {
                if (res.data?.mess?._id) setMessId(res.data.mess._id);
            })
            .catch(() => {
                toast.error("Could not load mess info.", {
                    style: { borderRadius: "12px", background: "#ffffff", color: "#173B3A", border: "1px solid #FF8A00", fontWeight: "600" },
                    iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
                });
            })
            .finally(() => setMessLoading(false));
    }, [user?.email, axiosSecure]);

    // Fetch members whenever messId or filters change
    const fetchMembers = useCallback(async () => {
        if (!messId) return;
        setListLoading(true);
        setListError(false);
        try {
            const params = new URLSearchParams({ page, limit });
            if (debouncedSearch) params.set("search", debouncedSearch);
            if (roleFilter)      params.set("role",   roleFilter);

            const res = await axiosSecure.get(`/mess-members/${messId}?${params}`);
            setMembers(res.data.members);
            setTotal(res.data.total);
            setTotalPages(res.data.totalPages);
            setSummary(res.data.summary);
        } catch {
            setListError(true);
        } finally {
            setListLoading(false);
        }
    }, [messId, debouncedSearch, roleFilter, page, limit, axiosSecure]);

    useEffect(() => { fetchMembers(); }, [fetchMembers]);

    if (messLoading) return <Loading />;

    return (
        <div className="mx-auto max-w-5xl">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-extrabold text-neutral">Members</h1>
                <p className="mt-0.5 text-sm text-neutral/50">
                    {summary?.messName ? `Active members of ${summary.messName}.` : "Manage your mess members."}
                </p>
            </div>

            {/* Summary row */}
            {summary && (
                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <SummaryCard value={summary.totalMembers}  label="Total Members"   sub="Active members" />
                    <SummaryCard value={summary.maxMembers}    label="Maximum Members" sub="Member limit" />
                    <SummaryCard value={summary.availableSeats} label="Available Seats" sub={summary.availableSeats > 0 ? "Seats open" : "Mess is full"} />
                    <SummaryCard value={summary.messName}      label="Mess Name"       />
                </div>
            )}

            {/* Controls */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Search */}
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                    <Search size={15} className="shrink-0 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search by name, email or phone…"
                        className="w-full bg-transparent py-2.5 text-sm text-neutral outline-none placeholder:text-gray-400"
                    />
                    {search && (
                        <button type="button" onClick={() => { setSearch(""); setDebouncedSearch(""); setPage(1); }}>
                            <X size={14} className="text-gray-400 hover:text-neutral" />
                        </button>
                    )}
                </div>

                {/* Role filter */}
                <div className="flex gap-1.5">
                    {[["", "All"], ["manager", "Manager"], ["member", "Member"]].map(([val, label]) => (
                        <button
                            key={val}
                            type="button"
                            onClick={() => { setRoleFilter(val); setPage(1); }}
                            className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                                roleFilter === val
                                    ? "bg-primary text-white"
                                    : "border border-gray-200 bg-white text-neutral/70 hover:border-primary/30 hover:text-primary"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Members list */}
            <div className="rounded-2xl border border-primary/10 bg-white shadow-sm">

                {/* Table head — desktop only */}
                <div className="hidden border-b border-gray-100 px-5 py-3 sm:grid sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center sm:gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">Name</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">Contact</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">Role</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">Joined</span>
                </div>

                {/* Loading overlay */}
                {listLoading && (
                    <div className="flex items-center justify-center py-16">
                        <div className="flex items-center gap-2 text-sm font-medium text-neutral/40">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            Loading members…
                        </div>
                    </div>
                )}

                {/* Error */}
                {!listLoading && listError && (
                    <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <p className="text-sm font-semibold text-neutral/60">Unable to load members.</p>
                        <button
                            type="button"
                            onClick={fetchMembers}
                            className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary/90"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!listLoading && !listError && members.length === 0 && (
                    <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-primary">
                            <Users size={22} strokeWidth={1.8} />
                        </span>
                        <div>
                            <p className="text-sm font-bold text-neutral">No members found</p>
                            <p className="mt-0.5 text-xs text-neutral/50">
                                {debouncedSearch || roleFilter ? "Try changing your search or filter." : "No active members yet."}
                            </p>
                        </div>
                    </div>
                )}

                {/* Rows */}
                {!listLoading && !listError && members.length > 0 && (
                    <ul className="divide-y divide-gray-100">
                        {members.map((m) => (
                            <li key={m._id}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedMember(m)}
                                    className="w-full px-5 py-4 text-left transition hover:bg-background/50"
                                >
                                    {/* Mobile layout */}
                                    <div className="flex items-center gap-3 sm:hidden">
                                        <Avatar member={m} />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="truncate text-sm font-bold text-neutral">{m.name || "—"}</p>
                                                <RoleBadge role={m.role} />
                                            </div>
                                            <p className="truncate text-[11px] text-neutral/50">{m.email}</p>
                                            {m.phone && <p className="text-[11px] text-neutral/40">{m.phone}</p>}
                                        </div>
                                    </div>

                                    {/* Desktop layout */}
                                    <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center sm:gap-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <Avatar member={m} />
                                            <p className="truncate text-sm font-bold text-neutral">{m.name || "—"}</p>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-xs text-neutral/70">{m.email}</p>
                                            {m.phone && <p className="truncate text-[11px] text-neutral/40">{m.phone}</p>}
                                        </div>
                                        <RoleBadge role={m.role} />
                                        <p className="whitespace-nowrap text-xs text-neutral/50">
                                            {m.joinedAt
                                                ? new Date(m.joinedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                                                : "—"}
                                        </p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-neutral/50">
                        Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total}
                    </p>
                    <div className="flex gap-1.5">
                        <button
                            type="button"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-neutral/60 transition hover:border-primary/30 hover:text-primary disabled:opacity-40"
                        >
                            <ChevronLeft size={15} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPage(p)}
                                className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-bold transition ${
                                    p === page
                                        ? "bg-primary text-white"
                                        : "border border-gray-200 text-neutral/60 hover:border-primary/30 hover:text-primary"
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-neutral/60 transition hover:border-primary/30 hover:text-primary disabled:opacity-40"
                        >
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            )}

            {/* Member detail modal */}
            {selectedMember && (
                <MemberModal 
                    member={selectedMember} 
                    onClose={() => setSelectedMember(null)}
                    onManagerChange={handleManagerChange}
                    currentUserId={currentUser?._id}
                    messId={messId}
                />
            )}
        </div>
    );
};

// Small avatar component used in the list
const Avatar = ({ member }) => (
    member.photoURL ? (
        <img
            src={member.photoURL}
            alt={member.name}
            referrerPolicy="no-referrer"
            className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
        />
    ) : (
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {member.name?.charAt(0).toUpperCase() || "?"}
        </span>
    )
);

export default MessMembers;

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import {
    PenLine, X, Loader2, Building2, MapPin,
    Users, FileText, Check, KeyRound, Copy, RefreshCw,
} from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import Loading from "../../../../components/Loading/Loading";
import LeafletMap from "../../../../components/LeafletMap/LeafletMap";

// ─── MessSettings — Basic Information ────────────────────────────────────────

const MessSettings = () => {
    const axiosSecure = useAxiosSecure();
    const { user }    = useAuth();

    const [mess, setMess]           = useState(null);
    const [activeMembers, setActiveMembers] = useState(0);
    const [loading, setLoading]     = useState(true);
    const [editing, setEditing]     = useState(false);
    const [saving, setSaving]       = useState(false);
    const [copied, setCopied]       = useState(false);
    const [regenerating, setRegenerating] = useState(false);

    // Location state lives outside RHF (fed from LeafletMap)
    const [location, setLocation] = useState({
        address: "", area: "", city: "", cityCorporation: "",
        latitude: null, longitude: null,
    });
    const [locationError, setLocationError] = useState("");

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // ── Fetch mess + active member count ─────────────────────────────────────
    const fetchData = useCallback(async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            const messRes = await axiosSecure.get(`/users/my-mess?email=${user.email}`);
            const messData = messRes.data.mess;
            if (!messData) { setLoading(false); return; }
            setMess(messData);

            // Get active member count for maxMembers validation
            const membersRes = await axiosSecure.get(`/mess-members/${messData._id}?limit=1`);
            setActiveMembers(membersRes.data.summary?.totalMembers ?? 0);
        } catch {
            toast.error("Failed to load mess settings.", {
                style: { borderRadius: "12px", background: "#ffffff", color: "#173B3A", border: "1px solid #FF8A00", fontWeight: "600" },
                iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
            });
        } finally {
            setLoading(false);
        }
    }, [user, axiosSecure]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Populate form + location state when entering edit mode
    const enterEdit = () => {
        if (!mess) return;
        reset({
            name:        mess.name        || "",
            description: mess.description || "",
            maxMembers:  mess.maxMembers  || "",
            address:     mess.location?.address || "",
        });
        setLocation({
            address:        mess.location?.address        || "",
            area:           mess.location?.area           || "",
            city:           mess.location?.city           || "",
            cityCorporation: mess.location?.cityCorporation || "",
            latitude:       mess.location?.latitude  ?? null,
            longitude:      mess.location?.longitude ?? null,
        });
        setLocationError("");
        setEditing(true);
    };

    const cancelEdit = () => {
        setEditing(false);
        setLocationError("");
    };

    // Called by LeafletMap whenever the pin moves
    const handleLocationSelect = useCallback(({ lat, lng, address }) => {
        setLocation(prev => ({ ...prev, latitude: lat, longitude: lng, address }));
        setLocationError("");
    }, []);

    // Submit update
    const onSubmit = async (data) => {
        if (location.latitude === null || location.longitude === null) {
            setLocationError("Please select a location on the map.");
            return;
        }
        if (!location.address?.trim()) {
            setLocationError("Please confirm or enter an address.");
            return;
        }

        setSaving(true);
        try {
            const res = await axiosSecure.patch(`/messes/${mess._id}`, {
                email:       user.email,
                name:        data.name,
                description: data.description,
                maxMembers:  data.maxMembers,
                location: {
                    address:        data.address || location.address,
                    area:           location.area,
                    city:           location.city,
                    cityCorporation: location.cityCorporation,
                    latitude:       location.latitude,
                    longitude:      location.longitude,
                },
            });

            setMess(res.data.mess);
            setEditing(false);
            toast.success("Mess updated successfully.", {
                duration: 3000,
                style: { borderRadius: "12px", background: "#D5FBF9", color: "#173B3A", border: "1px solid #006B68", fontWeight: "600" },
                iconTheme: { primary: "#006B68", secondary: "#ffffff" },
            });
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to update mess. Please try again.";
            toast.error(msg, {
                duration: 4000,
                style: { borderRadius: "12px", background: "#ffffff", color: "#173B3A", border: "1px solid #FF8A00", fontWeight: "600" },
                iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
            });
        } finally {
            setSaving(false);
        }
    };

    // Copy mess code to clipboard
    const handleCopy = () => {
        if (!mess?.messCode) return;
        navigator.clipboard.writeText(mess.messCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // Regenerate mess code with SweetAlert2 confirmation
    const handleRegenerate = async () => {
        const confirmed = await Swal.fire({
            title: "Regenerate Mess Code?",
            text: "The old code will stop working for new join requests. Existing members are not affected.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Regenerate",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#FF8A00",
            cancelButtonColor: "#6b7280",
        });
        if (!confirmed.isConfirmed) return;

        setRegenerating(true);
        try {
            const res = await axiosSecure.patch(`/messes/${mess._id}/regenerate-code`, {
                email: user.email,
            });
            setMess(prev => ({ ...prev, messCode: res.data.messCode }));
            toast.success("Mess Code updated. Share the new code with new members.", {
                duration: 4000,
                style: { borderRadius: "12px", background: "#D5FBF9", color: "#173B3A", border: "1px solid #006B68", fontWeight: "600" },
                iconTheme: { primary: "#006B68", secondary: "#ffffff" },
            });
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to regenerate code. Please try again.";
            toast.error(msg, {
                duration: 4000,
                style: { borderRadius: "12px", background: "#ffffff", color: "#173B3A", border: "1px solid #FF8A00", fontWeight: "600" },
                iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
            });
        } finally {
            setRegenerating(false);
        }
    };

    if (loading) return <Loading />;

    if (!mess) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <Building2 size={32} className="text-primary/30" strokeWidth={1.5} />
                <p className="text-sm font-semibold text-neutral/60">No mess found.</p>
            </div>
        );
    }

    const locationStr = [mess.location?.address, mess.location?.area, mess.location?.city]
        .filter(Boolean).join(", ");

    const inputCls = "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-neutral outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10";

    return (
        <div className="mx-auto max-w-3xl">

            {/* Page header */}
            <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {mess.name}
                </span>
                <h1 className="mt-1.5 text-2xl font-extrabold text-neutral">Mess Settings</h1>
                <p className="mt-1 text-sm font-medium text-neutral/50">
                    Manage your mess configuration.
                </p>
            </div>

            {/* ── Basic Information card ────────────────────────────────── */}
            <div className="rounded-2xl border border-primary/10 bg-white shadow-sm">

                {/* Card header */}
                <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-primary">
                            <Building2 size={16} strokeWidth={2.2} />
                        </span>
                        <h2 className="text-sm font-extrabold text-neutral">Basic Information</h2>
                    </div>
                    {!editing && (
                        <button
                            type="button"
                            onClick={enterEdit}
                            className="flex items-center gap-1.5 rounded-xl border border-primary/20 px-3 py-2 text-xs font-bold text-primary transition hover:bg-background"
                        >
                            <PenLine size={13} />
                            Edit
                        </button>
                    )}
                </div>

                {/* ── VIEW mode ──────────────────────────────────────────── */}
                {!editing && (
                    <div className="divide-y divide-gray-100 px-6">
                        <ViewRow icon={<Building2 size={14} />} label="Mess Name" value={mess.name} />
                        <ViewRow icon={<FileText size={14} />} label="Description" value={mess.description || <span className="italic text-neutral/30">No description</span>} />
                        <ViewRow icon={<MapPin size={14} />} label="Location" value={locationStr || <span className="italic text-neutral/30">Not set</span>} />
                        <ViewRow
                            icon={<Users size={14} />}
                            label="Maximum Members"
                            value={
                                <span>
                                    {mess.maxMembers}
                                    <span className="ml-2 text-xs text-neutral/40">({activeMembers} active)</span>
                                </span>
                            }
                        />
                    </div>
                )}

                {/* ── EDIT mode ──────────────────────────────────────────── */}
                {editing && (
                    <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5" noValidate>

                        {/* Mess Name */}
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                                Mess Name <span className="text-tertiary">*</span>
                            </label>
                            <input
                                {...register("name", {
                                    required: "Mess name is required.",
                                    minLength: { value: 3, message: "At least 3 characters." },
                                    maxLength: { value: 60, message: "Maximum 60 characters." },
                                })}
                                type="text"
                                className={inputCls}
                            />
                            {errors.name && <p className="mt-1 text-[10px] font-medium text-red-500">{errors.name.message}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                                Description
                                <span className="ml-1 font-medium normal-case tracking-normal text-gray-400">(Optional)</span>
                            </label>
                            <textarea
                                {...register("description", {
                                    maxLength: { value: 300, message: "Maximum 300 characters." },
                                })}
                                rows={3}
                                className={`${inputCls} resize-none`}
                            />
                            {errors.description && <p className="mt-1 text-[10px] font-medium text-red-500">{errors.description.message}</p>}
                        </div>

                        {/* Maximum Members */}
                        <div className="max-w-[200px]">
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                                Maximum Members <span className="text-tertiary">*</span>
                            </label>
                            <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                                <Users size={15} className="shrink-0 text-gray-400" />
                                <input
                                    {...register("maxMembers", {
                                        required: "Required.",
                                        min: { value: activeMembers || 1, message: `Cannot be less than current active members (${activeMembers}).` },
                                        max: { value: 50, message: "Maximum 50 members." },
                                        valueAsNumber: true,
                                    })}
                                    type="number"
                                    min={activeMembers || 1}
                                    max={50}
                                    className="w-full bg-transparent px-3 py-2.5 text-sm text-neutral outline-none"
                                />
                            </div>
                            {errors.maxMembers && <p className="mt-1 text-[10px] font-medium text-red-500">{errors.maxMembers.message}</p>}
                            <p className="mt-1 text-[10px] text-gray-400">Currently {activeMembers} active member{activeMembers !== 1 ? "s" : ""}</p>
                        </div>

                        {/* Location — reuse LeafletMap */}
                        <div>
                            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                                Location <span className="text-tertiary">*</span>
                            </label>
                            <LeafletMap onLocationSelect={handleLocationSelect} />
                            {locationError && (
                                <p className="mt-1.5 text-[10px] font-medium text-red-500">{locationError}</p>
                            )}

                            {/* Address — controlled by local state, editable */}
                            <div className="mt-3">
                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                                    Address <span className="text-tertiary">*</span>
                                </label>
                                <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                                    <MapPin size={15} className="shrink-0 text-primary/60" />
                                    <input
                                        type="text"
                                        value={location.address}
                                        onChange={e => setLocation(prev => ({ ...prev, address: e.target.value }))}
                                        placeholder="e.g. House 12, Road 5, Mirpur-10, Dhaka"
                                        className="w-full bg-transparent px-3 py-2.5 text-sm text-neutral outline-none placeholder:text-gray-400"
                                    />
                                </div>
                                <p className="mt-1 text-[10px] text-gray-400">Auto-filled from map. You can edit to be more specific.</p>
                            </div>

                            {/* Coordinates display */}
                            {location.latitude !== null && (
                                <div className="mt-2 flex gap-5">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">Latitude</p>
                                        <p className="mt-0.5 text-xs font-semibold text-neutral">{location.latitude.toFixed(6)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">Longitude</p>
                                        <p className="mt-0.5 text-xs font-semibold text-neutral">{location.longitude.toFixed(6)}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={cancelEdit}
                                disabled={saving}
                                className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-neutral transition hover:bg-gray-50 disabled:opacity-60"
                            >
                                <X size={14} />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                {saving ? "Saving…" : "Update Mess"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* ── Mess Code card ────────────────────────────────────────── */}
            <div className="mt-5 rounded-2xl border border-primary/10 bg-white shadow-sm">

                {/* Card header */}
                <div className="flex items-center gap-2.5 border-b border-gray-100 px-6 py-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-primary">
                        <KeyRound size={16} strokeWidth={2.2} />
                    </span>
                    <div>
                        <h2 className="text-sm font-extrabold text-neutral">Mess Code</h2>
                        <p className="text-[11px] text-neutral/50">Share this code with people you want to invite.</p>
                    </div>
                </div>

                <div className="px-6 py-5">
                    {/* Code display */}
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-3xl font-extrabold tracking-widest text-primary">
                            {mess.messCode}
                        </span>
                        <button
                            type="button"
                            onClick={handleCopy}
                            title="Copy code"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-background text-primary transition hover:bg-primary hover:text-white"
                        >
                            {copied ? <Check size={15} /> : <Copy size={15} />}
                        </button>
                    </div>

                    <p className="mt-2 text-xs text-neutral/50">
                        Members use this code on the Join Mess page to request membership.
                    </p>

                    {/* Regenerate */}
                    <div className="mt-5 rounded-xl border border-tertiary/20 bg-tertiary/5 p-4">
                        <p className="mb-1 text-xs font-bold text-neutral">Regenerate Code</p>
                        <p className="mb-3 text-[11px] text-neutral/55">
                            Generating a new code will invalidate the old one for new join requests.
                            Existing members and pending requests are not affected.
                        </p>
                        <button
                            type="button"
                            onClick={handleRegenerate}
                            disabled={regenerating}
                            className="flex items-center gap-2 rounded-xl border border-tertiary/30 bg-white px-4 py-2 text-xs font-bold text-tertiary transition hover:bg-tertiary/10 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {regenerating
                                ? <Loader2 size={13} className="animate-spin" />
                                : <RefreshCw size={13} />
                            }
                            {regenerating ? "Regenerating…" : "Regenerate Code"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Simple read-only row ─────────────────────────────────────────────────────

const ViewRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 py-3.5">
        <span className="mt-0.5 shrink-0 text-primary/50">{icon}</span>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral/40">{label}</p>
            <p className="mt-0.5 text-sm font-semibold text-neutral">{value}</p>
        </div>
    </div>
);

export default MessSettings;

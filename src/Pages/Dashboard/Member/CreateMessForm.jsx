import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
    ArrowLeft, Building2, MapPin, Users, FileText,
    Loader2, CheckCircle2, Copy, Check, ArrowRight,
} from "lucide-react";
import LeafletMap from "../../../components/LeafletMap/LeafletMap";
import useCreateMess from "../../../hooks/useCreateMess";
import useCurrentUser from "../../../hooks/useCurrentUser";
import useMessRole from "../../../hooks/useMessRole";

// ── Success screen shown after mess is created ───────────────────────────────
const SuccessScreen = ({ messCode, messName, onContinue }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(messCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-10 text-center">
            {/* Icon */}
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <CheckCircle2 size={40} strokeWidth={1.6} />
            </span>

            {/* Heading */}
            <h1 className="mt-6 text-2xl font-extrabold text-neutral sm:text-3xl">
                Mess Created!
            </h1>
            <p className="mt-2 max-w-sm text-sm font-medium text-neutral/50">
                <span className="font-bold text-primary">{messName}</span> is ready. Share the code below with people you want to invite.
            </p>

            {/* Mess code card */}
            <div className="mt-8 w-full max-w-xs rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral/40">
                    Your Mess Code
                </p>
                <div className="flex items-center justify-center gap-3">
                    <span className="font-mono text-3xl font-extrabold tracking-widest text-primary">
                        {messCode}
                    </span>
                    <button
                        type="button"
                        onClick={handleCopy}
                        title="Copy code"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/10 bg-background text-primary transition-all hover:bg-primary hover:text-white"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>
                <p className="mt-3 text-[11px] text-neutral/40">
                    Keep this code safe. Members will use it to join your mess.
                </p>
            </div>

            {/* Continue button */}
            <button
                type="button"
                onClick={onContinue}
                className="mt-8 flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
                Go to Dashboard
                <ArrowRight size={16} />
            </button>
        </div>
    );
};

// ── CreateMessForm ────────────────────────────────────────────────────────────
const CreateMessForm = () => {
    const navigate = useNavigate();
    const { refetchUser } = useCurrentUser();
    const [, , refetchMessRole] = useMessRole();

    // Location state managed outside RHF because it comes from the map component
    const [location, setLocation] = useState({
        address: "", area: "", city: "", cityCorporation: "",
        latitude: null, longitude: null,
    });
    const [locationError, setLocationError] = useState("");

    // Mutation
    const {
        mutate: createMess,
        isPending,
        isSuccess,
        data: successData,
    } = useCreateMess();

    // RHF
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: { name: "", description: "", maxMembers: 8 },
    });

    // Called by LeafletMap whenever the pin moves
    const handleLocationSelect = useCallback(({ lat, lng, address }) => {
        setLocation(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            address,
        }));
        setLocationError("");
    }, []);

    // Form submit
    const onSubmit = (data) => {
        // Validate location separately since it lives outside RHF
        if (location.latitude === null || location.longitude === null) {
            setLocationError("Please select a location on the map.");
            return;
        }
        if (!location.address?.trim()) {
            setLocationError("Please enter or confirm an address.");
            return;
        }

        createMess(
            {
                name: data.name,
                description: data.description,
                location: {
                    ...location,
                },
                maxMembers: data.maxMembers,
            },
            {
                onSuccess: () => {
                    toast.success("Mess created successfully! 🎉", {
                        duration: 3000,
                        style: {
                            borderRadius: "12px",
                            background: "#D5FBF9",
                            color: "#173B3A",
                            border: "1px solid #006B68",
                            fontWeight: "600",
                        },
                        iconTheme: { primary: "#006B68", secondary: "#ffffff" },
                    });
                    // Refresh hasMess flag and mess-level role so DashboardLayout
                    // and DashboardOverview switch to the manager state immediately
                    refetchUser();
                    refetchMessRole();
                },
                onError: (err) => {
                    const msg =
                        err?.response?.data?.message ||
                        err?.message ||
                        "Failed to create mess. Please try again.";
                    toast.error(msg, {
                        duration: 4000,
                        style: {
                            borderRadius: "12px",
                            background: "#ffffff",
                            color: "#173B3A",
                            border: "1px solid #FF8A00",
                            fontWeight: "600",
                        },
                        iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
                    });
                },
            }
        );
    };

    // After success, show the success screen
    if (isSuccess && successData) {
        return (
            <SuccessScreen
                messCode={successData.messCode}
                messName={successData.name}
                onContinue={() => navigate("/dashboard", { replace: true })}
            />
        );
    }

    // ── Form UI ────────────────────────────────────────────────────────────
    return (
        <div className="mx-auto max-w-3xl">

            {/* Page header */}
            <div className="mb-6 flex items-start gap-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-white text-primary transition hover:bg-primary hover:text-white"
                    aria-label="Go back"
                >
                    <ArrowLeft size={17} />
                </button>
                <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                        New Mess
                    </span>
                    <h1 className="mt-1.5 text-2xl font-extrabold text-neutral">Create Your Mess</h1>
                    <p className="mt-1 text-sm font-medium text-neutral/50">
                        Set up your mess and start managing members, meals, and expenses.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

                {/* ── Section: Basic Info ─────────────────────────────────── */}
                <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-primary">
                            <Building2 size={16} strokeWidth={2.2} />
                        </span>
                        <h2 className="text-sm font-extrabold text-neutral">Basic Information</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Mess Name */}
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                                Mess Name <span className="text-tertiary">*</span>
                            </label>
                            <input
                                {...register("name", {
                                    required: "Mess name is required.",
                                    minLength: { value: 3, message: "Name must be at least 3 characters." },
                                    maxLength: { value: 60, message: "Name must be 60 characters or less." },
                                })}
                                type="text"
                                placeholder="e.g. Green View Mess"
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-neutral outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                            {errors.name && (
                                <p className="mt-1 text-[10px] font-medium text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                                Description
                                <span className="ml-1 font-medium normal-case tracking-normal text-gray-400">(Optional)</span>
                            </label>
                            <textarea
                                {...register("description", {
                                    maxLength: { value: 300, message: "Description must be 300 characters or less." },
                                })}
                                rows={3}
                                placeholder="Tell future members about this mess…"
                                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-neutral outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                            {errors.description && (
                                <p className="mt-1 text-[10px] font-medium text-red-500">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Max Members */}
                        <div className="max-w-[200px]">
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                                Maximum Members <span className="text-tertiary">*</span>
                            </label>
                            <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                                <Users size={15} className="shrink-0 text-gray-400" />
                                <input
                                    {...register("maxMembers", {
                                        required: "Maximum members is required.",
                                        min: { value: 2, message: "Minimum 2 members." },
                                        max: { value: 50, message: "Maximum 50 members allowed." },
                                        valueAsNumber: true,
                                    })}
                                    type="number"
                                    min={2}
                                    max={50}
                                    className="w-full bg-transparent px-3 py-2.5 text-sm text-neutral outline-none"
                                />
                            </div>
                            {errors.maxMembers && (
                                <p className="mt-1 text-[10px] font-medium text-red-500">{errors.maxMembers.message}</p>
                            )}
                            <p className="mt-1 text-[10px] text-gray-400">1–8 members = Free plan</p>
                        </div>
                    </div>
                </div>

                {/* ── Section: Location ──────────────────────────────────── */}
                <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-primary">
                            <MapPin size={16} strokeWidth={2.2} />
                        </span>
                        <div>
                            <h2 className="text-sm font-extrabold text-neutral">Location</h2>
                            <p className="text-[11px] text-neutral/40">Search, click the map, or use your current location.</p>
                        </div>
                    </div>

                    {/* Leaflet map */}
                    <LeafletMap onLocationSelect={handleLocationSelect} />

                    {/* Location error */}
                    {locationError && (
                        <p className="mt-2 text-[10px] font-medium text-red-500">{locationError}</p>
                    )}

                    {/* Address field — pre-filled from reverse geocode, user can edit */}
                    <div className="mt-4">
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                            Address <span className="text-tertiary">*</span>
                        </label>
                        <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                            <MapPin size={15} className="shrink-0 text-primary/60" />
                            <input
                                type="text"
                                value={location.address}
                                onChange={(e) =>
                                    setLocation(prev => ({ ...prev, address: e.target.value }))
                                }
                                placeholder="e.g. House 12, Road 5, Mirpur-10, Dhaka"
                                className="w-full bg-transparent px-3 py-2.5 text-sm text-neutral outline-none placeholder:text-gray-400"
                            />
                        </div>
                        <p className="mt-1 text-[10px] text-gray-400">
                            Auto-filled from the map. You can edit this to be more specific.
                        </p>
                    </div>

                    {/* Coordinates display — read only */}
                    {location.latitude !== null && (
                        <div className="mt-3 flex gap-4">
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

                {/* ── Description section (file text icon) ───────────────── */}
                <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-primary">
                            <FileText size={16} strokeWidth={2.2} />
                        </span>
                        <h2 className="text-sm font-extrabold text-neutral">What happens next?</h2>
                    </div>
                    <ul className="space-y-2">
                        {[
                            "Your mess will be created with a unique 8-character Mess Code.",
                            "You become the Manager of the mess.",
                            "Share the Mess Code with members so they can join.",
                            "Manage meals, expenses, and payments from your dashboard.",
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs text-neutral/70">
                                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-[9px] font-bold text-secondary">
                                    {i + 1}
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Submit ─────────────────────────────────────────────── */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? (
                        <>
                            <Loader2 size={17} className="animate-spin" />
                            Creating Mess…
                        </>
                    ) : (
                        <>
                            <Building2 size={17} />
                            Create Mess
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateMessForm;

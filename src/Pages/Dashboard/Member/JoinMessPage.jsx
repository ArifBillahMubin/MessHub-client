import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import {
    Search, Loader2, KeyRound, MapPin, Users,
    ArrowLeft, X, CheckCircle2, Clock,
} from "lucide-react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useCurrentUser from "../../../hooks/useCurrentUser";
import useAuth from "../../../hooks/useAuth";

const JoinMessPage = () => {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { currentUser } = useCurrentUser();

    const [codeInput, setCodeInput] = useState("");
    const [searching, setSearching] = useState(false);
    const [messInfo, setMessInfo] = useState(null);
    const [searchError, setSearchError] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // Look up the mess by code
    const handleSearch = async () => {
        const code = codeInput.trim().toUpperCase();
        if (!code) return;

        setSearching(true);
        setSearchError("");
        setMessInfo(null);
        setRequestSent(false);

        try {
            const res = await axiosSecure.get(`/messes/find-by-code?code=${code}`);
            setMessInfo(res.data);
        } catch (err) {
            const msg = err?.response?.data?.message || "Mess not found. Check the code and try again.";
            setSearchError(msg);
        } finally {
            setSearching(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    // Open modal and pre-fill form from currentUser
    const openModal = () => {
        reset({
            name: currentUser?.name || user?.displayName || "",
            email: currentUser?.email || user?.email || "",
            phone: currentUser?.phone || "",
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        reset();
    };

    // Submit the join request after SweetAlert confirmation
    const onSubmit = async (data) => {
        const confirmed = await Swal.fire({
            title: "Send Join Request?",
            text: `Are you sure you want to request to join "${messInfo.name}"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, send it",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#006B68",
            cancelButtonColor: "#6b7280",
            borderRadius: "12px",
        });

        if (!confirmed.isConfirmed) return;

        setSubmitting(true);
        try {
            await axiosSecure.post("/join-requests", {
                email: user.email,
                messCode: messInfo.messCode,
                name: data.name,
                phone: data.phone,
            });

            closeModal();
            setRequestSent(true);
            toast.success("Join request sent! Waiting for manager approval.", {
                duration: 4000,
                style: {
                    borderRadius: "12px",
                    background: "#D5FBF9",
                    color: "#173B3A",
                    border: "1px solid #006B68",
                    fontWeight: "600",
                },
                iconTheme: { primary: "#006B68", secondary: "#ffffff" },
            });
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to send request. Please try again.";
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
        } finally {
            setSubmitting(false);
        }
    };

    const availableSeats = messInfo ? messInfo.maxMembers - messInfo.activeMembers : 0;

    return (
        <div className="mx-auto max-w-xl">

            {/* Header */}
            <div className="mb-6 flex items-start gap-4">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-white text-primary transition hover:bg-primary hover:text-white"
                    aria-label="Go back"
                >
                    <ArrowLeft size={17} />
                </button>
                <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                        Join a Mess
                    </span>
                    <h1 className="mt-1.5 text-2xl font-extrabold text-neutral">Enter Mess Code</h1>
                    <p className="mt-1 text-sm font-medium text-neutral/50">
                        Ask your mess manager for the code and enter it below.
                    </p>
                </div>
            </div>

            {/* Code search */}
            <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                    Mess Code
                </label>
                <div className="flex gap-2">
                    <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                        <KeyRound size={15} className="shrink-0 text-gray-400" />
                        <input
                            type="text"
                            value={codeInput}
                            onChange={(e) => {
                                setCodeInput(e.target.value.toUpperCase());
                                setSearchError("");
                                setMessInfo(null);
                                setRequestSent(false);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. MH7K2P"
                            maxLength={10}
                            className="w-full bg-transparent py-2.5 font-mono text-sm font-semibold text-neutral outline-none placeholder:font-sans placeholder:font-normal placeholder:text-gray-400"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSearch}
                        disabled={searching || !codeInput.trim()}
                        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {searching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                        Find
                    </button>
                </div>

                {searchError && (
                    <p className="mt-2 text-[11px] font-medium text-red-500">{searchError}</p>
                )}
            </div>

            {/* Mess result card */}
            {messInfo && (
                <div className="mt-4 rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-extrabold text-neutral">{messInfo.name}</h2>
                            <span className="font-mono text-xs font-semibold text-primary/60">{messInfo.messCode}</span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary">
                            Active
                        </span>
                    </div>

                    {messInfo.description && (
                        <p className="mb-4 text-sm text-neutral/60">{messInfo.description}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-xs">
                        {messInfo.location?.address && (
                            <div className="flex items-center gap-1.5 text-neutral/60">
                                <MapPin size={13} className="text-primary/50" />
                                {messInfo.location.address}
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 text-neutral/60">
                            <Users size={13} className="text-primary/50" />
                            {messInfo.activeMembers} / {messInfo.maxMembers} members
                            {availableSeats > 0
                                ? <span className="ml-1 text-secondary font-semibold">({availableSeats} seat{availableSeats !== 1 ? "s" : ""} available)</span>
                                : <span className="ml-1 font-semibold text-red-500">(Full)</span>
                            }
                        </div>
                    </div>

                    <div className="mt-5">
                        {requestSent ? (
                            <div className="flex items-center gap-2 rounded-xl bg-background px-4 py-3 text-sm font-semibold text-primary">
                                <Clock size={16} />
                                Request sent — waiting for manager approval.
                            </div>
                        ) : availableSeats <= 0 ? (
                            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
                                This mess is full and not accepting new members.
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={openModal}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-md"
                            >
                                <CheckCircle2 size={16} />
                                Request to Join
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Join request modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-neutral/40 backdrop-blur-[2px]"
                        onClick={closeModal}
                    />
                    <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

                        {/* Modal header */}
                        <div className="mb-5 flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-base font-extrabold text-neutral">Request to Join</h2>
                                <p className="mt-0.5 text-xs text-neutral/50">
                                    Joining <span className="font-semibold text-primary">{messInfo.name}</span>
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-neutral/50 transition hover:bg-background hover:text-neutral"
                            >
                                <X size={17} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            {/* Name */}
                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                                    Full Name <span className="text-tertiary">*</span>
                                </label>
                                <input
                                    {...register("name", { required: "Name is required." })}
                                    type="text"
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-neutral outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-[10px] font-medium text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Email — shown but not editable (identity) */}
                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                                    Email
                                </label>
                                <input
                                    {...register("email")}
                                    type="email"
                                    readOnly
                                    className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-neutral/60 outline-none"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                                    Phone Number <span className="text-tertiary">*</span>
                                </label>
                                <input
                                    {...register("phone", {
                                        required: "Phone number is required.",
                                        pattern: {
                                            value: /^01[3-9]\d{8}$/,
                                            message: "Enter a valid Bangladesh phone number.",
                                        },
                                    })}
                                    type="tel"
                                    placeholder="01XXXXXXXXX"
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-neutral outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-[10px] font-medium text-red-500">{errors.phone.message}</p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-neutral transition hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {submitting ? <Loader2 size={15} className="animate-spin" /> : null}
                                    Send Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JoinMessPage;

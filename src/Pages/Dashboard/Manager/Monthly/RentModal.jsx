import { useState } from "react";
import { X, Home, Loader2 } from "lucide-react";

const RentModal = ({ member, onClose, onSave }) => {
    const [amount, setAmount] = useState(member.rent !== null ? member.rent : "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (amount === "" || Number(amount) < 0) {
            alert("Please enter a valid amount (0 or greater).");
            return;
        }

        setLoading(true);
        try {
            await onSave({
                userId: member.userId.toString(),
                amount: Number(amount)
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral/40 backdrop-blur-[2px]" onClick={onClose} />

            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-tertiary/10 text-tertiary">
                            <Home size={15} strokeWidth={2} />
                        </span>
                        <div>
                            <p className="text-sm font-extrabold text-neutral">
                                {member.rent !== null ? "Edit Rent" : "Set Rent"}
                            </p>
                            <p className="text-[10px] text-neutral/50">
                                Set monthly rent for this member
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral/40 transition hover:bg-background hover:text-neutral disabled:opacity-50"
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Member Info */}
                    <div className="mb-6 rounded-xl border border-tertiary/10 bg-tertiary/5 p-4">
                        <div className="flex items-center gap-3">
                            {member.user?.photoURL ? (
                                <img
                                    src={member.user.photoURL}
                                    alt={member.user.name}
                                    referrerPolicy="no-referrer"
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            ) : (
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary/10 text-sm font-bold text-tertiary">
                                    {member.user?.name?.charAt(0).toUpperCase() || "?"}
                                </span>
                            )}
                            <div>
                                <p className="text-sm font-bold text-neutral">{member.user?.name || "Unknown"}</p>
                                <p className="text-xs text-neutral/60">{member.user?.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="mb-1.5 block text-xs font-bold text-neutral">
                            Monthly Rent (BDT) <span className="text-tertiary">*</span>
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter monthly rent amount"
                            required
                            min="0"
                            step="0.01"
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:border-tertiary focus:outline-none focus:ring-2 focus:ring-tertiary/20"
                        />
                        <p className="mt-1 text-xs text-neutral/50">
                            Enter 0 if this member has no rent
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-neutral transition hover:bg-gray-50 disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-xl bg-tertiary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-tertiary/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading && <Loader2 size={14} className="animate-spin" />}
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RentModal;

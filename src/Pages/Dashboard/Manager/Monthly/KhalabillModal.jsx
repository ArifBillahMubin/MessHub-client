import { useState } from "react";
import { X, DollarSign, Loader2 } from "lucide-react";

const KhalabillModal = ({ khalabill, onClose, onSave }) => {
    const [amount, setAmount] = useState(khalabill?.amount || "");
    const [note, setNote] = useState(khalabill?.note || "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!amount || Number(amount) < 0) {
            alert("Please enter a valid amount.");
            return;
        }

        setLoading(true);
        try {
            await onSave({ amount: Number(amount), note: note.trim() });
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
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <DollarSign size={15} strokeWidth={2} />
                        </span>
                        <div>
                            <p className="text-sm font-extrabold text-neutral">
                                {khalabill ? "Update Khalabill" : "Set Khalabill"}
                            </p>
                            <p className="text-[10px] text-neutral/50">
                                Set monthly common meal-related bill
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
                    <div className="mb-4">
                        <label className="mb-1.5 block text-xs font-bold text-neutral">
                            Total Amount (BDT) <span className="text-tertiary">*</span>
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter total khalabill amount"
                            required
                            min="0"
                            step="0.01"
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <p className="mt-1 text-xs text-neutral/50">
                            This will be equally divided among all active members
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="mb-1.5 block text-xs font-bold text-neutral">
                            Note (Optional)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add any notes about this khalabill..."
                            rows={3}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
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
                            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
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

export default KhalabillModal;

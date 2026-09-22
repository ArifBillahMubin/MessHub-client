import { useState, useEffect } from "react";
import { X, Wallet, Loader2 } from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const PaymentFormModal = ({ messId, payment, onClose, onSave }) => {
    const axiosSecure = useAxiosSecure();

    // Get current date in Bangladesh timezone
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const todayStr = now.toISOString().split('T')[0];

    const [userId, setUserId] = useState(payment?.userId?.toString() || "");
    const [category, setCategory] = useState(payment?.category || "");
    const [amount, setAmount] = useState(payment?.amount || "");
    const [date, setDate] = useState(payment?.date ? new Date(payment.date).toISOString().split('T')[0] : todayStr);
    const [note, setNote] = useState(payment?.note || "");
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMembers, setLoadingMembers] = useState(true);

    useEffect(() => {
        const loadMembers = async () => {
            try {
                const res = await axiosSecure.get(`/mess-members/${messId}?limit=100`);
                setMembers(res.data.members || []);
            } catch (err) {
                console.error("Failed to load members", err);
            } finally {
                setLoadingMembers(false);
            }
        };
        loadMembers();
    }, [axiosSecure, messId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userId || !category || !amount || !date) {
            alert("Please fill all required fields.");
            return;
        }

        if (Number(amount) <= 0) {
            alert("Amount must be a positive number.");
            return;
        }

        setLoading(true);
        try {
            await onSave({
                userId,
                category,
                amount: Number(amount),
                date,
                note: note.trim()
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { value: "meal", label: "Meal Payment" },
        { value: "rent", label: "Rent / Basa Vara" },
        { value: "khalabill", label: "Khalabill" },
        { value: "common_expense", label: "Common Expense" },
        { value: "other", label: "Other" }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral/40 backdrop-blur-[2px]" onClick={onClose} />

            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Wallet size={15} strokeWidth={2} />
                        </span>
                        <div>
                            <p className="text-sm font-extrabold text-neutral">
                                {payment ? "Edit Payment" : "Add Payment"}
                            </p>
                            <p className="text-[10px] text-neutral/50">
                                {payment ? "Update payment details" : "Record a new payment"}
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
                <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-6">
                    <div className="mb-4">
                        <label className="mb-1.5 block text-xs font-bold text-neutral">
                            Member <span className="text-tertiary">*</span>
                        </label>
                        {loadingMembers ? (
                            <div className="flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-background/30">
                                <Loader2 size={16} className="animate-spin text-primary" />
                            </div>
                        ) : (
                            <select
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                required
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Select member</option>
                                {members.map((member) => (
                                    <option key={member._id} value={member.userId}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="mb-1.5 block text-xs font-bold text-neutral">
                            Payment Category <span className="text-tertiary">*</span>
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="mb-1.5 block text-xs font-bold text-neutral">
                            Amount (BDT) <span className="text-tertiary">*</span>
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            required
                            min="0.01"
                            step="0.01"
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-1.5 block text-xs font-bold text-neutral">
                            Date <span className="text-tertiary">*</span>
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="mb-1.5 block text-xs font-bold text-neutral">
                            Note (Optional)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add payment note..."
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
                            disabled={loading || loadingMembers}
                            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading && <Loader2 size={14} className="animate-spin" />}
                            {loading ? "Saving..." : payment ? "Update" : "Save Payment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentFormModal;

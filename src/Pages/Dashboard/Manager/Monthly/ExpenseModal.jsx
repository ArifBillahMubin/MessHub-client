import { useState } from "react";
import { X, Receipt, Loader2 } from "lucide-react";

const ExpenseModal = ({ expense, categories, onClose, onSave }) => {
    // Get current date in Bangladesh timezone
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const todayStr = now.toISOString().split('T')[0];

    const [date, setDate] = useState(expense?.date ? new Date(expense.date).toISOString().split('T')[0] : todayStr);
    const [category, setCategory] = useState(expense?.category || "");
    const [amount, setAmount] = useState(expense?.amount || "");
    const [note, setNote] = useState(expense?.note || "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!date || !category || !amount || Number(amount) <= 0) {
            alert("Please fill all required fields with valid values.");
            return;
        }

        setLoading(true);
        try {
            await onSave({
                date,
                category: category.trim(),
                amount: Number(amount),
                note: note.trim()
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
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                            <Receipt size={15} strokeWidth={2} />
                        </span>
                        <div>
                            <p className="text-sm font-extrabold text-neutral">
                                {expense ? "Edit Expense" : "Add Expense"}
                            </p>
                            <p className="text-[10px] text-neutral/50">
                                {expense ? "Update expense details" : "Add a new common expense"}
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
                            Date <span className="text-tertiary">*</span>
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-1.5 block text-xs font-bold text-neutral">
                            Category <span className="text-tertiary">*</span>
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
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
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="mb-1.5 block text-xs font-bold text-neutral">
                            Description (Optional)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add description or notes..."
                            rows={3}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
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
                            className="flex items-center gap-2 rounded-xl bg-secondary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading && <Loader2 size={14} className="animate-spin" />}
                            {loading ? "Saving..." : expense ? "Update" : "Add Expense"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseModal;

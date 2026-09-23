import { useState } from "react";
import { X, Plus, Trash2, ShoppingBag, Loader2, Package } from "lucide-react";

const SubmitBazarModal = ({ messId, assignment, isNew, onClose, onSubmit }) => {
    // Get current date in Bangladesh timezone
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const todayStr = now.toISOString().split('T')[0];

    const [date, setDate] = useState(
        assignment?.date ? new Date(assignment.date).toISOString().split('T')[0] : todayStr
    );
    
    // Initialize items from assignment or empty
    const [items, setItems] = useState(() => {
        if (assignment?.items && assignment.items.length > 0) {
            return assignment.items.map(item => ({
                name: item.name || "",
                quantity: item.quantity || "",
                unit: item.unit || "kg",
                amount: "",
            }));
        }
        return [{ name: "", quantity: "", unit: "kg", amount: "" }];
    });

    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    const addItem = () => {
        setItems([...items, { name: "", quantity: "", unit: "kg", amount: "" }]);
    };

    const removeItem = (index) => {
        if (items.length === 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => {
            const amount = parseFloat(item.amount) || 0;
            return sum + amount;
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!date) {
            alert("Please select a date.");
            return;
        }
        if (items.some(item => !item.name.trim())) {
            alert("All items must have a name.");
            return;
        }
        if (items.some(item => !item.quantity || item.quantity <= 0)) {
            alert("All items must have a positive quantity.");
            return;
        }
        if (items.some(item => item.amount === "" || item.amount < 0)) {
            alert("All items must have a valid amount.");
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                date,
                items: items.map(item => ({
                    name: item.name.trim(),
                    quantity: parseFloat(item.quantity),
                    unit: item.unit.trim(),
                    amount: parseFloat(item.amount),
                })),
                note: note.trim(),
                assignmentId: assignment?._id || null,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fmt = (n) => n.toLocaleString('en-BD');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral/40 backdrop-blur-[2px]" onClick={onClose} />

            <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ShoppingBag size={15} strokeWidth={2} />
                        </span>
                        <div>
                            <p className="text-sm font-extrabold text-neutral">Submit Bazar</p>
                            <p className="text-[10px] text-neutral/50">
                                {assignment ? "Submit assigned shopping" : "Add your own bazar"}
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
                    {/* Assignment Reference */}
                    {assignment && (
                        <div className="mb-6 rounded-xl border border-secondary/20 bg-secondary/5 p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <Package size={14} className="text-secondary" />
                                <p className="text-xs font-bold text-neutral">Assigned Shopping List</p>
                            </div>
                            <div className="space-y-1.5">
                                {assignment.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 text-xs text-neutral/70">
                                        <span className="font-semibold">•</span>
                                        <span>{item.name}</span>
                                        {item.quantity > 0 && (
                                            <span className="text-neutral/50">
                                                ({item.quantity} {item.unit})
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {assignment.note && (
                                <p className="mt-3 text-xs italic text-neutral/60">&ldquo;{assignment.note}&rdquo;</p>
                            )}
                        </div>
                    )}

                    {/* Date */}
                    <div className="mb-6">
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

                    {/* Actual Items Purchased */}
                    <div className="mb-6">
                        <div className="mb-3 flex items-center justify-between">
                            <label className="text-xs font-bold text-neutral">
                                {assignment ? "Actual Items Purchased" : "Items"} <span className="text-tertiary">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
                            >
                                <Plus size={14} />
                                Add Item
                            </button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Item name"
                                        value={item.name}
                                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                                        required
                                        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Qty"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                        required
                                        min="0"
                                        step="0.1"
                                        className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                    <select
                                        value={item.unit}
                                        onChange={(e) => updateItem(index, 'unit', e.target.value)}
                                        className="w-20 rounded-lg border border-gray-200 px-2 py-2 text-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="kg">kg</option>
                                        <option value="liter">liter</option>
                                        <option value="piece">piece</option>
                                        <option value="pack">pack</option>
                                        <option value="bundle">bundle</option>
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Amount (৳)"
                                        value={item.amount}
                                        onChange={(e) => updateItem(index, 'amount', e.target.value)}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        disabled={items.length === 1}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-tertiary transition hover:bg-tertiary/5 disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                            <span className="text-sm font-bold text-neutral">Total Amount</span>
                            <span className="font-mono text-lg font-extrabold text-primary">৳{fmt(calculateTotal())}</span>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="mb-6">
                        <label className="mb-1.5 block text-xs font-bold text-neutral">Note (Optional)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add any additional notes..."
                            rows={3}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {/* Info Message */}
                    <div className="mb-6 rounded-xl border border-tertiary/20 bg-tertiary/5 p-4">
                        <p className="text-xs text-neutral/70">
                            <span className="font-semibold">Note:</span> Your submission will be reviewed by the mess manager. 
                            Only approved bazar will be counted as official expenses.
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
                            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading && <Loader2 size={14} className="animate-spin" />}
                            {loading ? "Submitting..." : "Submit for Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitBazarModal;

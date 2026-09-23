import { useState, useEffect } from "react";
import { X, Plus, Trash2, UserPlus, Loader2 } from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const AssignBazarModal = ({ messId, onClose, onSubmit, editingAssignment = null }) => {
    const axiosSecure = useAxiosSecure();

    // Get current date in Bangladesh timezone
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const todayStr = now.toISOString().split('T')[0];

    const [date, setDate] = useState(editingAssignment ? editingAssignment.date.split('T')[0] : todayStr);
    const [assignedTo, setAssignedTo] = useState(editingAssignment ? editingAssignment.assignedTo : "");
    const [items, setItems] = useState(
        editingAssignment && editingAssignment.items.length > 0
            ? editingAssignment.items
            : [{ name: "", quantity: "", unit: "kg" }]
    );
    const [note, setNote] = useState(editingAssignment ? editingAssignment.note || "" : "");
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMembers, setLoadingMembers] = useState(true);

    useEffect(() => {
        const loadMembers = async () => {
            try {
                const res = await axiosSecure.get(`/mess-members/${messId}?limit=50`);
                setMembers(res.data.members || []);
            } catch (err) {
                console.error("Failed to load members", err);
            } finally {
                setLoadingMembers(false);
            }
        };
        loadMembers();
    }, [axiosSecure, messId]);

    const addItem = () => {
        setItems([...items, { name: "", quantity: "", unit: "kg" }]);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!date) {
            alert("Please select a date.");
            return;
        }
        if (!assignedTo) {
            alert("Please select a member.");
            return;
        }
        if (items.some(item => !item.name.trim())) {
            alert("All items must have a name.");
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                date,
                assignedTo,
                items: items.map(item => ({
                    name: item.name.trim(),
                    quantity: parseFloat(item.quantity) || 0,
                    unit: item.unit.trim(),
                })),
                note: note.trim(),
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

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <UserPlus size={15} strokeWidth={2} />
                        </span>
                        <div>
                            <p className="text-sm font-extrabold text-neutral">
                                {editingAssignment ? "Edit Assignment" : "Assign Bazar"}
                            </p>
                            <p className="text-[10px] text-neutral/50">
                                {editingAssignment ? "Update shopping task details" : "Assign shopping task to a member"}
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
                    {/* Date and Assigned To */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
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

                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-neutral">
                                Assign To <span className="text-tertiary">*</span>
                            </label>
                            {loadingMembers ? (
                                <div className="flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-background/30">
                                    <Loader2 size={16} className="animate-spin text-primary" />
                                </div>
                            ) : (
                                <select
                                    value={assignedTo}
                                    onChange={(e) => setAssignedTo(e.target.value)}
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
                    </div>

                    {/* Shopping List */}
                    <div className="mb-6">
                        <div className="mb-3 flex items-center justify-between">
                            <label className="text-xs font-bold text-neutral">
                                Shopping List <span className="text-tertiary">*</span>
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
                                        placeholder="Item name (e.g. Rice)"
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
                                        min="0"
                                        step="0.1"
                                        className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                    <select
                                        value={item.unit}
                                        onChange={(e) => updateItem(index, 'unit', e.target.value)}
                                        className="w-24 rounded-lg border border-gray-200 px-2 py-2 text-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="kg">kg</option>
                                        <option value="liter">liter</option>
                                        <option value="piece">piece</option>
                                        <option value="pack">pack</option>
                                        <option value="bundle">bundle</option>
                                    </select>
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
                    </div>

                    {/* Note */}
                    <div className="mb-6">
                        <label className="mb-1.5 block text-xs font-bold text-neutral">Instructions (Optional)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add any special instructions for the member..."
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
                            {loading ? (editingAssignment ? "Updating..." : "Assigning...") : (editingAssignment ? "Update Assignment" : "Assign Bazar")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignBazarModal;

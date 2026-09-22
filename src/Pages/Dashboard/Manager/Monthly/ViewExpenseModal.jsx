import { X, Receipt, Calendar, DollarSign, Tag, FileText, User } from "lucide-react";

const ViewExpenseModal = ({ expense, onClose }) => {
    const fmt = (n) => n.toLocaleString('en-BD');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral/40 backdrop-blur-[2px]" onClick={onClose} />

            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                            <Receipt size={15} strokeWidth={2} />
                        </span>
                        <div>
                            <p className="text-sm font-extrabold text-neutral">Expense Details</p>
                            <p className="text-[10px] text-neutral/50">View complete expense information</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral/40 transition hover:bg-background hover:text-neutral"
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[70vh] overflow-y-auto p-6">
                    <div className="space-y-4">
                        {/* Date */}
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-secondary">
                                <Calendar size={14} />
                            </span>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-neutral/40">Date</p>
                                <p className="text-sm font-bold text-neutral">
                                    {new Date(expense.date).toLocaleDateString('en-GB', { 
                                        day: '2-digit', 
                                        month: 'long', 
                                        year: 'numeric' 
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-secondary">
                                <Tag size={14} />
                            </span>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-neutral/40">Category</p>
                                <p className="text-sm font-bold text-neutral">{expense.category}</p>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-secondary">
                                <DollarSign size={14} />
                            </span>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-neutral/40">Amount</p>
                                <p className="font-mono text-lg font-bold text-secondary">৳{fmt(expense.amount)}</p>
                            </div>
                        </div>

                        {/* Description */}
                        {expense.note && (
                            <div className="flex items-start gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-secondary">
                                    <FileText size={14} />
                                </span>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase text-neutral/40">Description</p>
                                    <p className="text-sm text-neutral">{expense.note}</p>
                                </div>
                            </div>
                        )}

                        {/* Created By */}
                        {expense.creator && (
                            <div className="mt-6 rounded-xl border border-gray-100 bg-background/30 p-4">
                                <div className="flex items-center gap-3">
                                    {expense.creator.photoURL ? (
                                        <img
                                            src={expense.creator.photoURL}
                                            alt={expense.creator.name}
                                            referrerPolicy="no-referrer"
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                                            {expense.creator.name?.charAt(0).toUpperCase() || "?"}
                                        </span>
                                    )}
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase text-neutral/40">Created By</p>
                                        <p className="text-xs font-semibold text-neutral">{expense.creator.name}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="w-full rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-secondary/90"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewExpenseModal;

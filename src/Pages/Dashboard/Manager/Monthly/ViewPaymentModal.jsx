import { X, Wallet, Calendar, DollarSign, Tag, FileText, User, Clock } from "lucide-react";

const CATEGORY_LABELS = {
    meal: "Meal Payment",
    rent: "Rent / Basa Vara",
    khalabill: "Khalabill",
    common_expense: "Common Expense",
    other: "Other"
};

const ViewPaymentModal = ({ payment, onClose }) => {
    const fmt = (n) => n.toLocaleString('en-BD');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral/40 backdrop-blur-[2px]" onClick={onClose} />

            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Wallet size={15} strokeWidth={2} />
                        </span>
                        <div>
                            <p className="text-sm font-extrabold text-neutral">Payment Details</p>
                            <p className="text-[10px] text-neutral/50">View complete payment information</p>
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
                        {/* Member */}
                        <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
                            <div className="flex items-center gap-3">
                                {payment.member?.photoURL ? (
                                    <img
                                        src={payment.member.photoURL}
                                        alt={payment.member.name}
                                        referrerPolicy="no-referrer"
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                        {payment.member?.name?.charAt(0).toUpperCase() || "?"}
                                    </span>
                                )}
                                <div>
                                    <p className="text-[10px] font-semibold uppercase text-neutral/40">Member</p>
                                    <p className="text-sm font-bold text-neutral">{payment.member?.name || "Unknown"}</p>
                                    <p className="text-xs text-neutral/60">{payment.member?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-primary">
                                <Tag size={14} />
                            </span>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-neutral/40">Payment Category</p>
                                <p className="text-sm font-bold text-neutral">
                                    {CATEGORY_LABELS[payment.category] || payment.category}
                                </p>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-primary">
                                <DollarSign size={14} />
                            </span>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-neutral/40">Amount</p>
                                <p className="font-mono text-lg font-bold text-primary">৳{fmt(payment.amount)}</p>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-primary">
                                <Calendar size={14} />
                            </span>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-neutral/40">Date</p>
                                <p className="text-sm font-bold text-neutral">
                                    {new Date(payment.date).toLocaleDateString('en-GB', { 
                                        day: '2-digit', 
                                        month: 'long', 
                                        year: 'numeric' 
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Note */}
                        {payment.note && (
                            <div className="flex items-start gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-primary">
                                    <FileText size={14} />
                                </span>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase text-neutral/40">Note</p>
                                    <p className="text-sm text-neutral">{payment.note}</p>
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="mt-6 space-y-3 rounded-xl border border-gray-100 bg-background/30 p-4">
                            {payment.creator && (
                                <div className="flex items-center gap-2">
                                    <User size={12} className="text-neutral/40" />
                                    <p className="text-xs text-neutral/60">
                                        Created by: <span className="font-semibold text-neutral">{payment.creator.name}</span>
                                    </p>
                                </div>
                            )}
                            {payment.createdAt && (
                                <div className="flex items-center gap-2">
                                    <Clock size={12} className="text-neutral/40" />
                                    <p className="text-xs text-neutral/60">
                                        Created: {new Date(payment.createdAt).toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            )}
                            {payment.updatedAt && payment.updatedAt !== payment.createdAt && (
                                <div className="flex items-center gap-2">
                                    <Clock size={12} className="text-neutral/40" />
                                    <p className="text-xs text-neutral/60">
                                        Last updated: {new Date(payment.updatedAt).toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewPaymentModal;

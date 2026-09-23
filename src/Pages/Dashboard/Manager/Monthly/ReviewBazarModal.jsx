import { X, CheckCircle2, XCircle, ShoppingBag, Calendar, User, FileText } from "lucide-react";

const ReviewBazarModal = ({ bazar, onClose, onApprove, onReject }) => {
    const fmt = (n) => n.toLocaleString('en-BD');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral/40 backdrop-blur-[2px]" onClick={onClose} />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-tertiary/10 text-tertiary">
                            <ShoppingBag size={15} strokeWidth={2} />
                        </span>
                        <div>
                            <p className="text-sm font-extrabold text-neutral">Review Bazar Submission</p>
                            <p className="text-[10px] text-neutral/50">Review and approve or reject this bazar</p>
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
                    {/* Member Info */}
                    <div className="mb-6 flex items-center gap-4 rounded-xl border border-primary/10 bg-primary/5 p-4">
                        {bazar.buyer?.photoURL ? (
                            <img
                                src={bazar.buyer.photoURL}
                                alt={bazar.buyer.name}
                                referrerPolicy="no-referrer"
                                className="h-12 w-12 rounded-full object-cover"
                            />
                        ) : (
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                                {bazar.buyer?.name?.charAt(0).toUpperCase() || "?"}
                            </span>
                        )}
                        <div>
                            <p className="text-sm font-bold text-neutral">{bazar.buyer?.name || "Unknown"}</p>
                            <p className="text-xs text-neutral/60">{bazar.buyer?.email || ""}</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="mb-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-primary">
                                <Calendar size={14} />
                            </span>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-neutral/40">Date</p>
                                <p className="text-sm font-bold text-neutral">
                                    {new Date(bazar.date).toLocaleDateString('en-GB', { 
                                        day: '2-digit', 
                                        month: 'long', 
                                        year: 'numeric' 
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-secondary">
                                <User size={14} />
                            </span>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-neutral/40">Source</p>
                                <p className="text-sm font-bold text-neutral capitalize">
                                    {bazar.source === 'assigned' ? 'Assigned Task' : 'Member Submission'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="mb-6">
                        <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-neutral/60">
                            <ShoppingBag size={14} />
                            Purchased Items
                        </h3>
                        <div className="space-y-2">
                            {bazar.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-background/40 px-4 py-3"
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-neutral">{item.name}</p>
                                        <p className="text-xs text-neutral/60">
                                            {item.quantity} {item.unit}
                                        </p>
                                    </div>
                                    <span className="font-mono text-sm font-bold text-primary">
                                        ৳{fmt(item.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="mt-3 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                            <span className="text-sm font-bold text-neutral">Total Amount</span>
                            <span className="font-mono text-xl font-extrabold text-primary">
                                ৳{fmt(bazar.totalAmount)}
                            </span>
                        </div>
                    </div>

                    {/* Note */}
                    {bazar.note && (
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText size={14} className="text-neutral/40" />
                                <h3 className="text-xs font-bold uppercase tracking-wide text-neutral/60">Note</h3>
                            </div>
                            <div className="rounded-xl border border-gray-100 bg-background/40 px-4 py-3">
                                <p className="text-sm text-neutral/80">{bazar.note}</p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onReject}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-tertiary/20 bg-white px-5 py-3 text-sm font-bold text-tertiary transition hover:bg-tertiary/5"
                        >
                            <XCircle size={16} />
                            Reject
                        </button>
                        <button
                            onClick={onApprove}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-secondary/90"
                        >
                            <CheckCircle2 size={16} />
                            Approve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewBazarModal;

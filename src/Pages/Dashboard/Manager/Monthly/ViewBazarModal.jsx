import { X, ShoppingBag, Calendar, User, FileText, CheckCircle2, UserPlus } from "lucide-react";

const ViewBazarModal = ({ bazar, onClose }) => {
    const fmt = (n) => n.toLocaleString('en-BD');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral/40 backdrop-blur-[2px]" onClick={onClose} />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ShoppingBag size={15} strokeWidth={2} />
                        </span>
                        <div>
                            <p className="text-sm font-extrabold text-neutral">Bazar Details</p>
                            <p className="text-[10px] text-neutral/50">View complete bazar information</p>
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
                    {/* Basic Info */}
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
                                <p className="text-[10px] font-semibold uppercase text-neutral/40">Buyer</p>
                                <div className="flex items-center gap-2">
                                    {bazar.buyer?.photoURL ? (
                                        <img
                                            src={bazar.buyer.photoURL}
                                            alt={bazar.buyer.name}
                                            referrerPolicy="no-referrer"
                                            className="h-6 w-6 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                            {bazar.buyer?.name?.charAt(0).toUpperCase() || "?"}
                                        </span>
                                    )}
                                    <p className="text-sm font-bold text-neutral">{bazar.buyer?.name || "Unknown"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-tertiary">
                                <FileText size={14} />
                            </span>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-neutral/40">Source</p>
                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                    bazar.source === 'manager' ? 'bg-primary/10 text-primary' :
                                    bazar.source === 'assigned' ? 'bg-secondary/10 text-secondary' :
                                    'bg-neutral/10 text-neutral'
                                }`}>
                                    {bazar.source === 'manager' ? 'Manager' :
                                     bazar.source === 'assigned' ? 'Assigned' : 'Member'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-secondary">
                                <CheckCircle2 size={14} />
                            </span>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-neutral/40">Status</p>
                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                    bazar.status === 'approved' ? 'bg-secondary/10 text-secondary' :
                                    bazar.status === 'pending' ? 'bg-tertiary/10 text-tertiary' :
                                    'bg-neutral/10 text-neutral'
                                }`}>
                                    {bazar.status.charAt(0).toUpperCase() + bazar.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Info (if applicable) */}
                    {bazar.assignmentId && bazar.assignment && (
                        <div className="mb-6 rounded-xl border border-secondary/20 bg-secondary/5 p-4">
                            <div className="mb-2 flex items-center gap-2">
                                <UserPlus size={14} className="text-secondary" />
                                <p className="text-xs font-bold text-neutral">Assignment Information</p>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-neutral/60">Assigned To:</span>
                                    <span className="font-semibold text-neutral">
                                        {bazar.assignment.assignedUser?.name || "Unknown"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral/60">Assignment Date:</span>
                                    <span className="font-semibold text-neutral">
                                        {new Date(bazar.assignment.date).toLocaleDateString('en-GB', { 
                                            day: '2-digit', 
                                            month: 'short' 
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral/60">Assignment Status:</span>
                                    <span className="font-semibold text-neutral capitalize">
                                        {bazar.assignment.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Items */}
                    <div className="mb-6">
                        <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-neutral/60">
                            <ShoppingBag size={14} />
                            Items
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
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText size={14} className="text-neutral/40" />
                                <h3 className="text-xs font-bold uppercase tracking-wide text-neutral/60">Note</h3>
                            </div>
                            <div className="rounded-xl border border-gray-100 bg-background/40 px-4 py-3">
                                <p className="text-sm text-neutral/80">{bazar.note}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewBazarModal;

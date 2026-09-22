import { X, Calendar, User, Package, FileText, AlertTriangle } from "lucide-react";

const ViewBazarModal = ({ record, onClose }) => {
    if (!record) return null;

    const fmt = (n) => n.toLocaleString('en-BD');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-primary/10 bg-white shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
                    <h2 className="text-lg font-extrabold text-neutral">Bazar Details</h2>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral/60 transition hover:bg-background hover:text-neutral"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-5 p-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                        <StatusBadge status={record.status} />
                        <div className="text-right">
                            <p className="text-xs text-neutral/50">Total Amount</p>
                            <p className="text-xl font-bold text-primary">৳{fmt(record.totalAmount)}</p>
                        </div>
                    </div>

                    {/* Date & Buyer Info */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <InfoCard
                            icon={<Calendar size={16} />}
                            label="Date"
                            value={new Date(record.date).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })}
                        />
                        <InfoCard
                            icon={<User size={16} />}
                            label="Buyer"
                            value={record.buyerName || "You"}
                        />
                    </div>

                    {/* Source/Assignment Info */}
                    {record.source === 'assigned' && record.assignmentId && (
                        <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4">
                            <div className="mb-2 flex items-center gap-2">
                                <Package size={14} className="text-secondary" />
                                <p className="text-xs font-bold uppercase tracking-wide text-secondary">
                                    From Assignment
                                </p>
                            </div>
                            <p className="text-xs text-neutral/70">
                                This bazar was submitted based on a manager assignment.
                            </p>
                        </div>
                    )}

                    {/* Items List */}
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <Package size={16} className="text-primary" />
                            <h3 className="text-sm font-extrabold text-neutral">Items</h3>
                            <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-bold text-primary">
                                {record.items.length}
                            </span>
                        </div>

                        <div className="space-y-2">
                            {record.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-background/50 p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-neutral">{item.name}</p>
                                            <p className="text-xs text-neutral/60">
                                                {item.quantity} {item.unit}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-mono text-sm font-bold text-neutral">
                                        ৳{fmt(item.amount)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="mt-3 flex items-center justify-between rounded-lg bg-primary/5 px-4 py-3">
                            <p className="text-sm font-bold text-neutral">Total Amount</p>
                            <p className="font-mono text-lg font-bold text-primary">
                                ৳{fmt(record.totalAmount)}
                            </p>
                        </div>
                    </div>

                    {/* Note */}
                    {record.note && (
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <FileText size={16} className="text-primary" />
                                <h3 className="text-sm font-extrabold text-neutral">Note</h3>
                            </div>
                            <div className="rounded-lg border border-gray-100 bg-background/50 p-3">
                                <p className="text-sm text-neutral/80">{record.note}</p>
                            </div>
                        </div>
                    )}

                    {/* Rejection Reason */}
                    {record.status === 'rejected' && record.rejectionReason && (
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <AlertTriangle size={16} className="text-tertiary" />
                                <h3 className="text-sm font-extrabold text-tertiary">Rejection Reason</h3>
                            </div>
                            <div className="rounded-lg border border-tertiary/20 bg-tertiary/5 p-3">
                                <p className="text-sm text-neutral/80">{record.rejectionReason}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 border-t border-gray-100 bg-white px-6 py-4">
                    <button
                        onClick={onClose}
                        className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary/90"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const InfoCard = ({ icon, label, value }) => (
    <div className="rounded-lg border border-gray-100 bg-background/50 p-3">
        <div className="mb-1.5 flex items-center gap-2">
            <span className="text-primary/60">{icon}</span>
            <p className="text-xs font-bold uppercase tracking-wide text-neutral/50">{label}</p>
        </div>
        <p className="text-sm font-semibold text-neutral">{value}</p>
    </div>
);

const StatusBadge = ({ status }) => {
    const configs = {
        pending: {
            label: "Pending Review",
            className: "bg-tertiary/10 text-tertiary border-tertiary/20",
        },
        approved: {
            label: "Approved",
            className: "bg-secondary/10 text-secondary border-secondary/20",
        },
        rejected: {
            label: "Rejected",
            className: "bg-neutral/10 text-neutral border-neutral/20",
        },
    };

    const config = configs[status] || configs.pending;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${config.className}`}>
            {config.label}
        </span>
    );
};

export default ViewBazarModal;

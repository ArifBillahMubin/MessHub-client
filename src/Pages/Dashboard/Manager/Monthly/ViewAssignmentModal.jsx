import { X, UserPlus, Calendar, Package, FileText } from "lucide-react";

const ViewAssignmentModal = ({ assignment, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral/40 backdrop-blur-[2px]" onClick={onClose} />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                            <UserPlus size={15} strokeWidth={2} />
                        </span>
                        <div>
                            <p className="text-sm font-extrabold text-neutral">Assignment Details</p>
                            <p className="text-[10px] text-neutral/50">View bazar assignment information</p>
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
                    {/* Assigned Member */}
                    <div className="mb-6 flex items-center gap-4 rounded-xl border border-secondary/10 bg-secondary/5 p-4">
                        {assignment.assignedUser?.photoURL ? (
                            <img
                                src={assignment.assignedUser.photoURL}
                                alt={assignment.assignedUser.name}
                                referrerPolicy="no-referrer"
                                className="h-12 w-12 rounded-full object-cover"
                            />
                        ) : (
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-lg font-bold text-secondary">
                                {assignment.assignedUser?.name?.charAt(0).toUpperCase() || "?"}
                            </span>
                        )}
                        <div>
                            <p className="text-[10px] font-semibold uppercase text-neutral/40">Assigned To</p>
                            <p className="text-sm font-bold text-neutral">{assignment.assignedUser?.name || "Unknown"}</p>
                            <p className="text-xs text-neutral/60">{assignment.assignedUser?.email || ""}</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="mb-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-primary">
                                <Calendar size={14} />
                            </span>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-neutral/40">Bazar Date</p>
                                <p className="text-sm font-bold text-neutral">
                                    {new Date(assignment.date).toLocaleDateString('en-GB', { 
                                        day: '2-digit', 
                                        month: 'long', 
                                        year: 'numeric' 
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-secondary">
                                <Package size={14} />
                            </span>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-neutral/40">Status</p>
                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                    assignment.status === 'assigned' ? 'bg-secondary/10 text-secondary' :
                                    assignment.status === 'submitted' ? 'bg-tertiary/10 text-tertiary' :
                                    'bg-neutral/10 text-neutral'
                                }`}>
                                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-neutral">
                                <Calendar size={14} />
                            </span>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-neutral/40">Created Date</p>
                                <p className="text-sm font-bold text-neutral">
                                    {new Date(assignment.createdAt).toLocaleDateString('en-GB', { 
                                        day: '2-digit', 
                                        month: 'short', 
                                        year: 'numeric' 
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Shopping List */}
                    <div className="mb-6">
                        <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-neutral/60">
                            <Package size={14} />
                            Shopping List
                        </h3>
                        <div className="space-y-2">
                            {assignment.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-lg border border-gray-100 bg-background/40 px-4 py-2.5"
                                >
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-neutral">{item.name}</p>
                                    </div>
                                    {item.quantity > 0 && (
                                        <span className="text-xs text-neutral/60">
                                            {item.quantity} {item.unit}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    {assignment.note && (
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText size={14} className="text-neutral/40" />
                                <h3 className="text-xs font-bold uppercase tracking-wide text-neutral/60">Instructions</h3>
                            </div>
                            <div className="rounded-xl border border-gray-100 bg-background/40 px-4 py-3">
                                <p className="text-sm text-neutral/80">{assignment.note}</p>
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

export default ViewAssignmentModal;

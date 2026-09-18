import { Construction } from "lucide-react";

// Reusable placeholder for pages under development.
// Usage: <DevPlaceholder title="Meals" />
const DevPlaceholder = ({ title = "Page" }) => {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-primary/20 bg-white p-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background text-primary">
                <Construction size={30} strokeWidth={1.8} />
            </span>
            <div>
                <h2 className="text-xl font-extrabold text-neutral">{title}</h2>
                <p className="mt-1.5 text-sm font-medium text-neutral/50">
                    This page is currently under development.
                </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
                Coming Soon
            </span>
        </div>
    );
};

export default DevPlaceholder;

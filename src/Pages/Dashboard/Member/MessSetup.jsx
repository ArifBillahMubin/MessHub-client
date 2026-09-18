import { PlusCircle, KeyRound } from "lucide-react";

// Shown when role === "member" && hasMess === false
// Gives the user a choice to create a new mess or join one by code.
const MessSetup = () => {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">

            {/* Heading */}
            <div className="mb-8 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Get Started
                </span>
                <h1 className="mt-3 text-2xl font-extrabold text-neutral sm:text-3xl">
                    Set Up Your Mess
                </h1>
                <p className="mt-2 text-sm font-medium text-neutral/50">
                    You are not part of any mess yet. Create a new one or join an existing mess using a code.
                </p>
            </div>

            {/* Option cards */}
            <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Create a Mess */}
                <div className="group flex flex-col items-center gap-4 rounded-2xl border border-primary/10 bg-white p-7 text-center shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-white">
                        <PlusCircle size={26} strokeWidth={1.8} />
                    </span>
                    <div>
                        <h2 className="text-base font-extrabold text-neutral">Create a Mess</h2>
                        <p className="mt-1 text-xs font-medium text-neutral/50">
                            Start a new mess and invite your members.
                        </p>
                    </div>
                    <button
                        type="button"
                        disabled
                        className="mt-auto w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white opacity-50 cursor-not-allowed"
                        title="Coming soon"
                    >
                        Create Mess
                    </button>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-tertiary">
                        Under Development
                    </p>
                </div>

                {/* Join by Mess Code */}
                <div className="group flex flex-col items-center gap-4 rounded-2xl border border-primary/10 bg-white p-7 text-center shadow-sm transition-all duration-200 hover:border-secondary/30 hover:shadow-md">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-secondary transition-all duration-200 group-hover:bg-secondary group-hover:text-white">
                        <KeyRound size={26} strokeWidth={1.8} />
                    </span>
                    <div>
                        <h2 className="text-base font-extrabold text-neutral">Join by Mess Code</h2>
                        <p className="mt-1 text-xs font-medium text-neutral/50">
                            Enter the code shared by your mess manager.
                        </p>
                    </div>
                    <button
                        type="button"
                        disabled
                        className="mt-auto w-full rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white opacity-50 cursor-not-allowed"
                        title="Coming soon"
                    >
                        Join Mess
                    </button>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-tertiary">
                        Under Development
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MessSetup;

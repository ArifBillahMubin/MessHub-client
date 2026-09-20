import { useNavigate } from "react-router";
import { PlusCircle, KeyRound } from "lucide-react";

// Shown when role === "member" && hasMess === false
const MessSetup = () => {
    const navigate = useNavigate();

    return (
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
                    onClick={() => navigate("/dashboard/create-mess")}
                    className="mt-auto w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:translate-y-0"
                >
                    Create Mess
                </button>
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
                    onClick={() => navigate("/dashboard/join-mess")}
                    className="mt-auto w-full rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-md active:translate-y-0"
                >
                    Join Mess
                </button>
            </div>
        </div>
    );
};

export default MessSetup;

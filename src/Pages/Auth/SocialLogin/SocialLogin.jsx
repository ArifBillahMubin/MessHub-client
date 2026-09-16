import { useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";

const SocialLogin = () => {
    const { signinGoogle, loading, setLoading } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();

    const handleGoogleSignin = () => {
        setLoading(true);

        signinGoogle()
            .then(() => {
                toast.success("Welcome to MessHub! 🎉", {
                    duration: 3000,
                    style: {
                        borderRadius: "12px",
                        background: "#D5FBF9",
                        color: "#173B3A",
                        border: "1px solid #006B68",
                        fontWeight: "600",
                    },
                    iconTheme: {
                        primary: "#006B68",
                        secondary: "#ffffff",
                    },
                });

                navigate(location?.state || "/");
            })
            .catch((error) => {
                console.error(error);

                toast.error(
                    "Google sign-in failed. Please try again.",
                    {
                        duration: 3500,
                        style: {
                            borderRadius: "12px",
                            background: "#ffffff",
                            color: "#173B3A",
                            border: "1px solid #FF8A00",
                            fontWeight: "600",
                        },
                        iconTheme: {
                            primary: "#FF8A00",
                            secondary: "#ffffff",
                        },
                    }
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <button
            type="button"
            onClick={handleGoogleSignin}
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-neutral shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-background hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? (
                <>
                    <Loader2 size={18} className="animate-spin text-primary" />
                    <span>Signing in…</span>
                </>
            ) : (
                <>
                    <FcGoogle size={19} />
                    <span>Continue with Google</span>
                </>
            )}
        </button>
    );
};

export default SocialLogin;

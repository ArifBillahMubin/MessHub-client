import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { signinUser, loading , setLoading } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();

    const handleSing = (data) => {
        signinUser(data.email, data.password)
            .then((result) => {
                console.log(result.user);

                toast.success("Welcome back to MessHub! 🎉", {
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
                console.log(error);

                toast.error("Login failed. Please check your email and password.", {
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
                });
            }).finally(() => {
                setLoading(false);
            });
    };

    return (
        <div>
            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-neutral">
                    Welcome Back
                </h1>
                <p className="mt-1.5 text-sm text-slate-500">
                    Log in to your MessHub account
                </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(handleSing)} className="space-y-5">

                {/* Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral"
                    >
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register("email", { required: true })}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-neutral outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                    {errors.email?.type === "required" && (
                        <p className="mt-1.5 text-xs font-medium text-red-500">
                            Email is required.
                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <div className="mb-1.5 flex items-center justify-between">
                        <label
                            htmlFor="password"
                            className="text-xs font-bold uppercase tracking-wide text-neutral"
                        >
                            Password
                        </label>
                        <a
                            href="#"
                            className="text-xs font-semibold text-primary transition-colors hover:text-secondary"
                        >
                            Forgot password?
                        </a>
                    </div>
                    <input
                        id="password"
                        type="password"
                        {...register("password", {
                            required: true,
                            minLength: 6,
                            maxLength: 8,
                        })}
                        placeholder="Enter your password"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-neutral outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                    {errors.password?.type === "required" && (
                        <p className="mt-1.5 text-xs font-medium text-red-500">
                            Please enter your password.
                        </p>
                    )}
                    {errors.password?.type === "minLength" && (
                        <p className="mt-1.5 text-xs font-medium text-red-500">
                            Password must contain at least 6 characters.
                        </p>
                    )}
                    {errors.password?.type === "maxLength" && (
                        <p className="mt-1.5 text-xs font-medium text-red-500">
                            Password must contain maximum 8 characters.
                        </p>
                    )}
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Logging in…" : "Login"}
                </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-200" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">or</span>
                <span className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Social Login */}
            <SocialLogin />

            {/* Register link */}
            <p className="mt-5 border-t border-gray-100 pt-5 text-center text-xs text-slate-500">
                Don't have an account?{" "}
                <Link
                    state={location.state}
                    to="/register"
                    className="font-bold text-primary transition-colors hover:text-secondary"
                >
                    Create one free
                </Link>
            </p>
        </div>
    );
};

export default Login;

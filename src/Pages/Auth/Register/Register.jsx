import { useMemo, useState } from "react";
import {
    User,
    Phone,
    AtSign,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Camera,
    MapPin,
    BriefcaseBusiness,
    GraduationCap,
    Loader2,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";
import axios from "axios";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const {
        registerUser,
        updateUserProfile,
        loading,
        setLoading,
    } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch("password");
    const selectedPhoto = watch("profilePhoto");

    // Profile image preview
    const photoPreview = useMemo(() => {
        if (!selectedPhoto?.[0]) return null;
        return URL.createObjectURL(selectedPhoto[0]);
    }, [selectedPhoto]);

    const handleRegister = (data) => {
        setLoading(true);

        const profileImage = data.profilePhoto?.[0];

        if (!profileImage) {
            toast.error("Please upload a profile photo.");
            setLoading(false);
            return;
        }

        // Create Firebase account
        registerUser(data.email, data.password)
            .then((result) => {
                console.log("Registered user:", result.user);

                // Upload profile photo to ImgBB
                const formData = new FormData();
                formData.append("image", profileImage);

                const imgApiUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`;

                return axios.post(imgApiUrl, formData);
            })
            .then((res) => {
                const photoURL = res.data.data.url;

                // Update Firebase profile
                const userProfile = {
                    displayName: data.name,
                    photoURL: photoURL,
                };

                return updateUserProfile(userProfile);
            })
            .then(() => {
                toast.success("Account created successfully! 🎉", {
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

                navigate(location.state || "/");
            })
            .catch((error) => {
                console.error(error);

                toast.error(
                    error?.message || "Registration failed. Please try again.",
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
        <div className="w-full">

            {/* Badge */}
            <div className="mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-[10px] font-bold tracking-[0.12em] uppercase text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    New MessHub Account
                </span>
            </div>

            {/* Heading */}
            <div className="mb-6">
                <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-neutral">
                    Create your account
                </h1>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    Manage your mess life and keep everything organized in one place.
                </p>
            </div>

            {/* Profile Photo */}
            <div className="mb-5">
                <label
                    htmlFor="profilePhoto"
                    className="group flex cursor-pointer items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all duration-200 hover:border-primary hover:bg-background/50"
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-background">
                        {photoPreview ? (
                            <img
                                src={photoPreview}
                                alt="Profile preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Camera size={18} className="text-primary" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral">
                            Upload Photo
                            <span className="ml-1 font-medium text-gray-400">(Optional)</span>
                        </p>
                        <p className="mt-0.5 text-[10px] text-gray-400">
                            JPG, PNG or WEBP · up to 5 MB
                        </p>
                        {selectedPhoto?.[0] && (
                            <p className="mt-0.5 max-w-[200px] truncate text-[10px] font-semibold text-primary">
                                {selectedPhoto[0].name}
                            </p>
                        )}
                    </div>
                </label>
                <input
                    id="profilePhoto"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    {...register("profilePhoto")}
                    className="hidden"
                />
            </div>

            {/* Current Status */}
            <div className="mb-5">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                    Current Status
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-primary bg-background px-4 py-2.5 transition-all">
                        <input
                            type="radio"
                            value="Student"
                            {...register("status", {
                                required: "Please select your status",
                            })}
                            className="accent-primary"
                        />
                        <GraduationCap size={15} className="text-primary" />
                        <span className="text-xs font-semibold text-primary">Student</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 transition-all hover:border-primary hover:bg-background/50">
                        <input
                            type="radio"
                            value="Job Holder"
                            {...register("status", {
                                required: "Please select your status",
                            })}
                            className="accent-primary"
                        />
                        <BriefcaseBusiness size={15} className="text-secondary" />
                        <span className="text-xs font-semibold text-neutral">Job Holder</span>
                    </label>
                </div>
                {errors.status && (
                    <p className="mt-1.5 text-[10px] font-medium text-red-500">
                        {errors.status.message}
                    </p>
                )}
            </div>

            {/* Full Name + Phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Full Name */}
                <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                        Full Name
                    </label>
                    <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                        <User size={15} className="shrink-0 text-gray-400" />
                        <input
                            {...register("name", {
                                required: "Full name is required",
                            })}
                            type="text"
                            placeholder="e.g. Arif Billah"
                            className="w-full bg-transparent px-3 py-2.5 text-sm text-neutral outline-none placeholder:text-gray-400"
                        />
                    </div>
                    {errors.name && (
                        <p className="mt-1 text-[10px] font-medium text-red-500">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                        Phone Number
                    </label>
                    <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                        <Phone size={15} className="shrink-0 text-gray-400" />
                        <input
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^01[3-9]\d{8}$/,
                                    message: "Enter a valid Bangladesh phone number",
                                },
                            })}
                            type="tel"
                            placeholder="01XXXXXXXXX"
                            className="w-full bg-transparent px-3 py-2.5 text-sm text-neutral outline-none placeholder:text-gray-400"
                        />
                    </div>
                    {errors.phone && (
                        <p className="mt-1 text-[10px] font-medium text-red-500">
                            {errors.phone.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Email */}
            <div className="mt-4">
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                    Email Address
                </label>
                <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                    <AtSign size={15} className="shrink-0 text-gray-400" />
                    <input
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: "Enter a valid email address",
                            },
                        })}
                        type="email"
                        placeholder="you@example.com"
                        className="w-full bg-transparent px-3 py-2.5 text-sm text-neutral outline-none placeholder:text-gray-400"
                    />
                </div>
                {errors.email && (
                    <p className="mt-1 text-[10px] font-medium text-red-500">
                        {errors.email.message}
                    </p>
                )}
                <p className="mt-1 text-[10px] text-gray-400">
                    Used for important notifications and monthly reports.
                </p>
            </div>

            {/* Location */}
            <div className="mt-4">
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                    Location / Area
                </label>
                <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                    <MapPin size={15} className="shrink-0 text-primary" />
                    <input
                        {...register("location", {
                            required: "Location is required",
                        })}
                        type="text"
                        placeholder="e.g. Mirpur-10, Dhaka"
                        className="w-full bg-transparent px-3 py-2.5 text-sm text-neutral outline-none placeholder:text-gray-400"
                    />
                </div>
                {errors.location && (
                    <p className="mt-1 text-[10px] font-medium text-red-500">
                        {errors.location.message}
                    </p>
                )}
            </div>

            {/* Password + Confirm Password */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Password */}
                <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                        Password
                    </label>
                    <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                        <Lock size={15} className="shrink-0 text-gray-400" />
                        <input
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                            type={showPassword ? "text" : "password"}
                            placeholder="At least 6 characters"
                            className="w-full bg-transparent px-3 py-2.5 text-sm text-neutral outline-none placeholder:text-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="shrink-0 p-0.5 text-gray-400 transition-colors hover:text-primary"
                        >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-[10px] font-medium text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                        Confirm Password
                    </label>
                    <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                        <Lock size={15} className="shrink-0 text-gray-400" />
                        <input
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === password || "Passwords do not match",
                            })}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter password"
                            className="w-full bg-transparent px-3 py-2.5 text-sm text-neutral outline-none placeholder:text-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="shrink-0 p-0.5 text-gray-400 transition-colors hover:text-primary"
                        >
                            {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-1 text-[10px] font-medium text-red-500">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Short Bio */}
            <div className="mt-4">
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
                    Short Bio
                    <span className="ml-1 font-medium normal-case tracking-normal text-gray-400">(Optional)</span>
                </label>
                <textarea
                    {...register("bio")}
                    rows="3"
                    placeholder="Tell us a little about yourself..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-neutral outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
            </div>

            {/* Terms */}
            <div className="mt-4">
                <label className="flex cursor-pointer items-start gap-2.5">
                    <input
                        type="checkbox"
                        {...register("terms", {
                            required: "You must agree to the Terms & Conditions",
                        })}
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-primary"
                    />
                    <span className="text-[11px] leading-[1.6] text-slate-500">
                        I agree to the{" "}
                        <Link
                            to="/terms"
                            className="font-semibold text-primary hover:text-secondary"
                        >
                            Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                            to="/privacy"
                            className="font-semibold text-primary hover:text-secondary"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </span>
                </label>
                {errors.terms && (
                    <p className="mt-1.5 text-[10px] font-medium text-red-500">
                        {errors.terms.message}
                    </p>
                )}
            </div>

            {/* Create Account Button */}
            <button
                type="button"
                onClick={handleSubmit(handleRegister)}
                disabled={loading}
                className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? (
                    <>
                        <Loader2 size={17} className="animate-spin" />
                        Creating Account…
                    </>
                ) : (
                    <>
                        Create Account
                        <ArrowRight size={16} />
                    </>
                )}
            </button>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-200" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">or</span>
                <span className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google Login */}
            <SocialLogin />

            {/* Login link */}
            <div className="mt-5 border-t border-gray-100 pt-5 text-center">
                <p className="text-xs text-slate-500">
                    Already have an account?{" "}
                    <Link
                        state={location.state}
                        to="/login"
                        className="font-bold text-primary hover:text-secondary"
                    >
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

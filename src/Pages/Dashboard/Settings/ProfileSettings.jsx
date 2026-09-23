import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { User, Mail, Phone, MapPin, FileText, Camera, Edit2, Save, X, Shield, Calendar } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useCurrentUser from "../../../hooks/useCurrentUser";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { imageUpload } from "../../../utils/index";
import Loading from "../../../components/Loading/Loading";

const ProfileSettings = () => {
    const { user, updateUserProfile } = useAuth();
    const { currentUser, isUserLoading, refetchUser } = useCurrentUser();
    const axiosSecure = useAxiosSecure();

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        location: "",
        bio: "",
    });

    // Initialize form data when currentUser loads
    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || "",
                phone: currentUser.phone || "",
                location: currentUser.location || "",
                bio: currentUser.bio || "",
            });
            setImagePreview(currentUser.photoURL || null);
        }
    }, [currentUser]);

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error("Please select a valid image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB");
                return;
            }

            setSelectedImage(file);
            
            // Show preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        // Reset form to current user data
        if (currentUser) {
            setFormData({
                name: currentUser.name || "",
                phone: currentUser.phone || "",
                location: currentUser.location || "",
                bio: currentUser.bio || "",
            });
            setImagePreview(currentUser.photoURL || null);
            setSelectedImage(null);
        }
        setIsEditing(false);
    };

    const handleSaveChanges = async () => {
        if (!user?.email || !currentUser) return;

        // Validate name
        if (!formData.name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        setIsSaving(true);

        try {
            let photoURL = currentUser.photoURL || "";

            // Step 1: Upload new image if selected
            if (selectedImage) {
                setImageUploading(true);
                try {
                    const uploadedUrl = await imageUpload(selectedImage);
                    if (!uploadedUrl) {
                        throw new Error("Image upload failed");
                    }
                    photoURL = uploadedUrl;
                } catch (error) {
                    console.error("Image upload error:", error);
                    toast.error("Failed to upload image");
                    setIsSaving(false);
                    setImageUploading(false);
                    return;
                }
                setImageUploading(false);
            }

            // Step 2: Update Firebase Auth (displayName and photoURL)
            const firebaseUpdateNeeded =
                formData.name !== user.displayName ||
                photoURL !== (user.photoURL || "");

            if (firebaseUpdateNeeded) {
                try {
                    await updateUserProfile({
                        displayName: formData.name,
                        photoURL: photoURL,
                    });
                    console.log("Firebase profile updated successfully");
                } catch (error) {
                    console.error("Firebase update error:", error);
                    toast.error("Failed to update Firebase profile");
                    setIsSaving(false);
                    return;
                }
            }

            // Step 3: Update MongoDB user document
            try {
                await axiosSecure.patch("/users/me", {
                    email: user.email,
                    name: formData.name,
                    photoURL: photoURL,
                    phone: formData.phone,
                    location: formData.location,
                    bio: formData.bio,
                });
            } catch (error) {
                console.error("MongoDB update error:", error);
                toast.error(error.response?.data?.message || "Failed to update profile");
                setIsSaving(false);
                return;
            }

            // Step 4: Refresh current user data
            await refetchUser();

            // Step 5: Show success message
            toast.success("Profile updated successfully!", {
                duration: 2500,
                style: {
                    borderRadius: "12px",
                    background: "#D5FBF9",
                    color: "#173B3A",
                    border: "1px solid #006B68",
                    fontWeight: "600",
                },
                iconTheme: { primary: "#006B68", secondary: "#ffffff" },
            });

            // Reset edit mode and clear selected image
            setIsEditing(false);
            setSelectedImage(null);
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    if (isUserLoading) return <Loading />;

    if (!currentUser) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <User size={48} className="text-neutral/40" />
                <p className="text-sm text-neutral/60">Unable to load profile data</p>
            </div>
        );
    }

    const displayName = currentUser.name || user?.displayName || "User";
    const avatarInitial = displayName.charAt(0).toUpperCase();
    const roleLabel =
        currentUser.role === "super_admin"
            ? "Super Admin"
            : currentUser.role === "manager"
            ? "Manager"
            : "Member";

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-neutral">Profile / Settings</h1>
                    <p className="mt-1 text-sm text-neutral/60">
                        Manage your personal information and account settings
                    </p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
                    >
                        <Edit2 size={16} />
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="flex items-center gap-2 rounded-lg border border-neutral/20 bg-white px-4 py-2.5 text-sm font-bold text-neutral transition hover:bg-neutral/5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <X size={16} />
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveChanges}
                            disabled={isSaving || imageUploading}
                            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Save size={16} />
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                )}
            </div>

            {/* Profile Header Card */}
            <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    {/* Profile Photo */}
                    <div className="relative">
                        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-primary/10">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt={displayName}
                                    referrerPolicy="no-referrer"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary/10">
                                    <span className="text-3xl font-bold text-primary">{avatarInitial}</span>
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <label
                                htmlFor="profile-photo"
                                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:bg-primary/90"
                            >
                                <Camera size={16} />
                                <input
                                    type="file"
                                    id="profile-photo"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                    disabled={isSaving}
                                />
                            </label>
                        )}
                        {imageUploading && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-extrabold text-neutral">{displayName}</h2>
                        <p className="mt-1 text-sm text-neutral/60">{currentUser.email}</p>
                        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                                <Shield size={12} />
                                {roleLabel}
                            </span>
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                                    currentUser.accountStatus === "active"
                                        ? "bg-secondary/10 text-secondary"
                                        : "bg-tertiary/10 text-tertiary"
                                }`}
                            >
                                {currentUser.accountStatus === "active" ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-extrabold text-neutral">Personal Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Name */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-neutral">
                            <User size={16} className="text-primary" />
                            Name
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={isSaving}
                                className="w-full rounded-lg border border-primary/20 bg-background/50 px-4 py-2.5 text-sm font-medium text-neutral transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter your name"
                            />
                        ) : (
                            <p className="rounded-lg bg-background/50 px-4 py-2.5 text-sm font-medium text-neutral">
                                {formData.name || "Not provided"}
                            </p>
                        )}
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-neutral">
                            <Mail size={16} className="text-primary" />
                            Email
                        </label>
                        <p className="rounded-lg bg-neutral/5 px-4 py-2.5 text-sm font-medium text-neutral/60">
                            {currentUser.email}
                        </p>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-neutral">
                            <Phone size={16} className="text-primary" />
                            Phone
                        </label>
                        {isEditing ? (
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={isSaving}
                                className="w-full rounded-lg border border-primary/20 bg-background/50 px-4 py-2.5 text-sm font-medium text-neutral transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter your phone number"
                            />
                        ) : (
                            <p className="rounded-lg bg-background/50 px-4 py-2.5 text-sm font-medium text-neutral">
                                {formData.phone || "Not provided"}
                            </p>
                        )}
                    </div>

                    {/* Location */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-neutral">
                            <MapPin size={16} className="text-primary" />
                            Location
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                disabled={isSaving}
                                className="w-full rounded-lg border border-primary/20 bg-background/50 px-4 py-2.5 text-sm font-medium text-neutral transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter your location"
                            />
                        ) : (
                            <p className="rounded-lg bg-background/50 px-4 py-2.5 text-sm font-medium text-neutral">
                                {formData.location || "Not provided"}
                            </p>
                        )}
                    </div>

                    {/* Bio (Full width) */}
                    <div className="sm:col-span-2">
                        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-neutral">
                            <FileText size={16} className="text-primary" />
                            Bio
                        </label>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                disabled={isSaving}
                                rows={4}
                                className="w-full rounded-lg border border-primary/20 bg-background/50 px-4 py-2.5 text-sm font-medium text-neutral transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Tell us about yourself..."
                            />
                        ) : (
                            <p className="min-h-[100px] rounded-lg bg-background/50 px-4 py-2.5 text-sm font-medium text-neutral">
                                {formData.bio || "No bio provided"}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Account Information */}
            <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-extrabold text-neutral">Account Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-neutral">
                            <Shield size={16} className="text-primary" />
                            Account Role
                        </label>
                        <p className="rounded-lg bg-background/50 px-4 py-2.5 text-sm font-medium text-neutral">
                            {roleLabel}
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-neutral">
                            <Shield size={16} className="text-primary" />
                            Account Status
                        </label>
                        <p className="rounded-lg bg-background/50 px-4 py-2.5 text-sm font-medium text-neutral">
                            {currentUser.accountStatus || "Active"}
                        </p>
                    </div>

                    {currentUser.createdAt && (
                        <div className="sm:col-span-2">
                            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-neutral">
                                <Calendar size={16} className="text-primary" />
                                Member Since
                            </label>
                            <p className="rounded-lg bg-background/50 px-4 py-2.5 text-sm font-medium text-neutral">
                                {new Date(currentUser.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;

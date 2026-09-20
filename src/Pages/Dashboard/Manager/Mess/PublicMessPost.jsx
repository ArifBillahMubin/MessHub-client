import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import {
    Plus, PenLine, Trash2, Loader2, MapPin, Users,
    DollarSign, BedDouble, Utensils, FileText,
} from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import Loading from "../../../../components/Loading/Loading";

// ─── helpers ──────────────────────────────────────────────────────────────────

const foodLabel = { meal_system: "Meal System", self_cooking: "Self Cooking", both: "Both" };
const roomLabel  = { single: "Single", shared: "Shared", mixed: "Mixed" };

const StatusBadge = ({ status }) =>
    status === "published" ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-secondary">
            Public
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-tertiary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-tertiary">
            Draft
        </span>
    );

// ─── PostCard ─────────────────────────────────────────────────────────────────

const PostCard = ({ post, mess, onDelete, isDeleting }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col rounded-2xl border border-primary/10 bg-white shadow-sm transition hover:shadow-md">
            {/* Card image */}
            {post.images?.[0] ? (
                <div className="h-40 overflow-hidden rounded-t-2xl bg-gray-100">
                    <img src={post.images[0]} alt={post.title} className="h-full w-full object-cover" />
                </div>
            ) : (
                <div className="flex h-40 items-center justify-center rounded-t-2xl bg-background">
                    <FileText size={32} className="text-primary/30" strokeWidth={1.5} />
                </div>
            )}

            <div className="flex flex-1 flex-col p-5">
                {/* Status + date */}
                <div className="mb-3 flex items-center justify-between gap-2">
                    <StatusBadge status={post.status} />
                    <span className="text-[10px] text-neutral/40">
                        {new Date(post.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                </div>

                {/* Title */}
                <h3 className="mb-1 text-sm font-extrabold text-neutral line-clamp-2">
                    {post.title || <span className="text-neutral/30 italic">Untitled draft</span>}
                </h3>

                {/* Description */}
                {post.description && (
                    <p className="mb-3 text-xs text-neutral/60 line-clamp-2">{post.description}</p>
                )}

                {/* Meta chips */}
                <div className="mb-4 mt-auto flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-neutral/60">
                    {mess?.location?.address && (
                        <span className="flex items-center gap-1">
                            <MapPin size={11} className="text-primary/50" />
                            {mess.location.address}
                        </span>
                    )}
                    {post.advertisedSeats > 0 && (
                        <span className="flex items-center gap-1">
                            <Users size={11} className="text-primary/50" />
                            {post.advertisedSeats} seat{post.advertisedSeats !== 1 ? "s" : ""}
                        </span>
                    )}
                    {post.approximateMonthlyCost > 0 && (
                        <span className="flex items-center gap-1">
                            <DollarSign size={11} className="text-primary/50" />
                            ৳{post.approximateMonthlyCost.toLocaleString()}/mo
                        </span>
                    )}
                    {post.roomType && (
                        <span className="flex items-center gap-1">
                            <BedDouble size={11} className="text-primary/50" />
                            {roomLabel[post.roomType] || post.roomType}
                        </span>
                    )}
                    {post.foodSystem && (
                        <span className="flex items-center gap-1">
                            <Utensils size={11} className="text-primary/50" />
                            {foodLabel[post.foodSystem] || post.foodSystem}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t border-gray-100 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(`/dashboard/mess/public-post/edit/${post._id}`)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-primary/20 px-3 py-2 text-xs font-bold text-primary transition hover:bg-background"
                    >
                        <PenLine size={13} />
                        Modify
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(post._id)}
                        disabled={isDeleting}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
                    >
                        {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── PublicMessPost ────────────────────────────────────────────────────────────

const PublicMessPost = () => {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [deletingId, setDeletingId] = useState(null);

    // Get manager's mess first
    const { data: myMessData, isLoading: messLoading } = useQuery({
        queryKey: ["my-mess", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/my-mess?email=${user.email}`);
            return res.data;
        },
    });

    const mess = myMessData?.mess;

    // Fetch posts for this mess
    const { data: posts = [], isLoading: postsLoading, isError } = useQuery({
        queryKey: ["mess-posts", mess?._id],
        enabled: !!mess?._id,
        queryFn: async () => {
            const res = await axiosSecure.get(`/mess-posts/mess/${mess._id}`);
            return res.data;
        },
    });

    const handleDelete = async (postId) => {
        const confirmed = await Swal.fire({
            title: "Delete Public Post?",
            text: "Are you sure you want to delete this post?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
        });
        if (!confirmed.isConfirmed) return;

        setDeletingId(postId);
        try {
            await axiosSecure.delete(`/mess-posts/${postId}?email=${user.email}`);
            queryClient.invalidateQueries({ queryKey: ["mess-posts", mess?._id] });
            toast.success("Post deleted.", {
                style: { borderRadius: "12px", background: "#D5FBF9", color: "#173B3A", border: "1px solid #006B68", fontWeight: "600" },
                iconTheme: { primary: "#006B68", secondary: "#ffffff" },
            });
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to delete post.";
            toast.error(msg, {
                style: { borderRadius: "12px", background: "#ffffff", color: "#173B3A", border: "1px solid #FF8A00", fontWeight: "600" },
                iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
            });
        } finally {
            setDeletingId(null);
        }
    };

    if (messLoading) return <Loading />;

    return (
        <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-xl font-extrabold text-neutral">Public Mess Posts</h1>
                    <p className="mt-0.5 text-sm text-neutral/50">Create and manage your mess recruitment posts.</p>
                </div>
                <button
                    type="button"
                    onClick={() => navigate("/dashboard/mess/public-post/create")}
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
                >
                    <Plus size={16} />
                    Create Public Post
                </button>
            </div>

            {/* Loading list */}
            {postsLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={24} className="animate-spin text-primary/40" />
                </div>
            )}

            {/* Error */}
            {isError && !postsLoading && (
                <div className="flex flex-col items-center gap-3 py-20 text-center">
                    <p className="text-sm font-semibold text-neutral/60">Unable to load posts.</p>
                    <button
                        type="button"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["mess-posts", mess?._id] })}
                        className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary/90"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Empty state */}
            {!postsLoading && !isError && posts.length === 0 && (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-primary/20 bg-white py-20 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-primary">
                        <FileText size={26} strokeWidth={1.8} />
                    </span>
                    <div>
                        <p className="text-sm font-bold text-neutral">No public mess posts yet</p>
                        <p className="mt-1 text-xs text-neutral/50">Create your first recruitment post to attract new members.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/mess/public-post/create")}
                        className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
                    >
                        <Plus size={15} />
                        Create Public Post
                    </button>
                </div>
            )}

            {/* Post grid */}
            {!postsLoading && !isError && posts.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            mess={mess}
                            onDelete={handleDelete}
                            isDeleting={deletingId === post._id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PublicMessPost;

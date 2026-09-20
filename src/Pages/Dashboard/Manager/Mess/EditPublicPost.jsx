import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import PostForm from "./PostForm";
import Loading from "../../../../components/Loading/Loading";

const EditPublicPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Manager's mess
    const { data: myMessData, isLoading: messLoading } = useQuery({
        queryKey: ["my-mess", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/my-mess?email=${user.email}`);
            return res.data;
        },
    });

    const mess = myMessData?.mess;

    // Live member count
    const { data: membersData } = useQuery({
        queryKey: ["mess-members-summary", mess?._id],
        enabled: !!mess?._id,
        queryFn: async () => {
            const res = await axiosSecure.get(`/mess-members/${mess._id}?limit=1`);
            return res.data;
        },
    });

    const activeMembers = membersData?.summary?.totalMembers ?? 0;

    // Load the post to edit
    const { data: post, isLoading: postLoading, isError } = useQuery({
        queryKey: ["mess-post", id],
        enabled: !!id,
        queryFn: async () => {
            const res = await axiosSecure.get(`/mess-posts/${id}`);
            return res.data;
        },
    });

    const { mutate: updatePost, isPending } = useMutation({
        mutationFn: async ({ payload, status }) => {
            const res = await axiosSecure.patch(`/mess-posts/${id}`, {
                ...payload,
                email: user.email,
                status,
            });
            return res.data;
        },
        onSuccess: (_, { status }) => {
            queryClient.invalidateQueries({ queryKey: ["mess-posts", mess?._id] });
            queryClient.invalidateQueries({ queryKey: ["mess-post", id] });
            toast.success(status === "published" ? "Post published!" : "Changes saved.", {
                duration: 3000,
                style: { borderRadius: "12px", background: "#D5FBF9", color: "#173B3A", border: "1px solid #006B68", fontWeight: "600" },
                iconTheme: { primary: "#006B68", secondary: "#ffffff" },
            });
            navigate("/dashboard/mess/public-post");
        },
        onError: (err) => {
            const msg = err?.response?.data?.message || "Failed to update post. Please try again.";
            toast.error(msg, {
                duration: 4000,
                style: { borderRadius: "12px", background: "#ffffff", color: "#173B3A", border: "1px solid #FF8A00", fontWeight: "600" },
                iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
            });
        },
    });

    if (messLoading || postLoading) return <Loading />;

    if (isError || !post) {
        return (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
                <p className="text-sm font-semibold text-neutral/60">Post not found or could not be loaded.</p>
                <button
                    type="button"
                    onClick={() => navigate("/dashboard/mess/public-post")}
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary/90"
                >
                    Back to Posts
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-6 flex items-start gap-4">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard/mess/public-post")}
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-white text-primary transition hover:bg-primary hover:text-white"
                    aria-label="Back"
                >
                    <ArrowLeft size={17} />
                </button>
                <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                        Edit Post
                    </span>
                    <h1 className="mt-1.5 text-xl font-extrabold text-neutral">Edit Public Post</h1>
                    <p className="mt-0.5 text-sm text-neutral/50">Update your mess recruitment post.</p>
                </div>
            </div>

            <PostForm
                defaultValues={post}
                mess={mess}
                activeMembers={activeMembers}
                onSave={(payload, status) => updatePost({ payload, status })}
                isSaving={isPending}
            />
        </div>
    );
};

export default EditPublicPost;

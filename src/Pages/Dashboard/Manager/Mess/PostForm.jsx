import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
    Loader2, X, ImagePlus, Building2,
    MapPin, Users, DollarSign, FileText,
} from "lucide-react";
import { imageUpload } from "../../../../utils";

// ─── constants ────────────────────────────────────────────────────────────────

const FACILITIES = ["Wi-Fi", "Gas", "Electricity", "Water", "Dining", "Washing Machine", "Generator", "Parking"];
const MESS_TYPES  = [{ value: "student",    label: "Student" }, { value: "job_holder", label: "Job Holder" }, { value: "mixed", label: "Mixed" }];
const ROOM_TYPES  = [{ value: "single",     label: "Single"  }, { value: "shared",     label: "Shared"     }, { value: "mixed", label: "Mixed" }];
const FOOD_TYPES  = [{ value: "meal_system",label: "Meal System" }, { value: "self_cooking", label: "Self Cooking" }, { value: "both", label: "Both" }];

// ─── OptionChips ─────────────────────────────────────────────────────────────

const OptionChips = ({ options, value, onChange, multi = false }) => (
    <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
            const selected = multi ? (value || []).includes(opt.value) : value === opt.value;
            return (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                        if (multi) {
                            const current = value || [];
                            onChange(selected ? current.filter(v => v !== opt.value) : [...current, opt.value]);
                        } else {
                            onChange(selected ? "" : opt.value);
                        }
                    }}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        selected
                            ? "bg-primary text-white"
                            : "border border-gray-200 bg-white text-neutral/70 hover:border-primary/30 hover:text-primary"
                    }`}
                >
                    {opt.label}
                </button>
            );
        })}
    </div>
);

// ─── FacilityCheckboxes ───────────────────────────────────────────────────────

const FacilityCheckboxes = ({ value, onChange }) => (
    <div className="flex flex-wrap gap-2">
        {FACILITIES.map((f) => {
            const checked = (value || []).includes(f);
            return (
                <label key={f} className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                    checked ? "border-primary/30 bg-primary/5 text-primary" : "border-gray-200 text-neutral/60 hover:border-primary/20"
                }`}>
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onChange(checked ? (value || []).filter(v => v !== f) : [...(value || []), f])}
                        className="accent-primary"
                    />
                    {f}
                </label>
            );
        })}
    </div>
);

// ─── ImageUploader ────────────────────────────────────────────────────────────

const ImageUploader = ({ images, setImages }) => {
    const [uploading, setUploading] = useState(false);

    const handleFile = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const remaining = 4 - images.length;
        const toUpload = files.slice(0, remaining);

        setUploading(true);
        try {
            const urls = await Promise.all(toUpload.map(f => imageUpload(f)));
            const valid = urls.filter(Boolean);
            setImages(prev => [...prev, ...valid]);
        } catch {
            toast.error("Image upload failed. Please try again.", {
                style: { borderRadius: "12px", background: "#ffffff", color: "#173B3A", border: "1px solid #FF8A00", fontWeight: "600" },
                iconTheme: { primary: "#FF8A00", secondary: "#ffffff" },
            });
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    return (
        <div>
            <div className="mb-2 flex flex-wrap gap-3">
                {images.map((url, i) => (
                    <div key={i} className="relative h-24 w-24 overflow-hidden rounded-xl border border-gray-200">
                        <img src={url} alt={`img-${i}`} className="h-full w-full object-cover" />
                        <button
                            type="button"
                            onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                        >
                            <X size={11} />
                        </button>
                    </div>
                ))}

                {images.length < 4 && (
                    <label className={`flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-neutral/40 transition hover:border-primary/40 hover:text-primary ${uploading ? "pointer-events-none opacity-60" : "border-gray-300"}`}>
                        {uploading ? <Loader2 size={20} className="animate-spin text-primary" /> : <ImagePlus size={20} />}
                        <span className="text-[10px] font-semibold">{uploading ? "Uploading…" : "Add Photo"}</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
                    </label>
                )}
            </div>
            <p className="text-[10px] text-neutral/40">{images.length}/4 images · Published posts need at least 1 image</p>
        </div>
    );
};

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section = ({ icon: Icon, title, children }) => (
    <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-primary">
                <Icon size={16} strokeWidth={2.2} />
            </span>
            <h2 className="text-sm font-extrabold text-neutral">{title}</h2>
        </div>
        {children}
    </div>
);

const Field = ({ label, required, error, children, hint }) => (
    <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-neutral">
            {label} {required && <span className="text-tertiary">*</span>}
        </label>
        {children}
        {hint && <p className="mt-1 text-[10px] text-neutral/40">{hint}</p>}
        {error && <p className="mt-1 text-[10px] font-medium text-red-500">{error}</p>}
    </div>
);

const inputCls = "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-neutral outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10";

// ─── PostForm ─────────────────────────────────────────────────────────────────
// Shared by CreatePublicPost and EditPublicPost
// Props:
//   defaultValues  — pre-filled field values (for edit)
//   mess           — current mess document
//   activeMembers  — live count of active members
//   onSave(data, status) — called with form data + "draft" | "published"
//   isSaving       — disables submit buttons

const PostForm = ({ defaultValues = {}, mess, activeMembers, onSave, isSaving }) => {
    const navigate = useNavigate();
    const availableSeats = Math.max(0, (mess?.maxMembers || 0) - (activeMembers || 0));

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: defaultValues.title || "",
            description: defaultValues.description || "",
            advertisedSeats: defaultValues.advertisedSeats || "",
            approximateMonthlyCost: defaultValues.approximateMonthlyCost || "",
            rent: defaultValues.rent || "",
            additionalCost: defaultValues.additionalCost || "",
            costNote: defaultValues.costNote || "",
            additionalInformation: defaultValues.additionalInformation || "",
        },
    });

    // Controlled fields managed with useState for chip/checkbox UX
    const [messType, setMessType]               = useState(defaultValues.messType || "");
    const [roomType, setRoomType]               = useState(defaultValues.roomType || "");
    const [foodSystem, setFoodSystem]           = useState(defaultValues.foodSystem || "");
    const [facilities, setFacilities]           = useState(defaultValues.facilities || []);
    const [preferredMemberTypes, setPreferred]  = useState(defaultValues.preferredMemberTypes || []);
    const [images, setImages]                   = useState(defaultValues.images || []);

    const buildPayload = (data) => ({
        ...data,
        advertisedSeats: Number(data.advertisedSeats) || 0,
        approximateMonthlyCost: Number(data.approximateMonthlyCost) || 0,
        rent: Number(data.rent) || 0,
        additionalCost: Number(data.additionalCost) || 0,
        messType, roomType, foodSystem, facilities, preferredMemberTypes, images,
    });

    const submitDraft = handleSubmit((data) => onSave(buildPayload(data), "draft"));

    const submitPublish = handleSubmit((data) => {
        const payload = buildPayload(data);
        if (!data.title?.trim())       { toast.error("Title is required to publish."); return; }
        if (!data.description?.trim()) { toast.error("Description is required to publish."); return; }
        if (images.length === 0)       { toast.error("At least one image is required to publish."); return; }
        if (availableSeats <= 0)       { toast.error("No available seats. Cannot publish."); return; }
        const seats = Number(data.advertisedSeats);
        if (!seats || seats < 1 || seats > availableSeats) {
            toast.error(`Advertised seats must be between 1 and ${availableSeats}.`);
            return;
        }
        onSave(payload, "published");
    });

    return (
        <form className="space-y-5" noValidate>

            {/* Basic info */}
            <Section icon={FileText} title="Post Information">
                <div className="space-y-4">
                    <Field label="Post Title" required error={errors.title?.message}>
                        <input {...register("title", { maxLength: { value: 80, message: "Max 80 characters." } })}
                            type="text" placeholder="e.g. Bachelor's Mess in Mirpur-10" className={inputCls} />
                    </Field>
                    <Field label="Description" required error={errors.description?.message}>
                        <textarea {...register("description", { maxLength: { value: 600, message: "Max 600 characters." } })}
                            rows={4} placeholder="Describe your mess, rules, environment…"
                            className={`${inputCls} resize-none`} />
                    </Field>
                </div>
            </Section>

            {/* Mess details (read-only) */}
            <Section icon={Building2} title="Mess Details">
                <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-background/60 p-4 sm:grid-cols-4">
                    {[
                        { label: "Mess Name",       value: mess?.name || "—" },
                        { label: "Max Members",     value: mess?.maxMembers ?? "—" },
                        { label: "Active Members",  value: activeMembers ?? "—" },
                        { label: "Available Seats", value: availableSeats, highlight: availableSeats > 0 },
                    ].map(({ label, value, highlight }) => (
                        <div key={label}>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">{label}</p>
                            <p className={`mt-0.5 text-sm font-extrabold ${highlight ? "text-secondary" : "text-neutral"}`}>{value}</p>
                        </div>
                    ))}
                </div>

                {mess?.location?.address && (
                    <div className="mb-4 flex items-center gap-2 text-xs text-neutral/60">
                        <MapPin size={13} className="shrink-0 text-primary/50" />
                        {[mess.location.address, mess.location.area, mess.location.city].filter(Boolean).join(", ")}
                    </div>
                )}

                <Field
                    label="Seats to Advertise"
                    required
                    hint={availableSeats > 0 ? `Maximum allowed: ${availableSeats}` : "No available seats."}
                    error={errors.advertisedSeats?.message}
                >
                    <input
                        {...register("advertisedSeats", {
                            min: { value: 1, message: "Must be at least 1." },
                            max: { value: availableSeats, message: `Cannot exceed available seats (${availableSeats}).` },
                            validate: v => !v || Number(v) <= availableSeats || `Max ${availableSeats} seats available.`,
                        })}
                        type="number"
                        min={1}
                        max={availableSeats}
                        disabled={availableSeats <= 0}
                        placeholder={availableSeats > 0 ? `1 – ${availableSeats}` : "No seats available"}
                        className={`${inputCls} ${availableSeats <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                </Field>
            </Section>

            {/* Type & preferences */}
            <Section icon={Users} title="Mess Type & Preferences">
                <div className="space-y-4">
                    <Field label="Mess Type">
                        <OptionChips options={MESS_TYPES} value={messType} onChange={setMessType} />
                    </Field>
                    <Field label="Room Type">
                        <OptionChips options={ROOM_TYPES} value={roomType} onChange={setRoomType} />
                    </Field>
                    <Field label="Food System">
                        <OptionChips options={FOOD_TYPES} value={foodSystem} onChange={setFoodSystem} />
                    </Field>
                    <Field label="Facilities">
                        <FacilityCheckboxes value={facilities} onChange={setFacilities} />
                    </Field>
                    <Field label="Preferred Member Types">
                        <OptionChips
                            options={[{ value: "Student", label: "Student" }, { value: "Job Holder", label: "Job Holder" }]}
                            value={preferredMemberTypes}
                            onChange={setPreferred}
                            multi
                        />
                    </Field>
                </div>
            </Section>

            {/* Cost */}
            <Section icon={DollarSign} title="Monthly Cost">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Approximate Monthly Cost (BDT)" error={errors.approximateMonthlyCost?.message}>
                        <input {...register("approximateMonthlyCost", { min: { value: 0, message: "Cannot be negative." } })}
                            type="number" min={0} placeholder="e.g. 5000" className={inputCls} />
                    </Field>
                    <Field label="Rent / Seat (BDT)" error={errors.rent?.message}>
                        <input {...register("rent", { min: { value: 0, message: "Cannot be negative." } })}
                            type="number" min={0} placeholder="e.g. 3500" className={inputCls} />
                    </Field>
                    <Field label="Additional Cost (BDT)" error={errors.additionalCost?.message}>
                        <input {...register("additionalCost", { min: { value: 0, message: "Cannot be negative." } })}
                            type="number" min={0} placeholder="e.g. 500" className={inputCls} />
                    </Field>
                    <Field label="Cost Note">
                        <input {...register("costNote")} type="text" placeholder="e.g. Includes gas and electricity" className={inputCls} />
                    </Field>
                </div>
            </Section>

            {/* Images */}
            <Section icon={ImagePlus} title="Photos">
                <ImageUploader images={images} setImages={setImages} />
            </Section>

            {/* Additional info */}
            <Section icon={FileText} title="Additional Information">
                <Field label="Additional Information" hint="Optional — any other details for applicants.">
                    <textarea {...register("additionalInformation")} rows={3}
                        placeholder="e.g. No pets, male only, must be respectful of quiet hours…"
                        className={`${inputCls} resize-none`} />
                </Field>
            </Section>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard/mess/public-post")}
                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-neutral transition hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={submitDraft}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-xl border border-primary/30 px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-background disabled:opacity-60"
                >
                    {isSaving ? <Loader2 size={15} className="animate-spin" /> : null}
                    Save Draft
                </button>
                <button
                    type="button"
                    onClick={submitPublish}
                    disabled={isSaving || availableSeats <= 0}
                    className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSaving ? <Loader2 size={15} className="animate-spin" /> : null}
                    Publish Post
                </button>
            </div>
        </form>
    );
};

export default PostForm;

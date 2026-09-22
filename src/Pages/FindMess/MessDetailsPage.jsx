import { useState, useRef } from "react";
import { useParams, useNavigate, NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import {
    ArrowLeft, MapPin, Users, BedDouble, Utensils,
    Wifi, Zap, Flame, Droplets, ChefHat,
    WashingMachine, Car, Cog, CheckCircle2,
    ChevronRight, CalendarDays, Home,
    Phone, Mail, User, KeyRound, ListOrdered,
} from "lucide-react";
import Loading from "../../components/Loading/Loading";

// ─── constants ────────────────────────────────────────────────────────────────

const ROOM_LABEL = { single: "Single Room", shared: "Shared Room", mixed: "Mixed" };
const FOOD_LABEL = { meal_system: "Meal System", self_cooking: "Self Cooking", both: "Both" };
const MESS_LABEL = { student: "Student", job_holder: "Job Holder", mixed: "Mixed" };

const FACILITY_ICONS = {
    "Wi-Fi":           <Wifi size={16} />,
    "Gas":             <Flame size={16} />,
    "Electricity":     <Zap size={16} />,
    "Water":           <Droplets size={16} />,
    "Dining":          <ChefHat size={16} />,
    "Washing Machine": <WashingMachine size={16} />,
    "Generator":       <Cog size={16} />,
    "Parking":         <Car size={16} />,
};

// Leaflet icon (same fix used throughout the project)
const mapIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const publicAxios = axios.create({ baseURL: import.meta.env.VITE_api_url });

// ─── Image Gallery ────────────────────────────────────────────────────────────

const ImageGallery = ({ images }) => {
    const [activeIdx, setActiveIdx] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="flex h-72 items-center justify-center rounded-2xl bg-background sm:h-96">
                <BedDouble size={48} className="text-primary/15" strokeWidth={1} />
            </div>
        );
    }

    if (images.length === 1) {
        return (
            <div className="overflow-hidden rounded-2xl bg-gray-100">
                <img src={images[0]} alt="Mess" className="h-72 w-full object-cover sm:h-96" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden" style={{ height: "420px" }}>
            {/* Main image */}
            <div
                className="col-span-3 row-span-2 cursor-pointer overflow-hidden bg-gray-100"
                onClick={() => setActiveIdx(0)}
            >
                <img
                    src={images[activeIdx] || images[0]}
                    alt="Main"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
            </div>

            {/* Thumbnails */}
            {images.slice(1, 3).map((img, i) => (
                <div
                    key={i}
                    className="relative cursor-pointer overflow-hidden bg-gray-100"
                    onClick={() => setActiveIdx(i + 1)}
                >
                    <img src={img} alt={`View ${i + 2}`} className="h-full w-full object-cover hover:opacity-90 transition" />
                </div>
            ))}

            {/* 4th slot: image or "+N more" */}
            {images.length >= 4 && (
                <div className="relative cursor-pointer overflow-hidden bg-gray-100" onClick={() => setActiveIdx(3)}>
                    <img src={images[3]} alt="View 4" className="h-full w-full object-cover" />
                    {images.length > 4 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="text-sm font-bold text-white">+{images.length - 4} more</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section = ({ title, children }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-extrabold text-neutral">{title}</h2>
        {children}
    </div>
);

const DetailRow = ({ label, value }) => (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-100 last:border-0">
        <span className="text-sm text-neutral/50">{label}</span>
        <span className="text-sm font-semibold text-neutral text-right">{value}</span>
    </div>
);

// ─── MessDetailsPage ──────────────────────────────────────────────────────────

const MessDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    // ref to scroll to the contact section when "Contact Manager" is clicked
    const contactRef = useRef(null);

    const { data: post, isLoading, isError } = useQuery({
        queryKey: ["public-mess-post-detail", id],
        queryFn: async () => {
            const res = await publicAxios.get(`/public-mess-posts/${id}`);
            return res.data;
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 2,
    });

    if (isLoading) return <Loading />;

    if (isError || !post) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background text-primary">
                    <Home size={28} strokeWidth={1.6} />
                </span>
                <div>
                    <p className="text-xl font-extrabold text-neutral">Mess not found</p>
                    <p className="mt-1.5 text-sm text-neutral/50">
                        This mess may no longer be available or the link may be incorrect.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => navigate("/find-mess")}
                    className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
                >
                    <ArrowLeft size={15} />
                    Back to Find Mess
                </button>
            </div>
        );
    }

    const location = post.mess?.location;
    const locationStr = [location?.address, location?.area, location?.city].filter(Boolean).join(", ");
    const hasCoords = location?.latitude != null && location?.longitude != null;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs font-medium text-neutral/50">
                    <NavLink to="/" className="hover:text-primary transition">Home</NavLink>
                    <ChevronRight size={12} className="text-neutral/30" />
                    <NavLink to="/find-mess" className="hover:text-primary transition">Find a Mess</NavLink>
                    {location?.city && (
                        <>
                            <ChevronRight size={12} className="text-neutral/30" />
                            <span>{location.city}</span>
                        </>
                    )}
                    {location?.area && (
                        <>
                            <ChevronRight size={12} className="text-neutral/30" />
                            <span>{location.area}</span>
                        </>
                    )}
                    <ChevronRight size={12} className="text-neutral/30" />
                    <span className="text-neutral/80 font-semibold truncate max-w-[160px]">{post.mess?.name || post.title}</span>
                </nav>

                {/* Back button */}
                <button
                    type="button"
                    onClick={() => navigate("/find-mess")}
                    className="mb-5 flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
                >
                    <ArrowLeft size={15} />
                    Back to Find Mess
                </button>

                {/* Image gallery */}
                <ImageGallery images={post.images} />

                {/* Title + location + tags */}
                <div className="mt-6 mb-6">
                    <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-primary/60">
                        {post.mess?.name}
                    </p>
                    <h1 className="text-2xl font-extrabold text-neutral sm:text-3xl lg:text-4xl">
                        {post.title}
                    </h1>
                    {locationStr && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-base text-neutral/60">
                            <MapPin size={16} className="shrink-0 text-primary/50" />
                            <span>{locationStr}</span>
                        </div>
                    )}

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {post.messType && (
                            <span className="rounded-xl bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                                {MESS_LABEL[post.messType] || post.messType}
                            </span>
                        )}
                        {post.roomType && (
                            <span className="flex items-center gap-1 rounded-xl bg-background px-3 py-1 text-xs font-bold text-neutral/70 border border-gray-200">
                                <BedDouble size={12} />
                                {ROOM_LABEL[post.roomType] || post.roomType}
                            </span>
                        )}
                        {post.foodSystem && (
                            <span className="flex items-center gap-1 rounded-xl bg-background px-3 py-1 text-xs font-bold text-neutral/70 border border-gray-200">
                                <Utensils size={12} />
                                {FOOD_LABEL[post.foodSystem] || post.foodSystem}
                            </span>
                        )}
                    </div>
                </div>

                {/* ─── Main two-column area ─────────────────────────────── */}
                <div className="">

                    {/* LEFT: main content */}
                    <div className="flex flex-1 min-w-0 flex-col gap-5">

                        {/* About */}
                        {(post.description || post.additionalInformation) && (
                            <Section title="About This Mess">
                                {post.description && (
                                    <p className="text-sm leading-relaxed text-neutral/70 whitespace-pre-line">
                                        {post.description}
                                    </p>
                                )}
                                {post.additionalInformation && (
                                    <div className={post.description ? "mt-4 border-t border-gray-100 pt-4" : ""}>
                                        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-neutral/40">
                                            Additional Information
                                        </p>
                                        <p className="text-sm leading-relaxed text-neutral/70 whitespace-pre-line">
                                            {post.additionalInformation}
                                        </p>
                                    </div>
                                )}
                            </Section>
                        )}

                        {/* Mess details grid */}
                        <Section title="Mess Details">
                            <div className="divide-y divide-gray-100">
                                {post.messType   && <DetailRow label="Mess Type"      value={MESS_LABEL[post.messType]   || post.messType}   />}
                                {post.roomType   && <DetailRow label="Room Type"      value={ROOM_LABEL[post.roomType]   || post.roomType}   />}
                                {post.foodSystem && <DetailRow label="Food System"    value={FOOD_LABEL[post.foodSystem] || post.foodSystem} />}
                                <DetailRow
                                    label="Available Seats"
                                    value={
                                        <span className="font-extrabold text-secondary">
                                            {post.advertisedSeats} Seat{post.advertisedSeats !== 1 ? "s" : ""}
                                        </span>
                                    }
                                />
                                {post.approximateMonthlyCost > 0 && (
                                    <DetailRow
                                        label="Approx. Monthly Cost"
                                        value={`৳${post.approximateMonthlyCost.toLocaleString()}`}
                                    />
                                )}
                                {post.preferredMemberTypes?.length > 0 && (
                                    <DetailRow
                                        label="Preferred Members"
                                        value={post.preferredMemberTypes.join(", ")}
                                    />
                                )}
                                <DetailRow
                                    label="Posted"
                                    value={new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                                />
                            </div>
                        </Section>

                        {/* Facilities */}
                        {post.facilities?.length > 0 && (
                            <Section title="What's Included">
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                    {post.facilities.map(f => (
                                        <div key={f} className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-background/50 px-3 py-2.5">
                                            <span className="text-primary/70">{FACILITY_ICONS[f] || <CheckCircle2 size={16} />}</span>
                                            <span className="text-xs font-semibold text-neutral/70">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Monthly cost breakdown */}
                        {(post.rent > 0 || post.additionalCost > 0 || post.approximateMonthlyCost > 0) && (
                            <Section title="Monthly Cost">
                                <div className="space-y-0 divide-y divide-gray-100">
                                    {post.rent > 0 && (
                                        <div className="flex justify-between py-2.5">
                                            <span className="text-sm text-neutral/60">Rent / Seat</span>
                                            <span className="text-sm font-semibold text-neutral">৳{post.rent.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {post.additionalCost > 0 && (
                                        <div className="flex justify-between py-2.5">
                                            <span className="text-sm text-neutral/60">Additional Cost</span>
                                            <span className="text-sm font-semibold text-neutral">৳{post.additionalCost.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {post.approximateMonthlyCost > 0 && (
                                        <div className="flex justify-between py-3">
                                            <span className="text-sm font-extrabold text-neutral">Approx. Monthly Total</span>
                                            <span className="text-base font-extrabold text-primary">৳{post.approximateMonthlyCost.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                                {post.costNote && (
                                    <p className="mt-3 rounded-xl bg-tertiary/5 border border-tertiary/15 px-3 py-2 text-xs text-neutral/60">
                                        {post.costNote}
                                    </p>
                                )}
                            </Section>
                        )}

                        {/* Location map */}
                        {hasCoords && (
                            <Section title="Location">
                                {locationStr && (
                                    <div className="mb-3 flex items-center gap-1.5 text-sm text-neutral/60">
                                        <MapPin size={14} className="shrink-0 text-primary/50" />
                                        {locationStr}
                                    </div>
                                )}
                                <div className="h-56 overflow-hidden rounded-xl border border-gray-200 sm:h-64">
                                    <MapContainer
                                        center={[location.latitude, location.longitude]}
                                        zoom={15}
                                        style={{ height: "100%", width: "100%" }}
                                        scrollWheelZoom={false}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker position={[location.latitude, location.longitude]} icon={mapIcon}>
                                            <Popup>
                                                <p className="font-bold text-sm text-neutral">{post.mess?.name}</p>
                                                {locationStr && <p className="text-xs text-neutral/60 mt-0.5">{locationStr}</p>}
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                            </Section>
                        )}

                        {/* Preferred member types */}
                        {post.preferredMemberTypes?.length > 0 && (
                            <Section title="Looking For">
                                <div className="flex flex-wrap gap-2">
                                    {post.preferredMemberTypes.map(t => (
                                        <span key={t} className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* ── Contact Mess Management ─────────────────── */}
                        <div ref={contactRef} id="contact-manager" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-1 text-lg font-extrabold text-neutral">Contact Mess Management</h2>
                            <p className="mb-5 text-sm text-neutral/55">
                                You cannot join this mess directly from this page. Please contact the mess management to confirm availability and get the <span className="font-semibold text-neutral/80">Mess Code</span> required to join.
                            </p>

                            {/* Manager card */}
                            {post.manager ? (
                                <div className="rounded-xl border border-primary/10 bg-background/60 p-4">
                                    <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-neutral/40">Mess Manager</p>
                                    <div className="flex items-center gap-3">
                                        {post.manager.photoURL ? (
                                            <img
                                                src={post.manager.photoURL}
                                                alt={post.manager.name}
                                                referrerPolicy="no-referrer"
                                                className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/15"
                                            />
                                        ) : (
                                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <User size={22} />
                                            </span>
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-base font-extrabold text-neutral truncate">
                                                {post.manager.name || "Mess Manager"}
                                            </p>
                                            <p className="text-xs text-primary/60 font-semibold">Mess Manager</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2.5">
                                        {post.manager.phone && (
                                            <a
                                                href={`tel:${post.manager.phone}`}
                                                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:bg-background"
                                            >
                                                <Phone size={15} className="shrink-0 text-primary/60" />
                                                <span>{post.manager.phone}</span>
                                            </a>
                                        )}
                                        {post.manager.email && (
                                            <a
                                                href={`mailto:${post.manager.email}`}
                                                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:bg-background"
                                            >
                                                <Mail size={15} className="shrink-0 text-primary/60" />
                                                <span className="truncate">{post.manager.email}</span>
                                            </a>
                                        )}
                                    </div>

                                    <p className="mt-4 text-xs text-neutral/50 leading-relaxed">
                                        Contact the manager via phone or email, confirm availability, and ask for the <span className="font-semibold text-neutral/70">Mess Code</span> to join this mess.
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-xl border border-gray-200 bg-background/50 px-4 py-3 text-sm text-neutral/50">
                                    Manager contact information is not available for this mess.
                                </div>
                            )}
                        </div>

                        {/* ── How to Join ──────────────────────────────── */}
                        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <ListOrdered size={18} className="text-primary" />
                                <h2 className="text-base font-extrabold text-neutral">How to Join This Mess</h2>
                            </div>
                            <ol className="space-y-3">
                                {[
                                    { step: "Contact the Mess Manager via phone or email above.", icon: <Phone size={14} /> },
                                    { step: "Ask about availability and confirm the Mess Code.", icon: <KeyRound size={14} /> },
                                    { step: "Go to Mess Setup in your dashboard.", icon: <Home size={14} /> },
                                    { step: "Enter the Mess Code using the Join Mess option.", icon: <KeyRound size={14} /> },
                                    { step: "Submit your Join Request and wait for manager approval.", icon: <CheckCircle2 size={14} /> },
                                ].map(({ step, icon }, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white mt-0.5">
                                            {i + 1}
                                        </span>
                                        <p className="text-sm text-neutral/70 leading-relaxed">{step}</p>
                                    </li>
                                ))}
                            </ol>

                            <button
                                type="button"
                                onClick={() => navigate("/dashboard/join-mess")}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary/90 hover:shadow-md sm:w-auto sm:px-8"
                            >
                                <KeyRound size={15} />
                                Go to Mess Setup
                            </button>
                        </div>
                    </div>

                    
                </div>
            </div>

            {/* Mobile sticky bottom bar */}
            <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm lg:hidden">
                <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        {post.approximateMonthlyCost > 0 && (
                            <p className="text-base font-extrabold text-neutral">৳{post.approximateMonthlyCost.toLocaleString()}<span className="ml-1 text-xs font-normal text-neutral/50">/mo</span></p>
                        )}
                        <p className="text-xs text-secondary font-semibold">{post.advertisedSeats} Seat{post.advertisedSeats !== 1 ? "s" : ""} Available</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => contactRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                        className="shrink-0 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
                    >
                        Contact Manager
                    </button>
                </div>
            </div>

            {/* Spacer so content doesn't hide under mobile sticky bar */}
            <div className="h-20 lg:hidden" />
        </div>
    );
};

export default MessDetailsPage;

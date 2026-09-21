import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import {
    Search, X, SlidersHorizontal, ArrowLeft,
    Loader2, MapPin, BedDouble, Utensils, Users, LocateFixed,
} from "lucide-react";
import useUserLocation from "../../hooks/useUserLocation";
import { isNearby } from "../../utils/haversine";

// Reuse same Leaflet icon fix
const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});
const selectedIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [30, 49], iconAnchor: [15, 49], popupAnchor: [1, -40], shadowSize: [49, 49],
});

// User location marker — distinct pulsing blue dot
const userLocationIcon = L.divIcon({
    html: `
        <div style="position:relative;width:22px;height:22px">
            <div style="position:absolute;inset:0;border-radius:50%;background:rgba(0,107,104,0.18);animation:pulse 1.8s ease-in-out infinite;"></div>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:#006B68;border:2.5px solid #fff;box-shadow:0 1px 6px rgba(0,107,104,0.5);"></div>
        </div>
        <style>@keyframes pulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.7);opacity:.3}}</style>
    `,
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
});

const DHAKA = [23.8103, 90.4125];

const MESS_TYPES  = [{ value: "", label: "All Types" }, { value: "student", label: "Student" }, { value: "job_holder", label: "Job Holder" }, { value: "mixed", label: "Mixed" }];
const ROOM_TYPES  = [{ value: "", label: "All Rooms" }, { value: "single", label: "Single Room" }, { value: "shared", label: "Shared Room" }, { value: "mixed", label: "Mixed" }];
const FOOD_TYPES  = [{ value: "", label: "All Food" }, { value: "meal_system", label: "Meal System" }, { value: "self_cooking", label: "Self Cooking" }, { value: "both", label: "Both" }];
const ALL_FACILITIES = ["Wi-Fi", "Gas", "Electricity", "Water", "Dining", "Washing Machine", "Generator", "Parking"];
const PREFERRED_TYPES = [{ value: "", label: "Any Type" }, { value: "Student", label: "Student" }, { value: "Job Holder", label: "Job Holder" }];

const ROOM_LABEL = { single: "Single Room", shared: "Shared Room", mixed: "Mixed" };
const FOOD_LABEL = { meal_system: "Meal System", self_cooking: "Self Cooking", both: "Both" };

const publicAxios = axios.create({ baseURL: import.meta.env.VITE_api_url });

// Fits map bounds to all valid posts (+ user location), or flies to selected
const MapBoundsController = ({ posts, selectedId, userLocation }) => {
    const map = useMap();
    const prevSelected = useRef(null);

    useEffect(() => {
        if (selectedId && selectedId !== prevSelected.current) {
            prevSelected.current = selectedId;
            const post = posts.find(p => p._id === selectedId);
            const lat = post?.mess?.location?.latitude;
            const lng = post?.mess?.location?.longitude;
            if (lat != null && lng != null) {
                map.flyTo([lat, lng], 16, { animate: true, duration: 0.7 });
                return;
            }
        }

        if (!selectedId) {
            const valid = posts.filter(p => p.mess?.location?.latitude != null && p.mess?.location?.longitude != null);
            const points = valid.map(p => [p.mess.location.latitude, p.mess.location.longitude]);
            if (userLocation) points.push([userLocation.lat, userLocation.lng]);
            if (points.length === 0) {
                if (userLocation) map.setView([userLocation.lat, userLocation.lng], 14);
                return;
            }
            if (points.length === 1) { map.setView(points[0], 15); return; }
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posts, selectedId, userLocation]);

    return null;
};

const FilterSelect = ({ value, onChange, options }) => (
    <select value={value} onChange={e => onChange(e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-neutral outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
);

// ─── FindMessMapPage ──────────────────────────────────────────────────────────

const FindMessMapPage = () => {
    const navigate = useNavigate();
    const markersRef = useRef({});

    const [searchInput, setSearchInput] = useState("");
    const [q, setQ]             = useState("");
    const [messType, setMessType] = useState("");
    const [roomType, setRoomType] = useState("");
    const [foodSystem, setFoodSystem] = useState("");
    const [minCost, setMinCost]   = useState("");
    const [maxCost, setMaxCost]   = useState("");
    const [moreOpen, setMoreOpen] = useState(false);
    const [facilities, setFacilities]       = useState([]);
    const [minSeats, setMinSeats]           = useState("");
    const [preferredMemberType, setPreferred] = useState("");
    const [selectedId, setSelectedId]       = useState(null);

    // User location — client-side only, never saved to backend
    const { userLocation } = useUserLocation();

    const debounceRef = useRef(null);
    const handleSearchInput = (val) => {
        setSearchInput(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => setQ(val), 400);
    };

    const params = new URLSearchParams();
    if (q)                   params.set("q", q);
    if (messType)            params.set("messType", messType);
    if (roomType)            params.set("roomType", roomType);
    if (foodSystem)          params.set("foodSystem", foodSystem);
    if (minCost)             params.set("minCost", minCost);
    if (maxCost)             params.set("maxCost", maxCost);
    if (minSeats)            params.set("minSeats", minSeats);
    if (facilities.length)   params.set("facilities", facilities.join(","));
    if (preferredMemberType) params.set("preferredMemberType", preferredMemberType);
    params.set("limit", "100"); // map page loads more results at once

    const { data, isLoading } = useQuery({
        queryKey: ["map-public-mess-posts", q, messType, roomType, foodSystem, minCost, maxCost, minSeats, facilities.join(","), preferredMemberType],
        queryFn: async () => {
            const res = await publicAxios.get(`/public-mess-posts?${params}`);
            return res.data;
        },
        keepPreviousData: true,
    });

    const posts = data?.data ?? [];

    // nearbyCount — for the header badge only; does NOT filter markers
    const nearbyCount = userLocation
        ? posts.filter(p => isNearby(
            userLocation.lat, userLocation.lng,
            p.mess?.location?.latitude,
            p.mess?.location?.longitude,
            2
          )).length
        : 0;

    useEffect(() => { setSelectedId(null); }, [q, messType, roomType, foodSystem, minCost, maxCost, minSeats, facilities.join(","), preferredMemberType]);

    const handleMarkerClick = useCallback((postId) => {
        setSelectedId(postId);
        if (markersRef.current[postId]) markersRef.current[postId].openPopup();
    }, []);

    const toggleFacility = (f) => setFacilities(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

    const clearFilters = () => {
        setQ(""); setSearchInput(""); setMessType(""); setRoomType("");
        setFoodSystem(""); setMinCost(""); setMaxCost(""); setFacilities([]); setMinSeats(""); setPreferred("");
    };

    const moreFilterCount = [minSeats, preferredMemberType, facilities.length ? "f" : ""].filter(Boolean).length;
    const hasFilters = q || messType || roomType || foodSystem || minCost || maxCost || minSeats || facilities.length || preferredMemberType;



    return (
        <div className="flex h-screen flex-col overflow-hidden bg-white">

            {/* ── Top bar ─────────────────────────────────────────────────── */}
            <div className="shrink-0 border-b border-gray-100 bg-white px-4 py-3 shadow-sm sm:px-6">
                <div className="flex flex-col gap-2.5">
                    {/* Header row */}
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => navigate("/find-mess")}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/15 text-primary transition hover:bg-primary hover:text-white">
                            <ArrowLeft size={16} />
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-lg font-extrabold text-neutral leading-tight sm:text-xl">Find Messes on Map</h1>
                            <p className="text-xs text-neutral/50">Explore available messes by location and find a suitable place.</p>
                        </div>
                        {isLoading && <Loader2 size={16} className="ml-auto animate-spin text-primary/40 shrink-0" />}
                        {!isLoading && (
                            <div className="ml-auto flex shrink-0 items-center gap-2">
                                {userLocation && nearbyCount > 0 && (
                                    <span className="flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-bold text-secondary">
                                        <LocateFixed size={12} />
                                        {nearbyCount} within 2 km
                                    </span>
                                )}
                                {posts.length > 0 && (
                                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                                        {posts.length} mess{posts.length !== 1 ? "es" : ""}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Filters row */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Search */}
                        <div className="flex min-w-[180px] flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 transition focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                            <Search size={13} className="shrink-0 text-gray-400" />
                            <input type="text" value={searchInput} onChange={e => handleSearchInput(e.target.value)}
                                placeholder="Area or mess name…"
                                className="w-full bg-transparent py-2 text-xs text-neutral outline-none placeholder:text-gray-400" />
                            {searchInput && <button type="button" onClick={() => handleSearchInput("")}><X size={12} className="text-gray-400" /></button>}
                        </div>

                        <FilterSelect value={messType}  onChange={setMessType}  options={MESS_TYPES}  />
                        <FilterSelect value={roomType}  onChange={setRoomType}  options={ROOM_TYPES}  />
                        <FilterSelect value={foodSystem} onChange={setFoodSystem} options={FOOD_TYPES} />

                        <div className="flex items-center gap-1">
                            <input type="number" min={0} value={minCost} onChange={e => setMinCost(e.target.value)} placeholder="Min ৳"
                                className="w-16 rounded-xl border border-gray-200 bg-white px-2 py-2 text-xs outline-none focus:border-primary" />
                            <span className="text-xs text-neutral/30">–</span>
                            <input type="number" min={0} value={maxCost} onChange={e => setMaxCost(e.target.value)} placeholder="Max ৳"
                                className="w-16 rounded-xl border border-gray-200 bg-white px-2 py-2 text-xs outline-none focus:border-primary" />
                        </div>

                        <button type="button" onClick={() => setMoreOpen(v => !v)}
                            className={`flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold transition ${moreFilterCount > 0 ? "border-primary bg-primary/5 text-primary" : "border-gray-200 bg-white text-neutral/70 hover:border-primary/30 hover:text-primary"}`}>
                            <SlidersHorizontal size={12} />
                            More
                            {moreFilterCount > 0 && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] text-white">{moreFilterCount}</span>}
                        </button>

                        {hasFilters && (
                            <button type="button" onClick={clearFilters}
                                className="flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-2.5 py-2 text-xs font-bold text-red-500 hover:bg-red-100">
                                <X size={11} /> Clear
                            </button>
                        )}
                    </div>

                    {/* More Filters */}
                    {moreOpen && (
                        <div className="rounded-xl border border-primary/10 bg-background/50 p-3">
                            <div className="flex flex-wrap gap-4 items-start">
                                <div>
                                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-neutral/40">Facilities</p>
                                    <div className="flex flex-wrap gap-1">
                                        {ALL_FACILITIES.map(f => (
                                            <button key={f} type="button" onClick={() => toggleFacility(f)}
                                                className={`rounded-lg px-2 py-1 text-[10px] font-bold transition ${facilities.includes(f) ? "bg-primary text-white" : "border border-gray-200 bg-white text-neutral/60 hover:border-primary/30 hover:text-primary"}`}>
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div>
                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-neutral/40">Min Seats</p>
                                        <input type="number" min={1} value={minSeats} onChange={e => setMinSeats(e.target.value)} placeholder="e.g. 2"
                                            className="w-20 rounded-xl border border-gray-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-primary" />
                                    </div>
                                    <div>
                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-neutral/40">Preferred</p>
                                        <FilterSelect value={preferredMemberType} onChange={setPreferred} options={PREFERRED_TYPES} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Map ─────────────────────────────────────────────────────── */}
            <div className="flex-1 relative overflow-hidden">
                <MapContainer center={DHAKA} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapBoundsController posts={posts} selectedId={selectedId} userLocation={userLocation} />

                    {/* 2 km radius circle — only when location is available */}
                    {userLocation && (
                        <Circle
                            center={[userLocation.lat, userLocation.lng]}
                            radius={2000}
                            pathOptions={{ color: "#006B68", fillColor: "#006B68", fillOpacity: 0.06, weight: 1.5, dashArray: "5 4" }}
                        />
                    )}

                    {/* ALL mess markers — none are hidden; isNearby only affects popup badge */}
                    {posts.map(post => {
                        const lat = post.mess?.location?.latitude;
                        const lng = post.mess?.location?.longitude;
                        if (lat == null || lng == null) return null;
                        const isSelected = post._id === selectedId;
                        const near = userLocation
                            ? isNearby(userLocation.lat, userLocation.lng, lat, lng, 2)
                            : false;

                        return (
                            <Marker
                                key={post._id}
                                position={[lat, lng]}
                                icon={isSelected ? selectedIcon : defaultIcon}
                                ref={el => { if (el) markersRef.current[post._id] = el; }}
                                eventHandlers={{ click: () => handleMarkerClick(post._id) }}
                            >
                                <Popup maxWidth={280}>
                                    <div className="w-60">
                                        {near && (
                                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#D5FBF9", color: "#006B68", borderRadius: "999px", padding: "2px 8px", fontSize: "10px", fontWeight: "700", marginBottom: "4px" }}>
                                                ● Within 2 km
                                            </span>
                                        )}

                                        {/* Post image */}
                                        {post.images?.[0] && (
                                            <div className="mb-3 -mx-3 -mt-3 h-32 overflow-hidden rounded-t-lg">
                                                <img src={post.images[0]} alt={post.title} className="h-full w-full object-cover" />
                                            </div>
                                        )}

                                        {/* Mess name */}
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-primary/60">{post.mess?.name}</p>

                                        {/* Title */}
                                        <p className="mt-0.5 font-bold text-sm text-neutral leading-snug line-clamp-2">{post.title || "Untitled"}</p>

                                        {/* Location */}
                                        {post.mess?.location?.address && (
                                            <div className="mt-1.5 flex items-start gap-1 text-xs text-neutral/60">
                                                <MapPin size={11} className="shrink-0 mt-0.5 text-primary/50" />
                                                <span className="line-clamp-1">{post.mess.location.address}</span>
                                            </div>
                                        )}

                                        {/* Cost */}
                                        {post.approximateMonthlyCost > 0 && (
                                            <p className="mt-2 font-extrabold text-base text-neutral leading-none">
                                                ৳{post.approximateMonthlyCost.toLocaleString()}
                                                <span className="ml-1 text-[11px] font-semibold text-neutral/40">/month</span>
                                            </p>
                                        )}

                                        {/* Advertised seats — always advertisedSeats */}
                                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-bold text-secondary">
                                            <Users size={11} />
                                            {post.advertisedSeats} Seat{post.advertisedSeats !== 1 ? "s" : ""} Available
                                        </div>

                                        {/* Type chips */}
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {post.roomType && (
                                                <span className="flex items-center gap-0.5 rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-neutral/70">
                                                    <BedDouble size={10} />{ROOM_LABEL[post.roomType] || post.roomType}
                                                </span>
                                            )}
                                            {post.foodSystem && (
                                                <span className="flex items-center gap-0.5 rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-neutral/70">
                                                    <Utensils size={10} />{FOOD_LABEL[post.foodSystem] || post.foodSystem}
                                                </span>
                                            )}
                                        </div>

                                        {/* Facilities */}
                                        {post.facilities?.length > 0 && (
                                            <p className="mt-1.5 text-[11px] text-neutral/50">
                                                {post.facilities.slice(0, 3).join(" · ")}
                                                {post.facilities.length > 3 && ` +${post.facilities.length - 3}`}
                                            </p>
                                        )}

                                        {/* View Details — deferred */}
                                        <button type="button" disabled title="Coming soon"
                                            className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 py-2 text-xs font-semibold text-neutral/40 cursor-not-allowed">
                                            View Details
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                    {/* User location marker */}
                    {userLocation && (
                        <Marker
                            position={[userLocation.lat, userLocation.lng]}
                            icon={userLocationIcon}
                            zIndexOffset={1000}
                        >
                            <Popup>
                                <p className="text-sm font-bold text-neutral">Your Location</p>
                                <p className="mt-0.5 text-xs text-neutral/50">Showing messes within 2 km</p>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>

                {/* No results overlay */}
                {!isLoading && posts.filter(p => p.mess?.location?.latitude != null).length === 0 && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="rounded-2xl bg-white/90 px-6 py-4 shadow text-center backdrop-blur-sm">
                            <p className="text-sm font-bold text-neutral">No messes found</p>
                            <p className="mt-1 text-xs text-neutral/50">Try adjusting your filters.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindMessMapPage;

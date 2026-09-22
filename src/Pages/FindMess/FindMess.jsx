import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
    Search, SlidersHorizontal, X, ChevronLeft, ChevronRight,
    Loader2, Home, Map, MapPin, ChevronRight as Chevron,
    Building2, Users, LayoutGrid,
} from "lucide-react";
import MessCard from "./MessCard";
import FindMessMap from "./FindMessMap";

// ─── constants (unchanged) ────────────────────────────────────────────────────

const MESS_TYPES  = [{ value: "", label: "All Types" }, { value: "student", label: "Student" }, { value: "job_holder", label: "Job Holder" }, { value: "mixed", label: "Mixed" }];
const ROOM_TYPES  = [{ value: "", label: "All Rooms" }, { value: "single", label: "Single Room" }, { value: "shared", label: "Shared Room" }, { value: "mixed", label: "Mixed" }];
const FOOD_TYPES  = [{ value: "", label: "All Food" }, { value: "meal_system", label: "Meal System" }, { value: "self_cooking", label: "Self Cooking" }, { value: "both", label: "Both" }];
const SORT_OPTIONS = [{ value: "newest", label: "Newest" }, { value: "lowest_cost", label: "Lowest Cost" }, { value: "available_seats", label: "Most Seats" }];
const ALL_FACILITIES = ["Wi-Fi", "Gas", "Electricity", "Water", "Dining", "Washing Machine", "Generator", "Parking"];
const PREFERRED_TYPES = [{ value: "", label: "Any Type" }, { value: "Student", label: "Student" }, { value: "Job Holder", label: "Job Holder" }];

// Plain axios — public endpoint, no auth required
const publicAxios = axios.create({ baseURL: import.meta.env.VITE_api_url });

const FilterSelect = ({ value, onChange, options }) => (
    <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-neutral outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
    >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
);

// ─── FindMess ─────────────────────────────────────────────────────────────────

const FindMess = () => {
    const navigate  = useNavigate();
    const cardRefs  = useRef({});

    // Filters (unchanged)
    const [searchInput, setSearchInput] = useState("");
    const [q, setQ]                     = useState("");
    const [messType, setMessType]       = useState("");
    const [roomType, setRoomType]       = useState("");
    const [foodSystem, setFoodSystem]   = useState("");
    const [minCost, setMinCost]         = useState("");
    const [maxCost, setMaxCost]         = useState("");
    const [sort, setSort]               = useState("newest");
    const [page, setPage]               = useState(1);
    const [moreOpen, setMoreOpen]       = useState(false);
    const [facilities, setFacilities]   = useState([]);
    const [minSeats, setMinSeats]       = useState("");
    const [preferredMemberType, setPreferred] = useState("");
    const [selectedId, setSelectedId]   = useState(null);

    const debounceRef = useRef(null);
    const handleSearchInput = (val) => {
        setSearchInput(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => { setQ(val); setPage(1); }, 400);
    };

    const resetPage = useCallback(() => setPage(1), []);

    // Build params (unchanged)
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
    params.set("sort", sort);
    params.set("page", page);
    params.set("limit", "12");

    const queryKey = ["public-mess-posts", q, messType, roomType, foodSystem, minCost, maxCost, minSeats, facilities.join(","), preferredMemberType, sort, page];

    const { data, isLoading, isError } = useQuery({
        queryKey,
        queryFn: async () => {
            const res = await publicAxios.get(`/public-mess-posts?${params}`);
            return res.data;
        },
        keepPreviousData: true,
    });

    const posts      = data?.data ?? [];
    const pagination = data?.pagination;

    useEffect(() => { setSelectedId(null); }, [q, messType, roomType, foodSystem, minCost, maxCost, minSeats, facilities.join(","), preferredMemberType, sort, page]);

    const handleMarkerClick = (postId) => {
        setSelectedId(postId);
        const el = cardRefs.current[postId];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    const toggleFacility = (f) => {
        setFacilities(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
        resetPage();
    };

    const clearFilters = () => {
        setQ(""); setSearchInput(""); setMessType(""); setRoomType("");
        setFoodSystem(""); setMinCost(""); setMaxCost(""); setSort("newest");
        setFacilities([]); setMinSeats(""); setPreferred(""); setPage(1);
    };

    const hasFilters       = q || messType || roomType || foodSystem || minCost || maxCost || minSeats || facilities.length || preferredMemberType;
    const moreFilterCount  = [minSeats, preferredMemberType, facilities.length ? "f" : ""].filter(Boolean).length;

    // Hero stats — derived from current result set (real data only)
    const totalAvailableSeats = posts.reduce((sum, p) => sum + (p.advertisedSeats || 0), 0);
    const uniqueLocations     = [...new Set(posts.flatMap(p => [p.mess?.location?.city, p.mess?.location?.area].filter(Boolean)))];

    // Quick Locations — from actual results
    const quickLocations = [...new Set(
        posts.flatMap(p => [p.mess?.location?.area, p.mess?.location?.city].filter(Boolean))
    )].slice(0, 6);

    // Result label for the summary line
    const resultLocation = uniqueLocations[0] || "Bangladesh";

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ══════════════════════════════════════════════════════════════
                HERO SECTION
            ══════════════════════════════════════════════════════════════ */}
            <div className="bg-gradient-to-b from-background to-white border-b border-primary/10">
                <div className="mx-auto max-w-7xl px-4 pt-8 pb-7 sm:px-6 lg:px-8">

                    {/* Breadcrumb */}
                    <nav className="mb-5 flex items-center gap-1.5 text-xs font-medium text-neutral/50">
                        <NavLink to="/" className="hover:text-primary transition">Home</NavLink>
                        <Chevron size={12} className="text-neutral/30" />
                        <span className="text-neutral/70">Find a Mess</span>
                        {(q || messType) && (
                            <>
                                <Chevron size={12} className="text-neutral/30" />
                                <span className="text-primary font-semibold capitalize">{q || MESS_TYPES.find(t => t.value === messType)?.label}</span>
                            </>
                        )}
                    </nav>

                    {/* Hero headline + stats */}
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                        {/* Left: headline + description + search */}
                        <div className="flex-1 max-w-2xl">
                            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-neutral sm:text-4xl lg:text-5xl">
                                Find Your Next{" "}
                                <span className="text-primary">Mess</span>{" "}
                                in Bangladesh
                            </h1>
                            <p className="mt-3 max-w-lg text-base text-neutral/60 leading-relaxed">
                                Looking for a seat? Explore available bachelor flats, student messes, and shared rooms with clear monthly costs and real seat availability.
                            </p>

                            {/* Search bar */}
                            <div className="mt-5 flex gap-2">
                                <div className="flex flex-1 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                                    <Search size={18} className="shrink-0 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={e => handleSearchInput(e.target.value)}
                                        placeholder="Search by area, city or mess name…"
                                        className="w-full bg-transparent text-sm text-neutral outline-none placeholder:text-gray-400"
                                    />
                                    {searchInput && (
                                        <button type="button" onClick={() => handleSearchInput("")}>
                                            <X size={15} className="text-gray-400 hover:text-neutral transition" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: stat cards — real data only */}
                        {!isLoading && pagination?.total > 0 && (
                            <div className="flex flex-row gap-3 lg:flex-col">
                                {/* Active messes */}
                                <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-white px-5 py-4 shadow-sm min-w-[150px]">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Building2 size={18} strokeWidth={2} />
                                    </span>
                                    <div>
                                        <p className="text-xl font-extrabold text-neutral leading-none">{pagination.total}</p>
                                        <p className="mt-0.5 text-xs font-semibold text-neutral/50">Available Messes</p>
                                    </div>
                                </div>

                                {/* Total advertised seats */}
                                {totalAvailableSeats > 0 && (
                                    <div className="flex items-center gap-3 rounded-2xl border border-secondary/15 bg-secondary/5 px-5 py-4 shadow-sm min-w-[150px]">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                                            <Users size={18} strokeWidth={2} />
                                        </span>
                                        <div>
                                            <p className="text-xl font-extrabold text-neutral leading-none">{totalAvailableSeats}</p>
                                            <p className="mt-0.5 text-xs font-semibold text-neutral/50">Open Seats</p>
                                        </div>
                                    </div>
                                )}

                                {/* Unique locations */}
                                {uniqueLocations.length > 0 && (
                                    <div className="flex items-center gap-3 rounded-2xl border border-tertiary/15 bg-tertiary/5 px-5 py-4 shadow-sm min-w-[150px]">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tertiary/15 text-tertiary">
                                            <LayoutGrid size={18} strokeWidth={2} />
                                        </span>
                                        <div>
                                            <p className="text-xl font-extrabold text-neutral leading-none">{uniqueLocations.length}</p>
                                            <p className="mt-0.5 text-xs font-semibold text-neutral/50">Locations</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Filter row */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <FilterSelect value={messType}  onChange={v => { setMessType(v);  resetPage(); }} options={MESS_TYPES}  />
                        <FilterSelect value={roomType}  onChange={v => { setRoomType(v);  resetPage(); }} options={ROOM_TYPES}  />
                        <FilterSelect value={foodSystem} onChange={v => { setFoodSystem(v); resetPage(); }} options={FOOD_TYPES} />

                        {/* Budget */}
                        <div className="flex items-center gap-1">
                            <input type="number" min={0} value={minCost}
                                onChange={e => { setMinCost(e.target.value); resetPage(); }}
                                placeholder="Min ৳"
                                className="h-9 w-20 rounded-xl border border-gray-200 bg-white px-3 text-xs outline-none focus:border-primary"
                            />
                            <span className="text-xs text-neutral/30">–</span>
                            <input type="number" min={0} value={maxCost}
                                onChange={e => { setMaxCost(e.target.value); resetPage(); }}
                                placeholder="Max ৳"
                                className="h-9 w-20 rounded-xl border border-gray-200 bg-white px-3 text-xs outline-none focus:border-primary"
                            />
                        </div>

                        {/* More Filters */}
                        <button
                            type="button"
                            onClick={() => setMoreOpen(v => !v)}
                            className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition ${
                                moreFilterCount > 0 ? "border-primary bg-primary/5 text-primary" : "border-gray-200 bg-white text-neutral/70 hover:border-primary/30 hover:text-primary"
                            }`}
                        >
                            <SlidersHorizontal size={13} />
                            More Filters
                            {moreFilterCount > 0 && (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">{moreFilterCount}</span>
                            )}
                        </button>

                        {/* Sort */}
                        <FilterSelect value={sort} onChange={v => { setSort(v); resetPage(); }} options={SORT_OPTIONS} />

                        {/* Clear */}
                        {hasFilters && (
                            <button type="button" onClick={clearFilters}
                                className="flex h-9 items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-500 transition hover:bg-red-100">
                                <X size={11} /> Clear
                            </button>
                        )}
                    </div>

                    {/* More Filters panel (unchanged logic) */}
                    {moreOpen && (
                        <div className="mt-3 rounded-2xl border border-primary/10 bg-white p-4 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start">
                                <div className="flex-1 min-w-[200px]">
                                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-neutral/40">Facilities</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {ALL_FACILITIES.map(f => (
                                            <button key={f} type="button" onClick={() => toggleFacility(f)}
                                                className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                                                    facilities.includes(f) ? "bg-primary text-white" : "border border-gray-200 bg-white text-neutral/60 hover:border-primary/30 hover:text-primary"
                                                }`}>
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral/40">Min. Advertised Seats</p>
                                        <input type="number" min={1} value={minSeats}
                                            onChange={e => { setMinSeats(e.target.value); resetPage(); }}
                                            placeholder="e.g. 2"
                                            className="w-28 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral/40">Preferred Member Type</p>
                                        <FilterSelect value={preferredMemberType} onChange={v => { setPreferred(v); resetPage(); }} options={PREFERRED_TYPES} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                MAIN CONTENT
            ══════════════════════════════════════════════════════════════ */}
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* Result summary line */}
                {!isLoading && !isError && pagination?.total > 0 && (
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-neutral sm:text-xl">
                                Showing <span className="text-primary">{pagination.total}</span> available mess{pagination.total !== 1 ? "es" : ""}
                            </h2>
                            <span className="hidden items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-secondary sm:inline-flex">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
                                Live
                            </span>
                        </div>
                        <p className="text-xs text-neutral/40 shrink-0">
                            Page {pagination.page} of {pagination.totalPages}
                        </p>
                    </div>
                )}

                <div className="flex gap-6 items-start">

                    {/* ── Cards column ───────────────────────────────────── */}
                    <div className="flex-1 min-w-0">
                        {isLoading && (
                            <div className="flex items-center justify-center py-24">
                                <Loader2 size={28} className="animate-spin text-primary/30" />
                            </div>
                        )}

                        {isError && !isLoading && (
                            <div className="flex flex-col items-center gap-2 py-24 text-center">
                                <p className="text-sm font-semibold text-neutral/60">Unable to load messes.</p>
                                <p className="text-xs text-neutral/40">Check your connection and try again.</p>
                            </div>
                        )}

                        {!isLoading && !isError && posts.length === 0 && (
                            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-primary/20 bg-white py-24 text-center shadow-sm">
                                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background text-primary">
                                    <Home size={28} strokeWidth={1.6} />
                                </span>
                                <div>
                                    <p className="text-base font-bold text-neutral">No mess found</p>
                                    <p className="mt-1.5 text-sm text-neutral/50 max-w-xs">
                                        Try changing your search or filters to find available messes.
                                    </p>
                                </div>
                                {hasFilters && (
                                    <button type="button" onClick={clearFilters}
                                        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90 hover:shadow-md">
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Card grid */}
                        {!isLoading && !isError && posts.length > 0 && (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                {posts.map(post => (
                                    <MessCard
                                        key={post._id}
                                        post={post}
                                        isSelected={post._id === selectedId}
                                        cardRef={el => { if (el) cardRefs.current[post._id] = el; }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination (unchanged logic) */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-between">
                                <p className="text-xs text-neutral/40">
                                    {Math.min((page - 1) * 12 + 1, pagination.total)}–{Math.min(page * 12, pagination.total)} of {pagination.total}
                                </p>
                                <div className="flex gap-1.5">
                                    <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-neutral/60 transition hover:border-primary/30 hover:text-primary disabled:opacity-40">
                                        <ChevronLeft size={15} />
                                    </button>
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                                        .reduce((acc, p, i, arr) => { if (i > 0 && p - arr[i - 1] > 1) acc.push("..."); acc.push(p); return acc; }, [])
                                        .map((p, i) => p === "..." ? (
                                            <span key={`d${i}`} className="flex h-9 w-9 items-center justify-center text-xs text-neutral/40">…</span>
                                        ) : (
                                            <button key={p} type="button" onClick={() => setPage(p)}
                                                className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-sm font-bold transition ${p === page ? "bg-primary text-white shadow-sm" : "border border-gray-200 text-neutral/60 hover:border-primary/30 hover:text-primary"}`}>
                                                {p}
                                            </button>
                                        ))
                                    }
                                    <button type="button" onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-neutral/60 transition hover:border-primary/30 hover:text-primary disabled:opacity-40">
                                        <ChevronRight size={15} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Right sidebar: map panel + quick locations ──────── */}
                    <div className="hidden lg:flex w-80 xl:w-96 shrink-0 flex-col gap-0">
                        <div className="sticky top-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                            {/* Map panel header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Map size={15} className="text-primary" />
                                    <p className="text-sm font-bold text-neutral">Mess Locations</p>
                                </div>
                                {!isLoading && posts.length > 0 && (
                                    <span className="text-[11px] font-semibold text-neutral/40">
                                        {posts.filter(p => p.mess?.location?.latitude != null).length} on map
                                    </span>
                                )}
                            </div>

                            {/* Map */}
                            <div className="h-56 relative">
                                <FindMessMap
                                    posts={posts}
                                    selectedId={selectedId}
                                    onMarkerClick={handleMarkerClick}
                                />
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[400]">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/find-mess/map")}
                                        className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-primary/90 hover:-translate-y-0.5"
                                    >
                                        <Map size={13} />
                                        View Full Map
                                    </button>
                                </div>
                            </div>

                            {/* Quick Locations */}
                            {quickLocations.length > 0 && (
                                <div className="p-4 border-t border-gray-100">
                                    <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-neutral/40">
                                        Quick Locations
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {quickLocations.map(loc => (
                                            <button
                                                key={loc}
                                                type="button"
                                                onClick={() => handleSearchInput(loc)}
                                                className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition ${
                                                    searchInput === loc
                                                        ? "border-primary bg-primary/5 text-primary"
                                                        : "border-gray-200 bg-gray-50 text-neutral/60 hover:border-primary/30 hover:text-primary"
                                                }`}
                                            >
                                                <MapPin size={10} className="shrink-0" />
                                                {loc}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Mobile: map + quick locations below cards ────────────── */}
                <div className="mt-7 lg:hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <Map size={14} className="text-primary" />
                            <p className="text-sm font-bold text-neutral">Mess Locations</p>
                        </div>
                    </div>
                    <div className="h-56 relative">
                        <FindMessMap
                            posts={posts}
                            selectedId={selectedId}
                            onMarkerClick={handleMarkerClick}
                        />
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[400]">
                            <button
                                type="button"
                                onClick={() => navigate("/find-mess/map")}
                                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-primary/90"
                            >
                                <Map size={13} />
                                View Full Map
                            </button>
                        </div>
                    </div>
                    {quickLocations.length > 0 && (
                        <div className="p-4 border-t border-gray-100">
                            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-neutral/40">Quick Locations</p>
                            <div className="flex flex-wrap gap-1.5">
                                {quickLocations.map(loc => (
                                    <button key={loc} type="button" onClick={() => handleSearchInput(loc)}
                                        className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-semibold text-neutral/60 transition hover:border-primary/30 hover:text-primary">
                                        <MapPin size={10} className="shrink-0" />{loc}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FindMess;

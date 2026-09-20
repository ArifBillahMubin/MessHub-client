import { useEffect, useRef, useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { Search, LocateFixed, Loader2, X } from 'lucide-react'

// ── Fix Leaflet default marker icon in Vite ──────────────────────────────────
// Vite does not process Leaflet's internal webpack asset URLs, so we point
// directly to the CDN copies that ship with the leaflet npm package.
const defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})
L.Marker.prototype.options.icon = defaultIcon

// Default center: Dhaka city centre
const DHAKA_CENTER = [23.8103, 90.4125]
const DEFAULT_ZOOM = 13

// ── Inner component: pans map when center prop changes ───────────────────────
const MapController = ({ center, zoom }) => {
    const map = useMap()
    useEffect(() => {
        if (center) {
            map.setView(center, zoom ?? DEFAULT_ZOOM, { animate: true })
        }
    }, [center, zoom, map])
    return null
}

// ── Inner component: captures map click events ───────────────────────────────
const ClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng)
        },
    })
    return null
}

// ── Nominatim reverse-geocode (lat/lng → address string) ────────────────────
const reverseGeocode = async (lat, lng) => {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        return data?.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
    } catch {
        return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
    }
}

// ── Nominatim forward-search (query → results list) ─────────────────────────
const forwardSearch = async (query) => {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=bd`,
        { headers: { 'Accept-Language': 'en' } }
    )
    return res.json()
}

// ────────────────────────────────────────────────────────────────────────────
// LeafletMap
//
// Props:
//   onLocationSelect(info) — called whenever the pin moves
//   info shape: { lat, lng, address }
// ────────────────────────────────────────────────────────────────────────────
const LeafletMap = ({ onLocationSelect }) => {
    const [markerPos, setMarkerPos] = useState(null)      // [lat, lng] | null
    const [mapCenter, setMapCenter] = useState(DHAKA_CENTER)
    const [mapZoom, setMapZoom]     = useState(DEFAULT_ZOOM)

    const [searchQuery, setSearchQuery]     = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching]     = useState(false)
    const [searchError, setSearchError]     = useState('')
    const [isLocating, setIsLocating]       = useState(false)

    const debounceRef = useRef(null)
    const searchInputRef = useRef(null)

    // ── Notify parent whenever marker moves ──────────────────────────────────
    const notifyParent = useCallback(async (lat, lng) => {
        const address = await reverseGeocode(lat, lng)
        onLocationSelect({ lat, lng, address })
    }, [onLocationSelect])

    // ── Pin placement (shared by map-click, search result, current location) ─
    const placePin = useCallback((lat, lng, zoom = DEFAULT_ZOOM) => {
        setMarkerPos([lat, lng])
        setMapCenter([lat, lng])
        setMapZoom(zoom)
        notifyParent(lat, lng)
    }, [notifyParent])

    // ── Map click handler ────────────────────────────────────────────────────
    const handleMapClick = useCallback((lat, lng) => {
        placePin(lat, lng, mapZoom)
    }, [placePin, mapZoom])

    // ── Debounced search input ───────────────────────────────────────────────
    const handleSearchInput = (e) => {
        const val = e.target.value
        setSearchQuery(val)
        setSearchError('')
        setSearchResults([])

        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (!val.trim()) return

        debounceRef.current = setTimeout(async () => {
            setIsSearching(true)
            try {
                const results = await forwardSearch(val)
                if (results.length === 0) {
                    setSearchError('No results found. Try a different search.')
                } else {
                    setSearchResults(results)
                }
            } catch {
                setSearchError('Search failed. Please try again.')
            } finally {
                setIsSearching(false)
            }
        }, 350)
    }

    // ── Pick a search result ─────────────────────────────────────────────────
    const handleResultSelect = (result) => {
        const lat = parseFloat(result.lat)
        const lng = parseFloat(result.lon)
        setSearchQuery(result.display_name)
        setSearchResults([])
        placePin(lat, lng, 16)
    }

    // ── Clear search ─────────────────────────────────────────────────────────
    const clearSearch = () => {
        setSearchQuery('')
        setSearchResults([])
        setSearchError('')
        searchInputRef.current?.focus()
    }

    // ── Use current location ─────────────────────────────────────────────────
    const handleCurrentLocation = () => {
        if (!navigator.geolocation) {
            setSearchError('Geolocation is not supported by your browser.')
            return
        }
        setIsLocating(true)
        setSearchError('')
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords
                placePin(latitude, longitude, 17)
                setIsLocating(false)
            },
            (err) => {
                setIsLocating(false)
                if (err.code === err.PERMISSION_DENIED) {
                    setSearchError('Location permission denied. Please allow location access in your browser.')
                } else {
                    setSearchError('Unable to retrieve your location. Please try again.')
                }
            },
            { timeout: 10000 }
        )
    }

    return (
        <div className="flex flex-col gap-3">

            {/* Search bar + current location */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                        {isSearching
                            ? <Loader2 size={15} className="shrink-0 animate-spin text-primary" />
                            : <Search size={15} className="shrink-0 text-gray-400" />
                        }
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchInput}
                            placeholder="Search area, road, or landmark…"
                            className="w-full bg-transparent py-2.5 text-sm text-neutral outline-none placeholder:text-gray-400"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="shrink-0 text-gray-400 hover:text-neutral"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Search dropdown results */}
                    {searchResults.length > 0 && (
                        <ul className="absolute left-0 right-0 top-full z-[9999] mt-1 max-h-52 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                            {searchResults.map((r) => (
                                <li key={r.place_id}>
                                    <button
                                        type="button"
                                        onClick={() => handleResultSelect(r)}
                                        className="w-full px-4 py-2.5 text-left text-xs text-neutral transition-colors hover:bg-background hover:text-primary"
                                    >
                                        {r.display_name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Current location button */}
                <button
                    type="button"
                    onClick={handleCurrentLocation}
                    disabled={isLocating}
                    title="Use my current location"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-background text-primary transition-all hover:bg-primary hover:text-white disabled:opacity-60"
                >
                    {isLocating
                        ? <Loader2 size={16} className="animate-spin" />
                        : <LocateFixed size={16} />
                    }
                </button>
            </div>

            {/* Error / hint messages */}
            {searchError && (
                <p className="text-[11px] font-medium text-tertiary">{searchError}</p>
            )}
            {!markerPos && !searchError && (
                <p className="text-[11px] font-medium text-neutral/40">
                    Search, click on the map, or use your current location to pin a spot.
                </p>
            )}

            {/* Map */}
            <div className="relative overflow-hidden rounded-2xl border border-primary/10 shadow-sm" style={{ height: '360px' }}>
                <MapContainer
                    center={DHAKA_CENTER}
                    zoom={DEFAULT_ZOOM}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Pan/zoom imperatively when mapCenter changes */}
                    <MapController center={mapCenter} zoom={mapZoom} />

                    {/* Capture clicks */}
                    <ClickHandler onMapClick={handleMapClick} />

                    {/* Marker */}
                    {markerPos && (
                        <Marker position={markerPos} icon={defaultIcon} />
                    )}
                </MapContainer>

                {/* Map overlay hint */}
                {!markerPos && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="rounded-xl bg-white/90 px-4 py-2 shadow-sm backdrop-blur-sm">
                            <p className="text-[11px] font-semibold text-neutral/60">Click anywhere to pin your mess location</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Selected location info */}
            {markerPos && (
                <div className="rounded-xl border border-primary/10 bg-background/60 px-4 py-3">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary/60">Selected Location</p>
                    <div className="flex items-start justify-between gap-4">
                        <p className="text-xs font-semibold text-neutral">{searchQuery || 'Custom location'}</p>
                        <div className="shrink-0 text-right">
                            <p className="text-[10px] text-neutral/50">
                                {markerPos[0].toFixed(5)}, {markerPos[1].toFixed(5)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LeafletMap

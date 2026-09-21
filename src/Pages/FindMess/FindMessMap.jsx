import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet default marker icon in Vite (same fix used in LeafletMap.jsx)
const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const selectedIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [30, 49],
    iconAnchor: [15, 49],
    popupAnchor: [1, -40],
    shadowSize: [49, 49],
    className: "leaflet-marker-selected",
});

// Dhaka default centre
const DHAKA = [23.8103, 90.4125];

// Inner controller — fits bounds or centers on selection
const MapController = ({ posts, selectedId }) => {
    const map = useMap();
    const prevSelectedId = useRef(null);

    useEffect(() => {
        if (!posts || posts.length === 0) return;

        // If a new post was selected, fly to it
        if (selectedId && selectedId !== prevSelectedId.current) {
            prevSelectedId.current = selectedId;
            const post = posts.find(p => p._id === selectedId);
            const lat = post?.mess?.location?.latitude;
            const lng = post?.mess?.location?.longitude;
            if (lat != null && lng != null) {
                map.flyTo([lat, lng], 16, { animate: true, duration: 0.8 });
                return;
            }
        }

        // Fit bounds to all valid markers when results change
        if (!selectedId) {
            const valid = posts.filter(
                p => p.mess?.location?.latitude != null && p.mess?.location?.longitude != null
            );
            if (valid.length === 0) return;
            if (valid.length === 1) {
                map.setView(
                    [valid[0].mess.location.latitude, valid[0].mess.location.longitude],
                    15
                );
                return;
            }
            const bounds = L.latLngBounds(
                valid.map(p => [p.mess.location.latitude, p.mess.location.longitude])
            );
            map.fitBounds(bounds, { padding: [40, 40] });
        }
    }, [posts, selectedId, map]);

    return null;
};

// ─── FindMessMap ──────────────────────────────────────────────────────────────

const FindMessMap = ({ posts, selectedId, onMarkerClick }) => {
    const markersRef = useRef({});

    // Open popup when selectedId changes
    useEffect(() => {
        if (selectedId && markersRef.current[selectedId]) {
            markersRef.current[selectedId].openPopup();
        }
    }, [selectedId]);

    return (
        <MapContainer
            center={DHAKA}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController posts={posts} selectedId={selectedId} />

            {posts.map(post => {
                const lat = post.mess?.location?.latitude;
                const lng = post.mess?.location?.longitude;
                if (lat == null || lng == null) return null;

                const isSelected = post._id === selectedId;

                return (
                    <Marker
                        key={post._id}
                        position={[lat, lng]}
                        icon={isSelected ? selectedIcon : defaultIcon}
                        ref={el => { if (el) markersRef.current[post._id] = el; }}
                        eventHandlers={{ click: () => onMarkerClick(post._id) }}
                    >
                        <Popup>
                            <div className="min-w-[160px]">
                                <p className="font-bold text-neutral text-sm">{post.mess?.name || post.title}</p>
                                {post.mess?.location?.address && (
                                    <p className="text-xs text-neutral/60 mt-0.5">{post.mess.location.address}</p>
                                )}
                                <div className="mt-1.5 flex flex-col gap-0.5 text-xs text-neutral/70">
                                    <span>{post.advertisedSeats} seat{post.advertisedSeats !== 1 ? "s" : ""} available</span>
                                    {post.approximateMonthlyCost > 0 && (
                                        <span>৳{post.approximateMonthlyCost.toLocaleString()}/month</span>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default FindMessMap;

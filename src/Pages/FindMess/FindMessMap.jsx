import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { isNearby } from "../../utils/haversine";

// ─── Icons ────────────────────────────────────────────────────────────────────

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
    className: "leaflet-marker-selected",
});

// Distinct pulsing dot for the user's own position
const userLocationIcon = L.divIcon({
    html: `<div style="position:relative;width:22px;height:22px">
        <div style="position:absolute;inset:0;border-radius:50%;background:rgba(0,107,104,0.15);animation:ulpulse 1.8s ease-in-out infinite"></div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:#006B68;border:2.5px solid #fff;box-shadow:0 1px 6px rgba(0,107,104,0.45)"></div>
        </div>
        <style>@keyframes ulpulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.8);opacity:.15}}</style>`,
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
});

const DHAKA = [23.8103, 90.4125];
const RADIUS_M = 2000; // 2 km in metres — used by Leaflet Circle

// ─── MapController ────────────────────────────────────────────────────────────
// Fits bounds to ALL mess markers + user location (unchanged behaviour).
// When user location is available the map opens centred on user + nearby area,
// but all markers remain visible and the user can pan/zoom freely.

const MapController = ({ posts, selectedId, userLocation }) => {
    const map = useMap();
    const prevSelectedId = useRef(null);

    useEffect(() => {
        // Fly to a selected marker (unchanged)
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

        if (!selectedId) {
            const valid = posts.filter(
                p => p.mess?.location?.latitude != null && p.mess?.location?.longitude != null
            );

            // Include ALL mess markers + user location in the fit — nothing is hidden
            const points = valid.map(p => [p.mess.location.latitude, p.mess.location.longitude]);
            if (userLocation) points.push([userLocation.lat, userLocation.lng]);

            if (points.length === 0) {
                if (userLocation) map.setView([userLocation.lat, userLocation.lng], 14);
                return;
            }
            if (points.length === 1) { map.setView(points[0], 15); return; }
            map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posts, selectedId, userLocation]);

    return null;
};

// ─── FindMessMap ──────────────────────────────────────────────────────────────
// Props:
//   posts         — full result array from the API
//   selectedId    — currently highlighted post _id
//   onMarkerClick — called when a mess marker is clicked
//   userLocation  — { lat, lng } | null  (from useUserLocation; optional)
//
// When userLocation is present:
//   • ALL markers are shown (no filtering)
//   • A 2 km Circle is drawn around the user
//   • Markers inside the circle get a "Within 2 km" badge in their popup
//   • The user's own position is shown as a distinct pulsing dot
// When userLocation is absent:
//   • Existing behaviour is preserved exactly

const FindMessMap = ({ posts, selectedId, onMarkerClick, userLocation }) => {
    const markersRef = useRef({});

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

            <MapController posts={posts} selectedId={selectedId} userLocation={userLocation} />

            {/* 2 km visual reference circle — only when location is available */}
            {userLocation && (
                <Circle
                    center={[userLocation.lat, userLocation.lng]}
                    radius={RADIUS_M}
                    pathOptions={{
                        color: "#006B68",
                        fillColor: "#006B68",
                        fillOpacity: 0.06,
                        weight: 1.5,
                        dashArray: "5 4",
                    }}
                />
            )}

            {/* ALL mess markers — no marker is removed or hidden */}
            {posts.map(post => {
                const lat = post.mess?.location?.latitude;
                const lng = post.mess?.location?.longitude;
                if (lat == null || lng == null) return null;

                const isSelected = post._id === selectedId;
                // Badge shown only in the popup — does not affect visibility
                const near = userLocation
                    ? isNearby(userLocation.lat, userLocation.lng, lat, lng)
                    : false;

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
                                {near && (
                                    <span style={{
                                        display: "inline-flex", alignItems: "center", gap: "4px",
                                        background: "#D5FBF9", color: "#006B68", borderRadius: "999px",
                                        padding: "2px 8px", fontSize: "10px", fontWeight: "700", marginBottom: "4px",
                                    }}>
                                        ● Within 2 km
                                    </span>
                                )}
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

            {/* User location marker */}
            {userLocation && (
                <Marker
                    position={[userLocation.lat, userLocation.lng]}
                    icon={userLocationIcon}
                    zIndexOffset={1000}
                >
                    <Popup>
                        <p className="text-sm font-bold text-neutral">Your Location</p>
                        <p className="mt-0.5 text-xs text-neutral/50">2 km radius shown</p>
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
};

export default FindMessMap;

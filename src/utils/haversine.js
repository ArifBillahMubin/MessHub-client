// Haversine formula — returns distance between two lat/lng points in kilometres.
// Pure function, no external dependencies.
const toRad = (deg) => (deg * Math.PI) / 180;

export const haversineKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Returns true when the mess is within radiusKm of the user.
export const isNearby = (userLat, userLng, messLat, messLng, radiusKm = 2) => {
    if (userLat == null || userLng == null || messLat == null || messLng == null) return false;
    return haversineKm(userLat, userLng, messLat, messLng) <= radiusKm;
};

import { useState, useEffect } from "react";

// Gets the browser's real geolocation once on mount.
// Returns { userLocation: { lat, lng } | null, locationError: string | null }
// userLocation is NEVER saved to the database — client-side only.
const useUserLocation = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            (err) => {
                if (err.code === err.PERMISSION_DENIED) {
                    setLocationError("Location permission denied.");
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    setLocationError("Location unavailable.");
                } else {
                    setLocationError("Could not get location.");
                }
            },
            { timeout: 10000 }
        );
    }, []);

    return { userLocation, locationError };
};

export default useUserLocation;
